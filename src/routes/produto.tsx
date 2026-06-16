import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import jersey1 from "@/assets/jersey-1.png.asset.json";
import jersey2 from "@/assets/jersey-2.png.asset.json";
import jersey3 from "@/assets/jersey-3.png.asset.json";
import knicksLogo from "@/assets/knicks-logo.svg.asset.json";
import hoodieImg from "@/assets/hoodie.avif.asset.json";
import snapbackImg from "@/assets/snapback.avif.asset.json";
import tshirtImg from "@/assets/tshirt.avif.asset.json";
import mvpShirtImg from "@/assets/mvp-shirt.webp.asset.json";
import boneImg from "@/assets/bone.avif.asset.json";
import moletomImg from "@/assets/moletom.avif.asset.json";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

const PRICE_ID = "knicks_brunson_jersey_icon_one_time";

type RelatedProduct = { id: string; n: string; p: number; img: string; priceId: string };

const RELATED: RelatedProduct[] = [
  { id: "hoodie", n: "Knicks 2026 Champions Hoodie", p: 89.9, img: hoodieImg.url, priceId: "knicks_champions_hoodie_onetime" },
  { id: "snapback", n: "Knicks Finals Snapback Cap", p: 39.9, img: snapbackImg.url, priceId: "knicks_finals_snapback_onetime" },
  { id: "tshirt", n: "Knicks Champions T-Shirt", p: 34.9, img: tshirtImg.url, priceId: "knicks_champions_tshirt_onetime" },
  { id: "mvp", n: "Knicks NBA Finals MVP 2026 Shirt", p: 44.9, img: mvpShirtImg.url, priceId: "knicks_mvp_shirt_onetime" },
];

type BumpOption = { id: string; priceId: string; title: string; subtitle: string; price: number; originalPrice?: number; badge?: string; img: string };

const BUMPS: BumpOption[] = [
  { id: "bone", priceId: "knicks_bone_locker_room", title: "Locker Room Champions 2026 Cap", subtitle: "The exact cap the team wore celebrating the title", price: 24.9, img: boneImg.url },
  { id: "moletom", priceId: "knicks_moletom_champions", title: "Champions 2026 Hoodie", subtitle: "Wear the championship every single day", price: 49.9, img: moletomImg.url },
  { id: "combo", priceId: "knicks_combo_bone_moletom", title: "COMBO Cap + Hoodie", subtitle: "Save $5 when you grab both together", price: 69.9, originalPrice: 74.8, badge: "MOST POPULAR", img: moletomImg.url },
];

export const Route = createFileRoute("/produto")({
  head: () => ({
    meta: [
      { title: "New York Knicks 2026 NBA Finals Jersey — NBA Store" },
      { name: "description", content: "Official commemorative jersey of the New York Knicks 2026 NBA Champions. Limited edition." },
    ],
  }),
  component: ProductPage,
});

const ORIGINAL_PRICE = 149.9;
const SALE_PRICE = 59.9;
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const IMAGES = [jersey1.url, jersey2.url, jersey3.url, jersey1.url];

const fmt = (n: number) => `$${n.toFixed(2)}`;

