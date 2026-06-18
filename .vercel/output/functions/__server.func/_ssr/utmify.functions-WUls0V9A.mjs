import { c as createServerRpc, a as createStripeClient } from "./stripe.server-BpxKpKiC.mjs";
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
function toUtcString(d) {
  return d.toISOString().replace("T", " ").slice(0, 19);
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const STRIPE_PAYMENT_METHOD_TO_UTMIFY = {
  card: "credit_card",
  boleto: "boleto",
  pix: "pix",
  paypal: "paypal"
};
function metadataTracking(metadata) {
  return {
    src: metadata?.utmify_src ?? null,
    sck: metadata?.utmify_sck ?? null,
    utm_source: metadata?.utmify_utm_source ?? null,
    utm_medium: metadata?.utmify_utm_medium ?? null,
    utm_campaign: metadata?.utmify_utm_campaign ?? null,
    utm_content: metadata?.utmify_utm_content ?? null,
    utm_term: metadata?.utmify_utm_term ?? null
  };
}
const preferTracking = (primary, fallback) => primary ?? fallback ?? null;
const sendUtmifyOrder_createServerFn_handler = createServerRpc({
  id: "2d26034e4c816809b097f48fd4e9f2fe9f6da925f212611b2ee05bf0f5be0147",
  name: "sendUtmifyOrder",
  filename: "src/utils/utmify.functions.ts"
}, (opts) => sendUtmifyOrder.__executeServer(opts));
const sendUtmifyOrder = createServerFn({
  method: "POST"
}).validator((data) => {
  if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(data.sessionId)) throw new Error("Invalid sessionId");
  return data;
}).handler(sendUtmifyOrder_createServerFn_handler, async ({
  data
}) => {
  try {
    const token = process.env.UTMIFY_API_TOKEN;
    if (!token) return {
      ok: false,
      error: "UTMIFY_API_TOKEN not configured"
    };
    const stripe = createStripeClient(data.environment);
    let session = await stripe.checkout.sessions.retrieve(data.sessionId, {
      expand: ["customer_details", "line_items"]
    });
    for (const waitMs of [800, 1600, 3e3, 5e3]) {
      if (session.payment_status === "paid") break;
      await delay(waitMs);
      session = await stripe.checkout.sessions.retrieve(data.sessionId, {
        expand: ["customer_details", "line_items"]
      });
    }
    if (session.payment_status !== "paid") {
      return {
        ok: false,
        error: `Session not paid (${session.payment_status})`
      };
    }
    const totalPriceInCents = session.amount_total ?? 0;
    const currency = (session.currency ?? "usd").toUpperCase();
    const email = session.customer_details?.email ?? "";
    const name = session.customer_details?.name ?? "Customer";
    const phone = session.customer_details?.phone ?? null;
    const country = session.customer_details?.address?.country ?? null;
    const paymentMethodType = session.payment_method_types?.[0] ?? "card";
    const paymentMethod = STRIPE_PAYMENT_METHOD_TO_UTMIFY[paymentMethodType] ?? "credit_card";
    const lineItems = session.line_items?.data ?? [];
    const products = lineItems.length ? lineItems.map((li) => ({
      id: li.price?.id ?? li.id,
      name: li.description ?? "Product",
      planId: null,
      planName: null,
      quantity: li.quantity ?? 1,
      priceInCents: Math.round((li.amount_total ?? 0) / Math.max(li.quantity ?? 1, 1))
    })) : [{
      id: data.sessionId,
      name: "Order",
      planId: null,
      planName: null,
      quantity: 1,
      priceInCents: totalPriceInCents
    }];
    const createdAt = toUtcString(session.created ? new Date(session.created * 1e3) : /* @__PURE__ */ new Date());
    const approvedDate = toUtcString(session.status === "complete" && session.created ? new Date(session.created * 1e3) : /* @__PURE__ */ new Date());
    const fallbackTracking = metadataTracking(session.metadata);
    const t = data.tracking ?? {};
    const payload = {
      orderId: data.sessionId,
      platform: "Stripe",
      paymentMethod,
      status: "paid",
      createdAt,
      approvedDate,
      refundedAt: null,
      customer: {
        name,
        email,
        phone,
        document: null,
        country,
        ip: data.ip ?? null
      },
      products,
      trackingParameters: {
        src: preferTracking(t.src, fallbackTracking.src),
        sck: preferTracking(t.sck, fallbackTracking.sck),
        utm_source: preferTracking(t.utm_source, fallbackTracking.utm_source),
        utm_medium: preferTracking(t.utm_medium, fallbackTracking.utm_medium),
        utm_campaign: preferTracking(t.utm_campaign, fallbackTracking.utm_campaign),
        utm_content: preferTracking(t.utm_content, fallbackTracking.utm_content),
        utm_term: preferTracking(t.utm_term, fallbackTracking.utm_term)
      },
      commission: {
        totalPriceInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: totalPriceInCents,
        currency
      },
      isTest: data.environment === "sandbox"
    };
    const res = await fetch("https://api.utmify.com.br/api-credentials/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": token
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("UTMify order error:", res.status, text);
      return {
        ok: false,
        error: `UTMify ${res.status}: ${text}`
      };
    }
    console.info("UTMify order sent", {
      orderId: data.sessionId,
      status: res.status
    });
    return {
      ok: true
    };
  } catch (e) {
    console.error("sendUtmifyOrder failed:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "unknown"
    };
  }
});
export {
  sendUtmifyOrder_createServerFn_handler
};
