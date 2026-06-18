import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { c as camisaBrancaImg, S as StripeEmbeddedCheckout, k as knicksLogo } from "./StripeEmbeddedCheckout-C3kdybDv.mjs";
import "../_libs/stripe__react-stripe-js.mjs";
import "../_libs/stripe__stripe-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-wIqWYVKK.mjs";
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
import "../_libs/prop-types.mjs";
const jersey1 = "/assets/image_2-CDC3HTF9.png";
const jersey2 = "/assets/image_2-CDC3HTF9.png";
const jersey3 = "/assets/image_4-PJu3GNOD.png";
const hoodieImg = "/assets/image_10-ma1wCYBk.avif";
const snapbackImg = "/assets/image_11-DO5zLF-f.avif";
const tshirtImg = "/assets/image_12-BNsYYZj9.avif";
const clientToken = "pk_live_51SKit9HRlwatDM20YlTlhHbFBRL4ib1Y0sgIlSiAcAUNgSfuxAyNmLBRNyl2B2mckZMc8yUEgzdQ8a0trtXiLcht00eC2Rpcua";
function PaymentTestModeBanner() {
  if (clientToken.startsWith("pk_test_")) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800", children: [
      "Todos os pagamentos no preview estão em modo de teste.",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "https://docs.lovable.dev/features/payments#test-and-live-environments",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "underline font-medium",
          children: "Saiba mais"
        }
      )
    ] });
  }
  return null;
}
const PRICE_ID = "knicks_brunson_jersey_icon_one_time";
const RELATED = [{
  id: "hoodie",
  n: "Knicks 2026 Champions Hoodie",
  p: 89.9,
  img: hoodieImg,
  priceId: "knicks_champions_hoodie_onetime"
}, {
  id: "snapback",
  n: "Knicks Finals Snapback Cap",
  p: 39.9,
  img: snapbackImg,
  priceId: "knicks_finals_snapback_onetime"
}, {
  id: "tshirt",
  n: "Knicks Champions T-Shirt",
  p: 34.9,
  img: tshirtImg,
  priceId: "knicks_champions_tshirt_onetime"
}, {
  id: "mvp",
  n: "Knicks NBA Finals MVP 2026 Shirt",
  p: 44.9,
  img: camisaBrancaImg,
  priceId: "knicks_mvp_shirt_onetime"
}];
const ORIGINAL_PRICE = 149.9;
const SALE_PRICE = 59.9;
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const IMAGES = [jersey1, jersey2, jersey3, jersey1];
const fmt = (n) => `$${n.toFixed(2)}`;
function ProductPage() {
  const [discount, setDiscount] = reactExports.useState(0);
  const [expired, setExpired] = reactExports.useState(false);
  const [size, setSize] = reactExports.useState(null);
  const [qty, setQty] = reactExports.useState(1);
  const [activeThumb, setActiveThumb] = reactExports.useState(0);
  const [wished, setWished] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState({
    details: true,
    fit: false,
    ship: false
  });
  const [timeLeft, setTimeLeft] = reactExports.useState(15 * 60);
  const [showSticky, setShowSticky] = reactExports.useState(false);
  const panelRef = reactExports.useRef(null);
  const [zoom, setZoom] = reactExports.useState({
    x: 50,
    y: 50,
    on: false
  });
  const [checkoutOpen, setCheckoutOpen] = reactExports.useState(false);
  const [extras, setExtras] = reactExports.useState({});
  const cartCount = qty + Object.values(extras).reduce((s, n) => s + n, 0);
  const extrasTotal = RELATED.reduce((s, r) => s + (extras[r.id] || 0) * r.p, 0);
  reactExports.useEffect(() => {
    try {
      const raw = localStorage.getItem("knicks_quiz_result");
      if (raw) {
        const r = JSON.parse(raw);
        const exp = r.timestamp && Date.now() - r.timestamp > 15 * 60 * 1e3;
        if (!exp && r.discount) setDiscount(Number(r.discount));
      } else {
        const d = parseFloat(localStorage.getItem("knicks_discount") || "0");
        if (d > 0) setDiscount(d);
      }
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1e3);
    return () => clearInterval(t);
  }, []);
  reactExports.useEffect(() => {
    const onScroll = () => {
      if (!panelRef.current) return;
      const rect = panelRef.current.getBoundingClientRect();
      setShowSticky(rect.bottom < 0);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const finalPrice = SALE_PRICE;
  const savings = ORIGINAL_PRICE - SALE_PRICE;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  const canBuy = !!size && !expired;
  const checkoutItems = reactExports.useMemo(() => {
    const items = [{
      priceId: PRICE_ID,
      quantity: qty,
      size: size ?? void 0,
      name: "Knicks Jersey 2026",
      price: finalPrice
    }];
    for (const r of RELATED) {
      const q = extras[r.id] || 0;
      if (q > 0) items.push({
        priceId: r.priceId,
        quantity: q,
        name: r.n,
        price: r.p
      });
    }
    return items;
  }, [extras, qty, size, finalPrice]);
  const checkoutKey = reactExports.useMemo(() => JSON.stringify(checkoutItems), [checkoutItems]);
  const handleBuy = () => {
    if (!canBuy) return;
    setCheckoutOpen(true);
  };
  const toggleExtra = (id) => {
    setExtras((e) => ({
      ...e,
      [id]: e[id] ? 0 : 1
    }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: css }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentTestModeBanner, {}),
    checkoutOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { onClick: () => setCheckoutOpen(false), style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      zIndex: 9999,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 16px",
      overflowY: "auto"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { onClick: (e) => e.stopPropagation(), style: {
      background: "#fff",
      borderRadius: 12,
      maxWidth: 720,
      width: "100%",
      padding: 16,
      position: "relative"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCheckoutOpen(false), style: {
        position: "absolute",
        top: 12,
        right: 12,
        background: "transparent",
        border: "none",
        fontSize: 24,
        cursor: "pointer",
        color: "#333",
        zIndex: 2
      }, "aria-label": "Fechar", children: "×" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StripeEmbeddedCheckout, { items: checkoutItems, estimatedTotal: finalPrice * qty + extrasTotal }, checkoutKey)
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "nba-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-teamshop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-teamshop-inner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-teamshop-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "knicks-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: knicksLogo, alt: "New York Knicks" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ts-dot", "aria-hidden": true, children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "teamshop-text", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ts-title", children: "TEAM SHOP" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ts-sub", children: [
              "A ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fanatics", children: "≈ Fanatics" }),
              " Experience"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-teamshop-center" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-teamshop-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", width: "28", height: "28", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": true, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "8", r: "4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "nba-cart", "aria-label": `Cart with ${cartCount} items`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 24", width: "30", height: "30", fill: "none", stroke: "currentColor", strokeWidth: "1.6", "aria-hidden": true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 5h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 8H7" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10", cy: "22", r: "1.2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "19", cy: "22", r: "1.2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nba-cart-badge", children: cartCount })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-orangenav", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-orangenav-inner", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Men" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Women" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Kids" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "More" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "search-ico", "aria-hidden": true, children: "🔍" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-quizstrip", children: "QUIZ DISCOUNT UNLOCKED" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "nba-crumb", "aria-label": "breadcrumb", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Home" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "›" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "New York Knicks" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "›" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", children: "Jerseys" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "›" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "current", children: "Brunson 2026 Finals Jersey" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-gallery", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-img-main", onMouseMove: (e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({
              x: (e.clientX - r.left) / r.width * 100,
              y: (e.clientY - r.top) / r.height * 100,
              on: true
            });
          }, onMouseLeave: () => setZoom((z) => ({
            ...z,
            on: false
          })), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nba-finals-badge", children: "NBA FINALS 2026 CHAMPION" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: IMAGES[activeThumb], alt: "New York Knicks 2026 NBA Finals Jersey", className: "nba-img", style: zoom.on ? {
              transform: `scale(1.8)`,
              transformOrigin: `${zoom.x}% ${zoom.y}%`
            } : void 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-thumbs", children: IMAGES.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `nba-thumb ${activeThumb === i ? "active" : ""}`, onClick: () => setActiveThumb(i), "aria-label": `Image ${i + 1}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "" }) }, i)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-panel", ref: panelRef, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nba-edicao-badge", children: "🏆 COMMEMORATIVE EDITION — 2026 KNICKS CHAMPIONS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "nba-title", children: "UNISEX NEW YORK KNICKS JALEN BRUNSON NIKE BLUE 2026 NBA FINALS PATCH SWINGMAN JERSEY — ICON EDITION" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#reviews", className: "nba-rating", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stars", children: "★★★★★" }),
            " 4.8 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "(1,247 reviews)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-price-box", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-price-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "Original price:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "strike", children: fmt(ORIGINAL_PRICE) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-price-row", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "Your quiz discount:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "green-bold", children: [
                  "-",
                  fmt(savings)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-price-divider" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-price-final-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-final", children: "YOUR PRICE:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "price-final", children: fmt(finalPrice) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "nba-quiz-note", children: "🏆 Discount earned in the Fan Quiz" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-section-head", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SELECT SIZE:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "nba-size-guide", children: "Size Guide ↗" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-sizes", children: SIZES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `nba-size ${size === s ? "selected" : ""}`, onClick: () => setSize(s), children: s }, s)) })
          ] }),
          size && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "QUANTITY:" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-qty", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => Math.max(1, q - 1)), children: "−" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: qty }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setQty((q) => q + 1), children: "+" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "nba-btn nba-btn-buy", disabled: !canBuy, onClick: handleBuy, children: extrasTotal > 0 ? `BUY ALL — $${(finalPrice * qty + extrasTotal).toFixed(2)}` : "BUY NOW" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `nba-countdown ${expired ? "expired" : ""}`, children: expired ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Offer expired — ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "/", children: "retake the quiz" }),
            " for a new discount"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "⏱ Offer expires in: ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              "00h : ",
              mm,
              "m : ",
              ss,
              "s"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-wish", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setWished((w) => !w), children: [
              wished ? "♥" : "♡",
              " Add to wishlist"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { children: "↗ Share" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "nba-trust", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "🚚 Free shipping on orders over $49,90" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "🔄 Free 30-day returns" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "🔒 100% secure payment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✅ Official NBA / Nike product" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "nba-accordions", children: [{
        id: "details",
        label: "Product details",
        body: ["Official Nike Swingman Jersey", "Embroidered 2026 NBA Finals commemorative patch", "Dri-FIT technology for temperature control", "100% recycled polyester", "Champions patch on the right shoulder", "Name and number in tackle twill", "Imported"]
      }, {
        id: "fit",
        label: "Size & fit",
        body: ["Regular unisex fit", "Reference: size M fits S to M", "Check the size guide if in doubt"]
      }, {
        id: "ship",
        label: "Shipping & returns",
        body: ["Free shipping on orders over $49,90", "Delivery in 3-5 business days", "Free returns within 30 days", "Official product — authenticity guaranteed"]
      }].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `nba-acc ${open[a.id] ? "open" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "nba-acc-head", onClick: () => setOpen((o) => ({
          ...o,
          [a.id]: !o[a.id]
        })), children: [
          a.label,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chev", children: "⌄" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-acc-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: a.body.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b }, b)) }) })
      ] }, a.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "reviews", className: "nba-reviews", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-reviews-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-reviews-summary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "big", children: "4.8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stars", children: "★★★★★" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted", children: "out of 5 stars" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted", children: "1,247 reviews" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-bars", children: [[5, 76], [4, 18], [3, 4], [2, 1], [1, 1]].map(([s, p]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bar-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            s,
            " stars"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: {
            width: `${p}%`
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            p,
            "%"
          ] })
        ] }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-review-cards", children: [{
        n: "Michael R.",
        c: "Brooklyn, NY",
        d: "2 days ago",
        t: "Incredible quality!",
        b: "Jersey arrived perfect, the championship patch looks amazing."
      }, {
        n: "Sarah K.",
        c: "Manhattan, NY",
        d: "5 days ago",
        t: "Dream come true",
        b: "Waited so long for this title — the jersey lives up to the moment."
      }, {
        n: "James L.",
        c: "Queens, NY",
        d: "1 week ago",
        t: "Excellent fabric",
        b: "Very lightweight, perfect fit. Highly recommend."
      }].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "nba-review", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stars", children: "★★★★★" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
          '"',
          r.t,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta", children: [
          r.n,
          " · ",
          r.c,
          " · ",
          r.d
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          '"',
          r.b,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "verified", children: "✓ Verified purchase" })
      ] }, r.n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "nba-related", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "YOU MAY ALSO LIKE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "nba-related-hint", children: "Add items to buy together in a single checkout" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-related-grid", children: RELATED.map((p) => {
        const selected = (extras[p.id] || 0) > 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `nba-related-card ${selected ? "selected" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "img", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.img, alt: p.n }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "name", children: p.n }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "price", children: fmt(p.p) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: selected ? "added" : "", onClick: () => toggleExtra(p.id), children: selected ? "✓ Added" : "Add to order" })
        ] }, p.id);
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "nba-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-container", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-footer-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-footer-logo", children: "NBA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "My Account" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Orders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Wishlist" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Addresses" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Help" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "FAQ" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Returns" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Contact" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "About" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Partners" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Policy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Privacy" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-pay", children: "VISA · MASTERCARD · AMEX · PAYPAL · APPLE PAY" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nba-copy", children: "© 2026 NBA Store · All rights reserved" })
    ] }) }),
    showSticky && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nba-sticky-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "img", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: jersey1, alt: "" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "n", children: [
          "KNICKS JERSEY 2026 ",
          extrasTotal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: {
            color: "#F58426"
          }, children: [
            "+",
            cartCount - qty,
            " items"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p", children: fmt(finalPrice * qty + extrasTotal) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !canBuy, onClick: handleBuy, children: "BUY NOW" })
    ] })
  ] });
}
const css = `
.nba-page { font-family: 'Inter', sans-serif; color: #333; background: #fff; min-height: 100vh; }
.nba-container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

/* HEADER */
.nba-header { position: sticky; top: 0; z-index: 1000; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.06); }

/* Team shop bar */
.nba-teamshop { background: #1d428a; color: #fff; }
.nba-teamshop-inner { display: flex; align-items: center; padding: 14px 24px; max-width: 1280px; margin: 0 auto; gap: 16px; }
.nba-teamshop-left { display: flex; align-items: center; gap: 14px; min-width: 0; }
.knicks-logo { width: 56px; height: 56px; display: grid; place-items: center; flex-shrink: 0; }
.knicks-logo img { width: 100%; height: 100%; object-fit: contain; }
.ts-dot { color: #fff; font-size: 22px; line-height: 1; opacity: 0.9; }
.teamshop-text .ts-title { font-family: 'Barlow Condensed', 'Oswald', sans-serif; font-style: italic; font-weight: 800; font-size: 28px; line-height: 1; letter-spacing: 1px; color: #fff; }
.teamshop-text .ts-sub { font-size: 11px; opacity: 0.95; margin-top: 4px; letter-spacing: 0.3px; }
.teamshop-text .ts-sub .fanatics { font-weight: 700; font-style: italic; }
.nba-teamshop-center { display: flex; align-items: center; gap: 10px; margin-left: 8px; }
.nba-teamshop-right { display: flex; gap: 18px; align-items: center; color: #fff; margin-left: auto; }
.nba-cart { position: relative; display: inline-flex; }
.nba-cart-badge { position: absolute; top: -4px; right: -8px; background: #F58426; color: #000; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 10px; min-width: 16px; text-align: center; }
@media (max-width: 768px) {
  .nba-teamshop-inner { padding: 10px 12px; gap: 8px; }
  .knicks-logo { width: 44px; height: 44px; }
  .teamshop-text .ts-title { font-size: 22px; }
  .nba-teamshop-center { gap: 6px; margin-left: 4px; }
  .nba-teamshop-right { gap: 12px; }
}


/* Orange nav */
.nba-orangenav { background: #F58426; }
.nba-orangenav-inner { max-width: 1280px; margin: 0 auto; padding: 6px 16px; display: flex; align-items: center; gap: 18px; }
.nba-orangenav a { color: #fff; font-weight: 700; font-size: 14px; text-decoration: none; text-transform: capitalize; }
.nba-orangenav a:hover { text-decoration: underline; }
.nba-orangenav .search-ico { margin-left: auto; color: #fff; font-size: 16px; }

/* Quiz unlock strip */
.nba-quizstrip { background: #1d428a; color: #fff; text-align: center; padding: 14px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }

@media (max-width: 768px) {
  .teamshop-text .ts-title { font-size: 18px; }
  .nba-orangenav-inner { gap: 20px; padding: 12px; }
  .nba-orangenav a { font-size: 16px; }
  .nba-quizstrip { font-size: 13px; padding: 12px; }
}

/* CRUMB */
.nba-crumb { display: flex; gap: 8px; align-items: center; padding: 12px 0; font-size: 12px; color: #767676; flex-wrap: wrap; }
.nba-crumb a { color: #767676; text-decoration: none; }
.nba-crumb a:hover { color: #006BB6; }
.nba-crumb span { color: #ccc; }
.nba-crumb .current { color: #333; }

/* MAIN */
.nba-main { display: grid; grid-template-columns: 55% 45%; gap: 40px; padding: 16px 0 48px; }
@media (max-width: 1024px) { .nba-main { grid-template-columns: 50% 50%; gap: 24px; } }
@media (max-width: 768px) { .nba-main { grid-template-columns: 1fr; } }

/* GALLERY */
.nba-img-main { position: relative; aspect-ratio: 4/5; background: #F5F5F5; overflow: hidden; cursor: zoom-in; }
.nba-img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.1s; padding: 16px; }
.nba-finals-badge { position: absolute; top: 16px; left: 16px; background: #006BB6; color: #fff; font-size: 11px; font-weight: 700; padding: 6px 10px; letter-spacing: 0.5px; z-index: 2; }
.nba-thumbs { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; }
.nba-thumb { width: 80px; height: 80px; min-width: 80px; background: #F5F5F5; border: 1px solid #E5E5E5; cursor: pointer; padding: 4px; }
.nba-thumb img { width: 100%; height: 100%; object-fit: contain; }
.nba-thumb.active { border: 2px solid #006BB6; }

/* PANEL */
.nba-panel { display: flex; flex-direction: column; gap: 18px; }
.nba-edicao-badge { background: #F58426; color: #000; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 6px 10px; border-radius: 2px; width: fit-content; letter-spacing: 0.4px; }
.nba-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-style: italic; font-size: 30px; color: #000; line-height: 1.1; text-transform: uppercase; margin: 0; }
.nba-rating { display: inline-flex; gap: 6px; align-items: center; font-size: 13px; color: #767676; text-decoration: none; }
.nba-rating .stars { color: #F58426; letter-spacing: 1px; }
.muted { color: #767676; }
.green-bold { color: #1DB954; font-weight: 700; font-size: 14px; }
.strike { text-decoration: line-through; color: #767676; font-size: 16px; }

/* PRICE */
.nba-price-box { background: #F0F7FF; border-left: 4px solid #F58426; padding: 16px; display: flex; flex-direction: column; gap: 6px; }
.nba-price-row { display: flex; justify-content: space-between; font-size: 14px; }
.nba-price-divider { height: 1px; background: #D0E0F0; margin: 6px 0; }
.nba-price-final-row { display: flex; justify-content: space-between; align-items: baseline; }
.label-final { font-size: 12px; text-transform: uppercase; font-weight: 700; color: #333; letter-spacing: 0.5px; }
.price-final { color: #006BB6; font-size: 36px; font-weight: 700; }
.nba-quiz-note { color: #1DB954; font-size: 12px; font-weight: 600; margin: 4px 0 0; }

/* SECTIONS */
.nba-section { display: flex; flex-direction: column; gap: 10px; }
.nba-section-head { display: flex; justify-content: space-between; align-items: center; font-size: 12px; text-transform: uppercase; font-weight: 700; color: #333; letter-spacing: 0.5px; }
.nba-size-guide { color: #006BB6; text-decoration: none; font-size: 12px; }
.nba-sizes { display: flex; gap: 8px; flex-wrap: wrap; }
.nba-size { width: 48px; height: 40px; border: 1px solid #D1D1D1; background: #fff; cursor: pointer; font-weight: 600; font-size: 13px; }
.nba-size:hover { border-color: #000; }
.nba-size.selected { border: 2px solid #000; background: #000; color: #fff; }
.nba-qty { display: inline-flex; border: 1px solid #D1D1D1; width: fit-content; }
.nba-qty button { width: 40px; height: 40px; background: #fff; border: none; cursor: pointer; font-size: 16px; }
.nba-qty span { width: 50px; height: 40px; display: grid; place-items: center; border-left: 1px solid #D1D1D1; border-right: 1px solid #D1D1D1; font-weight: 600; }

/* BTNS */
.nba-btn { width: 100%; height: 52px; border: none; cursor: pointer; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; transition: background 0.2s; }
.nba-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.nba-btn-cart { background: #006BB6; color: #fff; }
.nba-btn-cart:not(:disabled):hover { background: #005a99; }
.nba-btn-cart.added { background: #1DB954; }
.nba-btn-buy { background: #000; color: #fff; }
.nba-btn-buy:not(:disabled):hover { background: #333; }

/* COUNTDOWN */
.nba-countdown { background: #FFF3CD; border: 1px solid #F58426; padding: 12px; font-size: 14px; color: #333; text-align: center; }
.nba-countdown.expired { background: #FBE5E5; border-color: #C0392B; color: #C0392B; }
.nba-countdown a { color: #006BB6; }

/* WISH */
.nba-wish { display: flex; gap: 16px; flex-wrap: wrap; }
.nba-wish button { background: none; border: none; color: #767676; font-size: 13px; cursor: pointer; }
.nba-wish button:hover { color: #000; }

/* TRUST */
.nba-trust { list-style: none; padding: 16px 0 0; margin: 0; border-top: 1px solid #E5E5E5; display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: #555; }

/* ACCORDIONS */
.nba-accordions { padding: 24px 0 48px; }
.nba-acc { border-top: 1px solid #E5E5E5; }
.nba-acc:last-child { border-bottom: 1px solid #E5E5E5; }
.nba-acc-head { width: 100%; background: none; border: none; padding: 18px 0; display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 700; text-transform: uppercase; cursor: pointer; color: #000; }
.nba-acc-head .chev { transition: transform 0.25s; font-size: 18px; }
.nba-acc.open .nba-acc-head .chev { transform: rotate(180deg); }
.nba-acc-body { max-height: 0; overflow: hidden; transition: max-height 0.3s; }
.nba-acc.open .nba-acc-body { max-height: 500px; }
.nba-acc-body ul { padding: 0 0 18px 20px; margin: 0; color: #333; font-size: 14px; line-height: 1.8; }

/* REVIEWS */
.nba-reviews { background: #F5F5F5; padding: 48px 0; }
.nba-reviews-head { display: grid; grid-template-columns: 280px 1fr; gap: 40px; margin-bottom: 32px; }
@media (max-width: 768px) { .nba-reviews-head { grid-template-columns: 1fr; } }
.nba-reviews-summary .big { font-size: 56px; font-weight: 700; line-height: 1; }
.nba-reviews-summary .stars { color: #F58426; font-size: 20px; margin: 6px 0; letter-spacing: 2px; }
.nba-bars { display: flex; flex-direction: column; gap: 6px; }
.bar-row { display: grid; grid-template-columns: 80px 1fr 40px; gap: 12px; align-items: center; font-size: 13px; }
.bar { background: #E5E5E5; height: 8px; }
.bar > div { background: #F58426; height: 100%; }
.nba-review-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 768px) { .nba-review-cards { grid-template-columns: 1fr; } }
.nba-review { background: #fff; padding: 18px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
.nba-review .stars { color: #F58426; letter-spacing: 1px; }
.nba-review h3 { font-size: 15px; margin: 6px 0 4px; }
.nba-review .meta { font-size: 12px; color: #767676; margin-bottom: 8px; }
.nba-review p { font-size: 14px; color: #333; margin: 0 0 12px; }
.nba-review .verified { font-size: 12px; color: #1DB954; font-weight: 600; }

/* RELATED */
.nba-related { padding: 48px 0; }
.nba-related h2 { font-family: 'Barlow Condensed'; font-weight: 700; font-style: italic; font-size: 26px; text-transform: uppercase; margin: 0 0 20px; }
.nba-related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 768px) { .nba-related-grid { grid-template-columns: repeat(2, 1fr); } }
.nba-related-card { background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.nba-related-card .img { aspect-ratio: 1; background: #F5F5F5; overflow: hidden; }
.nba-related-card .img img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.2s; }
.nba-related-card:hover .img img { transform: scale(1.03); }
.nba-related-card .name { font-size: 13px; color: #333; }
.nba-related-card .price { font-weight: 700; color: #006BB6; }
.nba-related-card button { background: #000; color: #fff; border: none; padding: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer; }
.nba-related-card.selected { outline: 2px solid #006BB6; }
.nba-related-card button.added { background: #1DB954; }
.nba-related-hint { color: #666; font-size: 13px; margin: -8px 0 16px; }

/* FOOTER */
.nba-footer { background: #1A1A1A; color: #fff; padding: 48px 0 24px; }
.nba-footer-grid { display: grid; grid-template-columns: 120px repeat(3, 1fr); gap: 32px; margin-bottom: 32px; }
@media (max-width: 768px) { .nba-footer-grid { grid-template-columns: 1fr 1fr; } }
.nba-footer-logo { font-family: 'Barlow Condensed'; font-weight: 800; font-style: italic; font-size: 32px; }
.nba-footer h4 { font-size: 13px; text-transform: uppercase; margin: 0 0 12px; }
.nba-footer ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.nba-footer ul li { font-size: 13px; color: #AAA; cursor: pointer; }
.nba-footer ul li:hover { color: #fff; }
.nba-pay { color: #AAA; font-size: 12px; padding: 16px 0; border-top: 1px solid #333; }
.nba-copy { color: #AAA; font-size: 12px; }

/* STICKY BAR */
.nba-sticky-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 64px; background: #000; display: none; align-items: center; gap: 12px; padding: 0 12px; z-index: 999; }
@media (max-width: 768px) { .nba-sticky-bar { display: flex; } }
.nba-sticky-bar .img { width: 44px; height: 44px; background: #F5F5F5; overflow: hidden; }
.nba-sticky-bar .img img { width: 100%; height: 100%; object-fit: contain; }
.nba-sticky-bar .info { flex: 1; color: #fff; min-width: 0; }
.nba-sticky-bar .info .n { font-size: 12px; font-weight: 600; }
.nba-sticky-bar .info .p { font-size: 16px; color: #F58426; font-weight: 700; }
.nba-sticky-bar button { background: #006BB6; color: #fff; border: none; padding: 12px 16px; font-weight: 700; font-size: 12px; text-transform: uppercase; cursor: pointer; }
.nba-sticky-bar button:disabled { opacity: 0.5; }


`;
export {
  ProductPage as component
};