function ProductPage() {
  const [discount, setDiscount] = useState(0);
  const [expired, setExpired] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [wished, setWished] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ details: true, fit: false, ship: false });
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showSticky, setShowSticky] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number; on: boolean }>({ x: 50, y: 50, on: false });
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [extras, setExtras] = useState<Record<string, number>>({});
  const [bumpId, setBumpId] = useState<string | null>(null);
  const selectedBump = BUMPS.find((b) => b.id === bumpId) || null;
  const bumpTotal = selectedBump?.price ?? 0;
  const cartCount = 1 + Object.values(extras).reduce((s, n) => s + n, 0) + (selectedBump ? 1 : 0);
  const extrasTotal = RELATED.reduce((s, r) => s + (extras[r.id] || 0) * r.p, 0) + bumpTotal;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("knicks_quiz_result");
      if (raw) {
        const r = JSON.parse(raw);
        const exp = r.timestamp && Date.now() - r.timestamp > 15 * 60 * 1000;
        if (!exp && r.discount) setDiscount(Number(r.discount));
      } else {
        const d = parseFloat(localStorage.getItem("knicks_discount") || "0");
        if (d > 0) setDiscount(d);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) { clearInterval(t); setExpired(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
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
  const hasDiscount = true;
  void discount;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const canBuy = !!size && !expired;

  const buildItems = () => {
    const items: { priceId: string; quantity: number; size?: string }[] = [
      { priceId: PRICE_ID, quantity: qty, size: size ?? undefined },
    ];
    if (selectedBump) items.push({ priceId: selectedBump.priceId, quantity: 1 });
    for (const r of RELATED) {
      const q = extras[r.id] || 0;
      if (q > 0) items.push({ priceId: r.priceId, quantity: q });
    }
    return items;
  };

  const handleBuy = () => {
    if (!canBuy) return;
    setCheckoutOpen(true);
  };

  const toggleExtra = (id: string) => {
    setExtras((e) => ({ ...e, [id]: e[id] ? 0 : 1 }));
  };

  return (
    <div className="nba-page">
      <style>{css}</style>
      <PaymentTestModeBanner />

      {checkoutOpen && (
        <div
          onClick={() => setCheckoutOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, maxWidth: 720, width: "100%", padding: 16, position: "relative" }}>
            <button
              onClick={() => setCheckoutOpen(false)}
              style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", fontSize: 24, cursor: "pointer", color: "#333", zIndex: 2 }}
              aria-label="Fechar"
            >×</button>
            <StripeEmbeddedCheckout items={buildItems()} />
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="nba-header">


        {/* Team Shop bar */}
        <div className="nba-teamshop">
          <div className="nba-teamshop-inner">
            <div className="nba-teamshop-left">
              <div className="knicks-logo"><img src={knicksLogo.url} alt="New York Knicks" /></div>
              <span className="ts-dot" aria-hidden>•</span>
              <div className="teamshop-text">
                <div className="ts-title">TEAM SHOP</div>
                <div className="ts-sub">A <span className="fanatics">≈ Fanatics</span> Experience</div>
              </div>
            </div>
            <div className="nba-teamshop-center">
            </div>
            <div className="nba-teamshop-right">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
              </svg>
              <span className="nba-cart" aria-label={`Cart with ${cartCount} items`}>
                <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M3 5h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L22 8H7"/>
                  <circle cx="10" cy="22" r="1.2"/>
                  <circle cx="19" cy="22" r="1.2"/>
                </svg>
                <span className="nba-cart-badge">{cartCount}</span>
              </span>
            </div>
          </div>

        </div>

        {/* Orange nav */}
        <div className="nba-orangenav">
          <div className="nba-orangenav-inner">
            <a href="#">Men</a>
            <a href="#">Women</a>
            <a href="#">Kids</a>
            <a href="#">More</a>
            <span className="search-ico" aria-hidden>🔍</span>
          </div>
        </div>

        {/* Quiz unlock strip (replaces SIGN UP & SAVE 10%) */}
        <div className="nba-quizstrip">
          QUIZ DISCOUNT UNLOCKED
        </div>
      </header>

      <div className="nba-container">
        {/* BREADCRUMB */}
        <nav className="nba-crumb" aria-label="breadcrumb">
          <a href="#">Home</a><span>›</span>
          <a href="#">New York Knicks</a><span>›</span>
          <a href="#">Jerseys</a><span>›</span>
          <span className="current">Brunson 2026 Finals Jersey</span>
        </nav>

        {/* MAIN */}
        <div className="nba-main">
          {/* GALLERY */}
          <div className="nba-gallery">
            <div
              className="nba-img-main"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
              }}
              onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
            >
              <span className="nba-finals-badge">NBA FINALS 2026 CHAMPION</span>
              <img
                src={IMAGES[activeThumb]}
                alt="New York Knicks 2026 NBA Finals Jersey"
                className="nba-img"
                style={zoom.on ? { transform: `scale(1.8)`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </div>
            <div className="nba-thumbs">
              {IMAGES.map((src, i) => (
                <button
                  key={i}
                  className={`nba-thumb ${activeThumb === i ? "active" : ""}`}
                  onClick={() => setActiveThumb(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* PANEL */}
          <div className="nba-panel" ref={panelRef}>
            <span className="nba-edicao-badge">🏆 COMMEMORATIVE EDITION — 2026 KNICKS CHAMPIONS</span>

            <h1 className="nba-title">
              UNISEX NEW YORK KNICKS JALEN BRUNSON NIKE BLUE 2026 NBA FINALS PATCH SWINGMAN JERSEY — ICON EDITION
            </h1>

            <a href="#reviews" className="nba-rating">
              <span className="stars">★★★★★</span> 4.8 <span className="muted">(1,247 reviews)</span>
            </a>

            {/* PRICE */}
            <div className="nba-price-box">
              {hasDiscount && (
                <>
                  <div className="nba-price-row">
                    <span className="muted">Original price:</span>
                    <span className="strike">{fmt(ORIGINAL_PRICE)}</span>
                  </div>
                  <div className="nba-price-row">
                    <span className="muted">Your quiz discount:</span>
                    <span className="green-bold">-{fmt(savings)}</span>
                  </div>
                  <div className="nba-price-divider" />
                </>
              )}
              <div className="nba-price-final-row">
                <span className="label-final">YOUR PRICE:</span>
                <span className="price-final">{fmt(finalPrice)}</span>
              </div>
              {hasDiscount && (
                <p className="nba-quiz-note">🏆 Discount earned in the Fan Quiz</p>
              )}
            </div>

            {/* SIZE */}
            <div className="nba-section">
              <div className="nba-section-head">
                <span>SELECT SIZE:</span>
                <a href="#" className="nba-size-guide">Size Guide ↗</a>
              </div>
              <div className="nba-sizes">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    className={`nba-size ${size === s ? "selected" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* QTY */}
            {size && (
              <div className="nba-section">
                <div className="nba-section-head"><span>QUANTITY:</span></div>
                <div className="nba-qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
              </div>
            )}

            {/* ORDER BUMPS */}
            <div className="nba-bumps">
              <div className="nba-bumps-head">🎁 COMPLETE YOUR CHAMPIONS KIT</div>
              {BUMPS.map((b) => {
                const sel = bumpId === b.id;
                return (
                  <label key={b.id} className={`nba-bump ${sel ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="bump"
                      checked={sel}
                      onChange={() => setBumpId(b.id)}
                    />
                    <div className="nba-bump-thumb"><img src={b.img} alt={b.title} /></div>
                    <div className="nba-bump-body">
                      <div className="nba-bump-top">
                        <span className="nba-bump-title">{b.title}</span>
                        {b.badge && <span className="nba-bump-badge">{b.badge}</span>}
                      </div>
                      <div className="nba-bump-sub">{b.subtitle}</div>
                      <div className="nba-bump-price">
                        {b.originalPrice && <span className="strike">{fmt(b.originalPrice)}</span>}
                        <strong>{fmt(b.price)}</strong>
                      </div>
                    </div>
                  </label>
                );
              })}
              <label className={`nba-bump nba-bump-none ${bumpId === null ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="bump"
                  checked={bumpId === null}
                  onChange={() => setBumpId(null)}
                />
                <div className="nba-bump-body">
                  <span className="nba-bump-title">No thanks — just the jersey is perfect</span>
                </div>
              </label>
            </div>

            {/* BUTTONS */}
            <button className="nba-btn nba-btn-buy" disabled={!canBuy} onClick={handleBuy}>
              {extrasTotal > 0 ? `BUY ALL — $${(finalPrice * qty + extrasTotal).toFixed(2)}` : "BUY NOW"}
            </button>


            {/* COUNTDOWN */}
            <div className={`nba-countdown ${expired ? "expired" : ""}`}>
              {expired ? (
                <p>Offer expired — <a href="/">retake the quiz</a> for a new discount</p>
              ) : (
                <>⏱ Offer expires in: <strong>00h : {mm}m : {ss}s</strong></>
              )}
            </div>

            {/* WISH/SHARE */}
            <div className="nba-wish">
              <button onClick={() => setWished((w) => !w)}>
                {wished ? "♥" : "♡"} Add to wishlist
              </button>
              <button>↗ Share</button>
            </div>

            {/* TRUST */}
            <ul className="nba-trust">
              <li>🚚 Free shipping on orders over $49,90</li>
              <li>🔄 Free 30-day returns</li>
              <li>🔒 100% secure payment</li>
              <li>✅ Official NBA / Nike product</li>
            </ul>
          </div>
        </div>

        {/* ACCORDIONS */}
        <section className="nba-accordions">
          {[
            { id: "details", label: "Product details", body: [
              "Official Nike Swingman Jersey",
              "Embroidered 2026 NBA Finals commemorative patch",
              "Dri-FIT technology for temperature control",
              "100% recycled polyester",
              "Champions patch on the right shoulder",
              "Name and number in tackle twill",
              "Imported",
            ]},
            { id: "fit", label: "Size & fit", body: [
              "Regular unisex fit",
              "Reference: size M fits S to M",
              "Check the size guide if in doubt",
            ]},
            { id: "ship", label: "Shipping & returns", body: [
              "Free shipping on orders over $49,90",
              "Delivery in 3-5 business days",
              "Free returns within 30 days",
              "Official product — authenticity guaranteed",
            ]},
          ].map((a) => (
            <div key={a.id} className={`nba-acc ${open[a.id] ? "open" : ""}`}>
              <button
                className="nba-acc-head"
                onClick={() => setOpen((o) => ({ ...o, [a.id]: !o[a.id] }))}
              >
                {a.label}
                <span className="chev">⌄</span>
              </button>
              <div className="nba-acc-body">
                <ul>{a.body.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* REVIEWS */}
      <section id="reviews" className="nba-reviews">
        <div className="nba-container">
          <div className="nba-reviews-head">
            <div className="nba-reviews-summary">
              <div className="big">4.8</div>
              <div className="stars">★★★★★</div>
              <div className="muted">out of 5 stars</div>
              <div className="muted">1,247 reviews</div>
            </div>
            <div className="nba-bars">
              {[
                [5, 76], [4, 18], [3, 4], [2, 1], [1, 1],
              ].map(([s, p]) => (
                <div key={s} className="bar-row">
                  <span>{s} stars</span>
                  <div className="bar"><div style={{ width: `${p}%` }} /></div>
                  <span>{p}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="nba-review-cards">
            {[
              { n: "Michael R.", c: "Brooklyn, NY", d: "2 days ago", t: "Incredible quality!", b: "Jersey arrived perfect, the championship patch looks amazing." },
              { n: "Sarah K.", c: "Manhattan, NY", d: "5 days ago", t: "Dream come true", b: "Waited so long for this title — the jersey lives up to the moment." },
              { n: "James L.", c: "Queens, NY", d: "1 week ago", t: "Excellent fabric", b: "Very lightweight, perfect fit. Highly recommend." },
            ].map((r) => (
              <article key={r.n} className="nba-review">
                <div className="stars">★★★★★</div>
                <h3>"{r.t}"</h3>
                <div className="meta">{r.n} · {r.c} · {r.d}</div>
                <p>"{r.b}"</p>
                <div className="verified">✓ Verified purchase</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="nba-related">
        <div className="nba-container">
          <h2>YOU MAY ALSO LIKE</h2>
          <p className="nba-related-hint">Add items to buy together in a single checkout</p>
          <div className="nba-related-grid">
            {RELATED.map((p) => {
              const selected = (extras[p.id] || 0) > 0;
              return (
                <div key={p.id} className={`nba-related-card ${selected ? "selected" : ""}`}>
                  <div className="img"><img src={p.img} alt={p.n} /></div>
                  <div className="name">{p.n}</div>
                  <div className="price">{fmt(p.p)}</div>
                  <button
                    className={selected ? "added" : ""}
                    onClick={() => toggleExtra(p.id)}
                  >
                    {selected ? "✓ Added" : "Add to order"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nba-footer">
        <div className="nba-container">
          <div className="nba-footer-grid">
            <div className="nba-footer-logo">NBA</div>
            <div>
              <h4>My Account</h4>
              <ul><li>Orders</li><li>Wishlist</li><li>Addresses</li></ul>
            </div>
            <div>
              <h4>Help</h4>
              <ul><li>FAQ</li><li>Returns</li><li>Contact</li></ul>
            </div>
            <div>
              <h4>About</h4>
              <ul><li>Partners</li><li>Policy</li><li>Privacy</li></ul>
            </div>
          </div>
          <div className="nba-pay">VISA · MASTERCARD · AMEX · PAYPAL · APPLE PAY</div>
          <div className="nba-copy">© 2026 NBA Store · All rights reserved</div>
        </div>
      </footer>

      {/* STICKY MOBILE BAR */}
      {showSticky && (
        <div className="nba-sticky-bar">
          <div className="img"><img src={jersey1.url} alt="" /></div>
          <div className="info">
            <div className="n">KNICKS JERSEY 2026</div>
            <div className="p">{fmt(finalPrice)}</div>
          </div>
          <button disabled={!canBuy}>BUY NOW</button>
        </div>
      )}
    </div>
  );
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

.nba-bumps { margin: 16px 0; border: 2px dashed #F58426; border-radius: 8px; padding: 12px; background: #FFF8F2; }
.nba-bumps-head { font-size: 13px; font-weight: 800; color: #F58426; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 10px; text-align: center; }
.nba-bump { display: flex; gap: 10px; align-items: flex-start; padding: 10px; border: 1.5px solid #e5e5e5; border-radius: 6px; background: #fff; cursor: pointer; margin-bottom: 8px; transition: border-color 0.15s, background 0.15s; }
.nba-bump:hover { border-color: #F58426; }
.nba-bump.selected { border-color: #006BB6; background: #F0F7FC; }
.nba-bump input[type="radio"] { margin-top: 3px; accent-color: #006BB6; cursor: pointer; }
.nba-bump-body { flex: 1; min-width: 0; }
.nba-bump-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.nba-bump-title { font-size: 13px; font-weight: 700; color: #1a1a1a; }
.nba-bump-badge { background: #F58426; color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.04em; }
.nba-bump-sub { font-size: 12px; color: #666; margin-top: 2px; }
.nba-bump-price { margin-top: 6px; display: flex; gap: 8px; align-items: baseline; }
.nba-bump-price .strike { text-decoration: line-through; color: #999; font-size: 12px; }
.nba-bump-price strong { color: #006BB6; font-size: 15px; font-weight: 800; }
.nba-bump-none { background: #fafafa; }
.nba-bump-none .nba-bump-title { font-weight: 600; color: #666; font-size: 12px; }
`;

