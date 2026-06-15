import { createServerFn } from "@tanstack/react-start";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";

type UtmifyResult = { ok: true } | { ok: false; error: string };

export type TrackingParams = {
  src?: string | null;
  sck?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
};

function toUtcString(d: Date): string {
  // UTMify expects "YYYY-MM-DD HH:MM:SS" in UTC
  return d.toISOString().replace("T", " ").slice(0, 19);
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STRIPE_PAYMENT_METHOD_TO_UTMIFY: Record<string, "credit_card" | "boleto" | "pix" | "paypal"> = {
  card: "credit_card",
  boleto: "boleto",
  pix: "pix",
  paypal: "paypal",
};

function metadataTracking(metadata?: Record<string, string> | null): TrackingParams {
  return {
    src: metadata?.utmify_src ?? null,
    sck: metadata?.utmify_sck ?? null,
    utm_source: metadata?.utmify_utm_source ?? null,
    utm_medium: metadata?.utmify_utm_medium ?? null,
    utm_campaign: metadata?.utmify_utm_campaign ?? null,
    utm_content: metadata?.utmify_utm_content ?? null,
    utm_term: metadata?.utmify_utm_term ?? null,
  };
}

const preferTracking = (primary?: string | null, fallback?: string | null) => primary ?? fallback ?? null;

export const sendUtmifyOrder = createServerFn({ method: "POST" })
  .inputValidator((data: {
    sessionId: string;
    environment: StripeEnv;
    ip?: string;
    userAgent?: string;
    tracking?: TrackingParams;
  }) => {
    if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(data.sessionId)) throw new Error("Invalid sessionId");
    return data;
  })
  .handler(async ({ data }): Promise<UtmifyResult> => {
    try {
      const token = process.env.UTMIFY_API_TOKEN;
      if (!token) return { ok: false, error: "UTMIFY_API_TOKEN not configured" };

      const stripe = createStripeClient(data.environment);
      let session = await stripe.checkout.sessions.retrieve(data.sessionId, {
        expand: ["customer_details", "line_items"],
      });

      for (const waitMs of [800, 1600, 3000, 5000]) {
        if (session.payment_status === "paid") break;
        await delay(waitMs);
        session = await stripe.checkout.sessions.retrieve(data.sessionId, {
          expand: ["customer_details", "line_items"],
        });
      }

      if (session.payment_status !== "paid") {
        return { ok: false, error: `Session not paid (${session.payment_status})` };
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
      const products = lineItems.length
        ? lineItems.map((li) => ({
            id: (li.price?.id ?? li.id) as string,
            name: li.description ?? "Product",
            planId: null,
            planName: null,
            quantity: li.quantity ?? 1,
            priceInCents: Math.round((li.amount_total ?? 0) / Math.max(li.quantity ?? 1, 1)),
          }))
        : [
            {
              id: data.sessionId,
              name: "Order",
              planId: null,
              planName: null,
              quantity: 1,
              priceInCents: totalPriceInCents,
            },
          ];

      const createdAt = toUtcString(
        session.created ? new Date(session.created * 1000) : new Date(),
      );
      const approvedDate = toUtcString(
        session.status === "complete" && session.created ? new Date(session.created * 1000) : new Date(),
      );

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
          ip: data.ip ?? null,
        },
        products,
        trackingParameters: {
          src: preferTracking(t.src, fallbackTracking.src),
          sck: preferTracking(t.sck, fallbackTracking.sck),
          utm_source: preferTracking(t.utm_source, fallbackTracking.utm_source),
          utm_medium: preferTracking(t.utm_medium, fallbackTracking.utm_medium),
          utm_campaign: preferTracking(t.utm_campaign, fallbackTracking.utm_campaign),
          utm_content: preferTracking(t.utm_content, fallbackTracking.utm_content),
          utm_term: preferTracking(t.utm_term, fallbackTracking.utm_term),
        },
        commission: {
          totalPriceInCents,
          gatewayFeeInCents: 0,
          userCommissionInCents: totalPriceInCents,
          currency,
        },
        isTest: data.environment === "sandbox",
      };

      const res = await fetch("https://api.utmify.com.br/api-credentials/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": token,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("UTMify order error:", res.status, text);
        return { ok: false, error: `UTMify ${res.status}: ${text}` };
      }
      console.info("UTMify order sent", { orderId: data.sessionId, status: res.status });
      return { ok: true };
    } catch (e) {
      console.error("sendUtmifyOrder failed:", e);
      return { ok: false, error: e instanceof Error ? e.message : "unknown" };
    }
  });
