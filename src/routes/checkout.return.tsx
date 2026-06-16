import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import knicksLogo from "@/assets/knicks-logo.svg.asset.json";
import camisaBrancaImg from "@/assets/camisa-branca.avif.asset.json";
import { trackPurchase } from "@/lib/purchase-tracking";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";

const UPSELL_PRICE_ID = "knicks_camisa_branca_always26";
const UPSELL_PRICE = 59.9;

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string; upsell?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
    upsell: typeof search.upsell === "string" ? search.upsell : undefined,
  }),
  component: CheckoutReturn,
});

type Stage = "upsell" | "upsell_checkout" | "confirmed";

function CheckoutReturn() {
  const { session_id: sessionId, upsell } = Route.useSearch();
  const [stage, setStage] = useState<Stage>(upsell === "done" ? "confirmed" : "upsell");

  useEffect(() => {
    if (!sessionId) return;
    trackPurchase(sessionId).catch((err) => console.error("Purchase tracking failed", err));
  }, [sessionId]);

  return (
    <div className="checkout-return-page">
      <style>{css}</style>

      {!sessionId ? (
        <div className="checkout-return-card">
          <div className="logo-wrap"><img src={knicksLogo.url} alt="New York Knicks" /></div>
          <h1>No Information Found</h1>
          <p className="sub">We could not locate this order. If you believe this is an error, please contact support.</p>
          <Link to="/" className="cta">← Back to Store</Link>
        </div>
      ) : stage === "upsell" ? (
        <div className="checkout-return-card upsell">
          <div className="confirm-banner">✅ Order confirmed! Your jersey is secured.</div>
          <div className="upsell-img"><img src={camisaBrancaImg.url} alt="Always 26 White Tee" /></div>
          <div className="upsell-eyebrow">WAIT — ONE MORE THING.</div>
          <h1>The shirt that represents the entire season.</h1>
          <p className="sub">
            It's not about one player. It's about the whole team that never gave up.
            <br />
            <strong>"Always 26"</strong> — the mantra that carried the Knicks to the title.
            <br />
            White edition, official 2026 Finals patch.
          </p>
          <div className="upsell-price">${UPSELL_PRICE.toFixed(2)}</div>
          <button className="cta" onClick={() => setStage("upsell_checkout")}>
            YES, ADD THE SHIRT TOO →
          </button>
          <button className="cta-ghost" onClick={() => setStage("confirmed")}>
            No thanks, the jersey is enough
          </button>
        </div>
      ) : stage === "upsell_checkout" ? (
        <div className="checkout-return-card upsell-checkout">
          <h1 style={{ fontSize: 18, marginBottom: 16 }}>Complete your Always 26 shirt</h1>
          <StripeEmbeddedCheckout
            priceId={UPSELL_PRICE_ID}
            returnUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/checkout/return?session_id={CHECKOUT_SESSION_ID}&upsell=done`}
          />
          <button className="cta-ghost" style={{ marginTop: 16 }} onClick={() => setStage("confirmed")}>
            Pular e finalizar pedido
          </button>
        </div>
      ) : (
        <div className="checkout-return-card">
          <div className="logo-wrap"><img src={knicksLogo.url} alt="New York Knicks" /></div>
          <h1>🏆 Order Confirmed!</h1>
          <p className="sub">Thank you for your purchase. You will receive an email with shipping details shortly.</p>
          <p className="order-id">Order: {sessionId}</p>
          <Link to="/" className="cta">← Back to Store</Link>
          <div className="divider" />
          <div className="trust">
            <span>🚚 Free shipping over $49.90</span>
            <span>🔒 Secure checkout</span>
            <span>✅ Official NBA product</span>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
.checkout-return-page {
  min-height: 100vh; background: #006BB6;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.checkout-return-card {
  background: #fff; border-radius: 16px; max-width: 560px; width: 100%;
  padding: 40px 28px; text-align: center; box-shadow: 0 24px 64px rgba(0,0,0,0.25);
}
.checkout-return-card.upsell-checkout { max-width: 720px; padding: 24px; }
.checkout-return-card .logo-wrap { width: 96px; height: 96px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
.checkout-return-card .logo-wrap img { width: 100%; height: 100%; object-fit: contain; }
.checkout-return-card h1 { font-size: 24px; font-weight: 800; color: #1a1a1a; margin-bottom: 12px; letter-spacing: -0.02em; text-transform: uppercase; }
.checkout-return-card .sub { color: #555; font-size: 15px; line-height: 1.55; margin-bottom: 16px; }
.checkout-return-card .order-id { font-size: 12px; color: #999; margin-bottom: 24px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-all; }
.checkout-return-card .cta {
  display: inline-block; background: #F58426; color: #fff; font-weight: 800;
  font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em;
  padding: 16px 28px; border-radius: 8px; text-decoration: none; border: none;
  cursor: pointer; width: 100%; margin-top: 8px;
  transition: transform 0.15s, box-shadow 0.15s;
}
.checkout-return-card .cta:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(245,132,38,0.35); }
.checkout-return-card .cta-ghost {
  display: inline-block; margin-top: 12px; background: transparent;
  color: #666; font-size: 13px; text-decoration: underline; border: none;
  cursor: pointer; width: 100%;
}
.checkout-return-card .divider { height: 1px; background: #eee; margin: 24px 0; }
.checkout-return-card .trust { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; font-size: 12px; color: #777; }
.checkout-return-card.upsell .confirm-banner {
  background: #E8F7EE; color: #146C2E; padding: 10px 14px; border-radius: 6px;
  font-size: 13px; font-weight: 700; margin-bottom: 18px;
}
.checkout-return-card .upsell-img { width: 200px; height: 200px; margin: 0 auto 16px; }
.checkout-return-card .upsell-img img { width: 100%; height: 100%; object-fit: contain; }
.checkout-return-card .upsell-eyebrow { color: #F58426; font-weight: 800; font-size: 13px; letter-spacing: 0.06em; margin-bottom: 10px; }
.checkout-return-card .upsell-price { font-size: 32px; font-weight: 900; color: #006BB6; margin: 14px 0 18px; }
@media (max-width: 480px) {
  .checkout-return-card { padding: 28px 18px; }
  .checkout-return-card h1 { font-size: 20px; }
}
`;
