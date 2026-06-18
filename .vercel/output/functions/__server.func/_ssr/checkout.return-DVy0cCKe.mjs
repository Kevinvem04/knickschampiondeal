import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as trackPurchase, k as knicksLogo, c as camisaBrancaImg, S as StripeEmbeddedCheckout } from "./StripeEmbeddedCheckout-C3kdybDv.mjs";
import { R as Route } from "./router-D5vqh3Zi.mjs";
import "../_libs/stripe__react-stripe-js.mjs";
import "../_libs/stripe__stripe-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-wIqWYVKK.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/prop-types.mjs";
const UPSELL_PRICE_ID = "knicks_camisa_branca_always26";
const UPSELL_PRICE = 59.9;
function CheckoutReturn() {
  const {
    session_id: sessionId,
    upsell
  } = Route.useSearch();
  const [stage, setStage] = reactExports.useState(upsell === "done" ? "confirmed" : "upsell");
  reactExports.useEffect(() => {
    if (!sessionId) return;
    trackPurchase(sessionId).catch((err) => console.error("Purchase tracking failed", err));
  }, [sessionId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "checkout-return-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: css }),
    !sessionId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "checkout-return-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "logo-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: knicksLogo, alt: "New York Knicks" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "No Information Found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "sub", children: "We could not locate this order. If you believe this is an error, please contact support." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "cta", children: "← Back to Store" })
    ] }) : stage === "upsell" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "checkout-return-card upsell", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "confirm-banner", children: "✅ Order confirmed! Your jersey is secured." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upsell-img", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: camisaBrancaImg, alt: "Always 26 White Tee" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upsell-eyebrow", children: "WAIT — ONE MORE THING." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "The shirt that represents the entire season." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sub", children: [
        "It's not about one player. It's about the whole team that never gave up.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: '"Always 26"' }),
        " — the mantra that carried the Knicks to the title.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "White edition, official 2026 Finals patch."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "upsell-price", children: [
        "$",
        UPSELL_PRICE.toFixed(2)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "cta", onClick: () => setStage("upsell_checkout"), children: "YES, ADD THE SHIRT TOO →" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "cta-ghost", onClick: () => setStage("confirmed"), children: "No thanks, the jersey is enough" })
    ] }) : stage === "upsell_checkout" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "checkout-return-card upsell-checkout", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
        fontSize: 18,
        marginBottom: 16
      }, children: "Complete your Always 26 shirt" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StripeEmbeddedCheckout, { priceId: UPSELL_PRICE_ID, returnUrl: `${typeof window !== "undefined" ? window.location.origin : ""}/checkout/return?session_id={CHECKOUT_SESSION_ID}&upsell=done` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "cta-ghost", style: {
        marginTop: 16
      }, onClick: () => setStage("confirmed"), children: "Skip and finish order" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "checkout-return-card thankyou", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "logo-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: knicksLogo, alt: "New York Knicks" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "confirm-banner", children: "✅ Payment received — your order is confirmed!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "🏆 Thank you, Knicks fan!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "sub", children: [
        "You're officially part of the ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "2026 Championship" }),
        " celebration.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "You can relax — everything is taken care of." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "We've received your payment and our team is already preparing your order with care."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "next-steps", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "step", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "step-icon", children: "📧" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Order confirmation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A receipt is on its way to your inbox right now." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "step", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "step-icon", children: "📦" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Shipping updates by email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "As soon as your order ships, you'll receive an email with your tracking number and delivery details — straight from our New York fulfillment center." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "step", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "step-icon", children: "🏀" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Wear it with pride" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "You're part of history. Let's go Knicks!" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "order-id", children: [
        "Order: ",
        sessionId
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "cta", children: "← Back to Store" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trust", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🚚 Free shipping over $49.90" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔒 Secure checkout" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✅ Official NBA product" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "support", children: [
        "Questions about your order? Email us at ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:support@knickschampiondeal.com", children: "support@knickschampiondeal.com" })
      ] })
    ] })
  ] });
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
.checkout-return-card.thankyou .confirm-banner { background: #E8F7EE; color: #146C2E; padding: 10px 14px; border-radius: 6px; font-size: 13px; font-weight: 700; margin-bottom: 18px; }
.checkout-return-card .next-steps { display: flex; flex-direction: column; gap: 14px; margin: 24px 0; text-align: left; }
.checkout-return-card .step { display: flex; gap: 12px; align-items: flex-start; background: #F7F9FC; padding: 14px; border-radius: 10px; border-left: 3px solid #F58426; }
.checkout-return-card .step-icon { font-size: 22px; line-height: 1; flex-shrink: 0; }
.checkout-return-card .step strong { display: block; color: #1a1a1a; font-size: 14px; margin-bottom: 4px; }
.checkout-return-card .step p { color: #555; font-size: 13px; line-height: 1.5; margin: 0; }
.checkout-return-card .support { font-size: 12px; color: #777; margin-top: 16px; }
.checkout-return-card .support a { color: #006BB6; text-decoration: none; font-weight: 600; }
@media (max-width: 480px) {
  .checkout-return-card { padding: 28px 18px; }
  .checkout-return-card h1 { font-size: 20px; }
}
`;
export {
  CheckoutReturn as component
};
