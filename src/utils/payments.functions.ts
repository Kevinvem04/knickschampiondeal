import { createServerFn } from "@tanstack/react-start";
import { type StripeEnv, createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";

type CheckoutSessionResult = { clientSecret: string } | { error: string };

type CartItem = { priceId: string; quantity?: number; size?: string };
type TrackingParams = {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

const cleanMetaValue = (value?: string | null) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 500) : undefined;
};

const buildTrackingMetadata = (tracking?: TrackingParams) => Object.fromEntries(
  Object.entries(tracking ?? {})
    .map(([key, value]) => [`utmify_${key}`, cleanMetaValue(value)])
    .filter((entry): entry is [string, string] => Boolean(entry[1])),
);

const buildClientReferenceId = (tracking?: TrackingParams) => {
  const sanitize = (value?: string | null) => cleanMetaValue(value)?.split("::")[0].split("|").pop()?.replace(/[^A-Za-z0-9_-]/g, "") ?? "";
  const ref = [tracking?.utm_source, tracking?.utm_medium, tracking?.utm_campaign, tracking?.utm_content, tracking?.utm_term]
    .map(sanitize)
    .join("__")
    .slice(0, 200);
  return ref.replace(/_/g, "") ? ref : undefined;
};

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: {
    priceId?: string;
    quantity?: number;
    size?: string;
    items?: CartItem[];
    customerEmail?: string;
    returnUrl: string;
    environment: StripeEnv;
    tracking?: TrackingParams;
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
      const trackingMeta = buildTrackingMetadata(data.tracking);
      const metadata = { ...sizeMeta, ...trackingMeta };
      const clientReferenceId = buildClientReferenceId(data.tracking);

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        ui_mode: "embedded_page",
        redirect_on_completion: "if_required",
        return_url: data.returnUrl,
        ...(clientReferenceId && { client_reference_id: clientReferenceId }),
        ...(data.customerEmail && { customer_email: data.customerEmail }),
        shipping_address_collection: {
          allowed_countries: ["BR", "US", "CA", "GB", "PT", "ES", "FR", "DE", "IT", "MX", "AR", "CL", "CO", "AU"],
        },
        payment_intent_data: {
          description,
          ...(Object.keys(metadata).length > 0 && { metadata }),
        },
        metadata,
      });

      return { clientSecret: session.client_secret ?? "" };
    } catch (error) {
      return { error: getStripeErrorMessage(error) };
    }
  });
