import { c as createServerRpc, a as createStripeClient, g as getStripeErrorMessage } from "./stripe.server-BpxKpKiC.mjs";
import { b as createServerFn } from "./server-wIqWYVKK.mjs";
import "../_libs/stripe.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "events";
import "http";
import "https";
import "os";
const cleanMetaValue = (value) => {
  if (!value) return void 0;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 500) : void 0;
};
const buildTrackingMetadata = (tracking) => Object.fromEntries(Object.entries(tracking ?? {}).map(([key, value]) => [`utmify_${key}`, cleanMetaValue(value)]).filter((entry) => Boolean(entry[1])));
const buildClientReferenceId = (tracking) => {
  const sanitize = (value) => cleanMetaValue(value)?.split("::")[0].split("|").pop()?.replace(/[^A-Za-z0-9_-]/g, "") ?? "";
  const ref = [tracking?.utm_source, tracking?.utm_medium, tracking?.utm_campaign, tracking?.utm_content, tracking?.utm_term].map(sanitize).join("__").slice(0, 200);
  return ref.replace(/_/g, "") ? ref : void 0;
};
const createCheckoutSession_createServerFn_handler = createServerRpc({
  id: "6186b6303b8f63886db376ba9a679f2f179f7619f609db631a0d86c4045dec88",
  name: "createCheckoutSession",
  filename: "src/utils/payments.functions.ts"
}, (opts) => createCheckoutSession.__executeServer(opts));
const createCheckoutSession = createServerFn({
  method: "POST"
}).validator((data) => {
  const items = data.items && data.items.length > 0 ? data.items : data.priceId ? [{
    priceId: data.priceId,
    quantity: data.quantity,
    size: data.size
  }] : [];
  if (items.length === 0) throw new Error("No items provided");
  for (const it of items) {
    if (!/^[a-zA-Z0-9_-]+$/.test(it.priceId)) throw new Error("Invalid priceId");
  }
  return {
    ...data,
    items
  };
}).handler(createCheckoutSession_createServerFn_handler, async ({
  data
}) => {
  try {
    const stripe = createStripeClient(data.environment);
    const lineItems = [];
    const descriptions = [];
    const sizeMeta = {};
    for (const it of data.items) {
      const prices = await stripe.prices.list({
        lookup_keys: [it.priceId]
      });
      if (!prices.data.length) {
        if (it.name && it.price) {
          lineItems.push({
            price_data: {
              currency: "usd",
              product_data: {
                name: it.size ? `${it.name} (${it.size})` : it.name
              },
              unit_amount: Math.round(it.price * 100)
            },
            quantity: it.quantity || 1
          });
          descriptions.push(it.size ? `${it.name} (${it.size})` : it.name);
          if (it.size) sizeMeta[`size_${it.priceId}`] = it.size;
          continue;
        } else {
          throw new Error(`Price not found: ${it.priceId}`);
        }
      }
      const stripePrice = prices.data[0];
      lineItems.push({
        price: stripePrice.id,
        quantity: it.quantity || 1
      });
      const productName = it.name || "Knicks Product";
      descriptions.push(it.size ? `${productName} (${it.size})` : productName);
      if (it.size) sizeMeta[`size_${it.priceId}`] = it.size;
    }
    const description = descriptions.length === 1 ? descriptions[0] : `Knicks Bundle: ${descriptions.join(" + ")}`.slice(0, 500);
    const trackingMeta = buildTrackingMetadata(data.tracking);
    const metadata = {
      ...sizeMeta,
      ...trackingMeta
    };
    const clientReferenceId = buildClientReferenceId(data.tracking);
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      ui_mode: "embedded_page",
      redirect_on_completion: "always",
      return_url: data.returnUrl,
      ...clientReferenceId && {
        client_reference_id: clientReferenceId
      },
      ...data.customerEmail && {
        customer_email: data.customerEmail
      },
      shipping_address_collection: {
        allowed_countries: ["BR", "US", "CA", "GB", "PT", "ES", "FR", "DE", "IT", "MX", "AR", "CL", "CO", "AU"]
      },
      payment_intent_data: {
        description,
        ...Object.keys(metadata).length > 0 && {
          metadata
        }
      },
      metadata
    });
    return {
      clientSecret: session.client_secret ?? ""
    };
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return {
      error: getStripeErrorMessage(error)
    };
  }
});
export {
  createCheckoutSession_createServerFn_handler
};
