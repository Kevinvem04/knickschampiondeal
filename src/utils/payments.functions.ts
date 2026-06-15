import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

type CheckoutSessionResult = { clientSecret: string } | { error: string };

type CartItem = { priceId: string; quantity?: number; size?: string };

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: {
    priceId?: string;
    quantity?: number;
    size?: string;
    items?: CartItem[];
    customerEmail?: string;
    returnUrl: string;
    environment: StripeEnv;
  }) => {
    const items: CartItem[] = data.items && data.items.length > 0
      ? data.items
      : data.priceId
        ? [{ priceId: data.priceId, quantity: data.quantity, size: data.size }]
        : [];
    if (items.length === 0) throw new Error("No items provided");
    for (const it of items) {
      if (!/^[a-zA-Z0-9_-]+$/.test(it.priceId)) throw new Error("Invalid priceId");
    }
    return { ...data, items };
  })
  .handler(async ({ data }): Promise<CheckoutSessionResult> => {
    try {
      const stripe = createStripeClient(data.environment);

      const lineItems: { price: string; quantity: number }[] = [];
      const descriptions: string[] = [];
      const sizeMeta: Record<string, string> = {};

      for (const it of data.items) {
        const prices = await stripe.prices.list({ lookup_keys: [it.priceId] });
        if (!prices.data.length) throw new Error(`Price not found: ${it.priceId}`);
        const stripePrice = prices.data[0];
        lineItems.push({ price: stripePrice.id, quantity: it.quantity || 1 });

        const productId = typeof stripePrice.product === "string"
          ? stripePrice.product
          : stripePrice.product.id;
        const product = await stripe.products.retrieve(productId);
        descriptions.push(it.size ? `${product.name} (${it.size})` : product.name);
        if (it.size) sizeMeta[`size_${it.priceId}`] = it.size;
      }

      const description = descriptions.length === 1
        ? descriptions[0]
        : `Knicks Bundle: ${descriptions.join(" + ")}`.slice(0, 500);

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: data.returnUrl,
        ...(data.customerEmail && { customer_email: data.customerEmail }),
        shipping_address_collection: {
          allowed_countries: ["BR", "US", "CA", "GB", "PT", "ES", "FR", "DE", "IT", "MX", "AR", "CL", "CO", "AU"],
        },
        payment_intent_data: {
          description,
          ...(Object.keys(sizeMeta).length > 0 && { metadata: sizeMeta }),
        },
        metadata: sizeMeta,
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
