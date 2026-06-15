import { createServerFn } from "@tanstack/react-start";
import { createHash } from "crypto";
import { createStripeClient, type StripeEnv } from "@/lib/stripe.server";

type CapiResult = { ok: true } | { ok: false; error: string };

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export const sendPurchaseCapi = createServerFn({ method: "POST" })
  .inputValidator((data: {
    sessionId: string;
    environment: StripeEnv;
    eventSourceUrl: string;
    userAgent: string;
    ip?: string;
    fbp?: string;
    fbc?: string;
  }) => {
    if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(data.sessionId)) throw new Error("Invalid sessionId");
    return data;
  })
  .handler(async ({ data }): Promise<CapiResult> => {
    try {
      const pixelId = process.env.META_PIXEL_ID;
      const token = process.env.META_CAPI_ACCESS_TOKEN;
      if (!pixelId || !token) return { ok: false, error: "Meta CAPI not configured" };

      const stripe = createStripeClient(data.environment);
      const session = await stripe.checkout.sessions.retrieve(data.sessionId, {
        expand: ["customer_details"],
      });

      if (session.payment_status !== "paid") {
        return { ok: false, error: `Session not paid (${session.payment_status})` };
      }

      const value = (session.amount_total ?? 0) / 100;
      const currency = (session.currency ?? "usd").toUpperCase();
      const email = session.customer_details?.email ?? undefined;
      const phone = session.customer_details?.phone ?? undefined;
      const name = session.customer_details?.name ?? "";
      const [fn, ...lnParts] = name.split(" ");
      const ln = lnParts.join(" ");
      const country = session.customer_details?.address?.country ?? undefined;

      const userData: Record<string, unknown> = {
        client_user_agent: data.userAgent,
      };
      if (data.ip) userData.client_ip_address = data.ip;
      if (email) userData.em = [sha256(email)];
      if (phone) userData.ph = [sha256(phone.replace(/\D/g, ""))];
      if (fn) userData.fn = [sha256(fn)];
      if (ln) userData.ln = [sha256(ln)];
      if (country) userData.country = [sha256(country)];
      if (data.fbp) userData.fbp = data.fbp;
      if (data.fbc) userData.fbc = data.fbc;

      const payload = {
        data: [
          {
            event_name: "Purchase",
            event_time: Math.floor(Date.now() / 1000),
            event_id: data.sessionId,
            event_source_url: data.eventSourceUrl,
            action_source: "website",
            user_data: userData,
            custom_data: {
              currency,
              value,
              order_id: data.sessionId,
            },
          },
        ],
      };

      const res = await fetch(
        `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Meta CAPI error:", res.status, text);
        return { ok: false, error: `Meta CAPI ${res.status}` };
      }
      return { ok: true };
    } catch (e) {
      console.error("sendPurchaseCapi failed:", e);
      return { ok: false, error: e instanceof Error ? e.message : "unknown" };
    }
  });
