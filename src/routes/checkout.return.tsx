import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import knicksLogo from "@/assets/knicks-logo.svg.asset.json";
import { getStripeEnvironment } from "@/lib/stripe";
import { sendPurchaseCapi } from "@/utils/meta-capi.functions";
import { sendUtmifyOrder } from "@/utils/utmify.functions";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function readTracking() {
  // UTMify's UTM script persists params in localStorage / cookies. We try
  // multiple known keys, then fall back to current URL params.
  const keys = ["utmify", "utms", "utmify_utms"];
  let stored: Record<string, string> = {};
  try {
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") stored = { ...stored, ...parsed };
        } catch {
          // not JSON, skip
        }
      }
    }
  } catch {
    // localStorage may be unavailable
  }
  const params = new URLSearchParams(window.location.search);
  const pick = (k: string) =>
    stored[k] ?? readCookie(k) ?? params.get(k) ?? null;
  return {
    src: pick("src"),
    sck: pick("sck"),
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
  };
}

function CheckoutReturn() {
  const { session_id: sessionId } = Route.useSearch();
  useEffect(() => {
    if (!sessionId) return;
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    if (typeof w.fbq === "function") {
      w.fbq("track", "Purchase", { currency: "USD", value: 49.9 }, { eventID: sessionId });
    }
    const environment = getStripeEnvironment();
    // Server-side Conversions API (deduped by eventID = sessionId)
    sendPurchaseCapi({
      data: {
        sessionId,
        environment,
        eventSourceUrl: window.location.href,
        userAgent: navigator.userAgent,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
      },
    }).catch((err) => console.error("CAPI dispatch failed", err));
    // UTMify server-side order
    sendUtmifyOrder({
      data: {
        sessionId,
        environment,
        userAgent: navigator.userAgent,
        tracking: readTracking(),
      },
    }).catch((err) => console.error("UTMify dispatch failed", err));
  }, [sessionId]);

  return (
    <div className="checkout-return-page">
      <style>{`
        .checkout-return-page {
          min-height: 100vh;
          background: #006BB6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .checkout-return-card {
          background: #ffffff;
          border-radius: 16px;
          max-width: 520px;
          width: 100%;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 24px 64px rgba(0,0,0,0.25);
        }
        .checkout-return-card .logo-wrap {
          width: 96px;
          height: 96px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .checkout-return-card .logo-wrap img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .checkout-return-card h1 {
          font-size: 26px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
          text-transform: uppercase;
        }
        .checkout-return-card .sub {
          color: #555;
          font-size: 15px;
          line-height: 1.55;
          margin-bottom: 8px;
        }
        .checkout-return-card .order-id {
          font-size: 12px;
          color: #999;
          margin-bottom: 28px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          word-break: break-all;
        }
        .checkout-return-card .cta {
          display: inline-block;
          background: #F58426;
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .checkout-return-card .cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(245,132,38,0.35);
        }
        .checkout-return-card .divider {
          height: 1px;
          background: #eee;
          margin: 28px 0;
        }
        .checkout-return-card .trust {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
          font-size: 12px;
          color: #777;
        }
        .checkout-return-card .trust span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        @media (max-width: 480px) {
          .checkout-return-card { padding: 32px 20px; }
          .checkout-return-card h1 { font-size: 22px; }
        }
      `}</style>

      <div className="checkout-return-card">
        <div className="logo-wrap">
          <img src={knicksLogo.url} alt="New York Knicks" />
        </div>

        {sessionId ? (
          <>
            <h1>🏆 Order Confirmed!</h1>
            <p className="sub">
              Thank you for your purchase. You will receive an email with shipping details shortly.
            </p>
            <p className="order-id">Order: {sessionId}</p>
          </>
        ) : (
          <>
            <h1>No Information Found</h1>
            <p className="sub">
              We could not locate this order. If you believe this is an error, please contact support.
            </p>
          </>
        )}

        <Link to="/" className="cta">← Back to Store</Link>

        <div className="divider" />
        <div className="trust">
          <span>🚚 Free shipping over $49.90</span>
          <span>🔒 Secure checkout</span>
          <span>✅ Official NBA product</span>
        </div>
      </div>
    </div>
  );
}
