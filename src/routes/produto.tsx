import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const Route = createFileRoute("/produto")({
  head: () => ({
    meta: [
      { title: "New York Knicks 2026 NBA Finals Jersey — NBA Store" },
      { name: "description", content: "Jersey oficial comemorativa dos New York Knicks campeões da NBA 2026. Edição limitada." },
    ],
  }),
  component: ProductPage,
});

const ORIGINAL_PRICE = 149.9;
const FLOOR_PRICE = 59.9;
const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

const fmt = (n: number) => `$${n.toFixed(2).replace(".", ",")}`;

function ProductPage() {
  const [discount, setDiscount] = useState(0);
  const [expired, setExpired] = useState(false);
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [cart, setCart] = useState(1);
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ details: true, fit: false, ship: false });
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showSticky, setShowSticky] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number; on: boolean }>({ x: 50, y: 50, on: false });

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

  const finalPrice = useMemo(
    () => (discount > 0 ? Math.max(ORIGINAL_PRICE - discount, FLOOR_PRICE) : ORIGINAL_PRICE),
    [discount]
  );
  const hasDiscount = discount > 0;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const canBuy = !!size && !expired;

  const handleAdd = () => {
    if (!canBuy) return;
    setAdded(true);
    setCart((c) => c + qty);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="nba-page">
      <style>{css}</style>

      {/* HEADER */}
      <header className="nba-header">
        <div className="nba-header-inner">
          <div className="nba-header-left">
            <div className="nba-logo">NBA</div>
            <nav className="nba-nav">
              {["Knicks", "Jerseys", "Apparel", "Accessories", "Sale"].map((l) => (
                <a key={l} href="#">{l}</a>
              ))}
            </nav>
          </div>
          <div className="nba-header-right">
            <span aria-hidden>🔍</span>
            <span aria-hidden>♡</span>
            <span className="nba-cart" aria-label={`Carrinho com ${cart} itens`}>
              🛒<span className="nba-cart-badge">{cart}</span>
            </span>
          </div>
        </div>
        <div className="nba-header-stripe" />
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
              <div
                className="nba-img-placeholder"
                style={zoom.on ? { transform: `scale(1.6)`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              >
                BLUSA KNICKS 2026
                <span className="thumb-idx">#{activeThumb + 1}</span>
              </div>
            </div>
            <div className="nba-thumbs">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={`nba-thumb ${activeThumb === i ? "active" : ""}`}
                  onClick={() => setActiveThumb(i)}
                  aria-label={`Imagem ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* PANEL */}
          <div className="nba-panel" ref={panelRef}>
            <span className="nba-edicao-badge">🏆 EDIÇÃO COMEMORATIVA — KNICKS CAMPEÕES 2026</span>

            <h1 className="nba-title">
              NEW YORK KNICKS 2026 NBA FINALS<br />JERSEY OFICIAL COMEMORATIVA
            </h1>

            <a href="#reviews" className="nba-rating">
              <span className="stars">★★★★★</span> 4.8 <span className="muted">(1.247 avaliações)</span>
            </a>

            {/* PRICE */}
            <div className="nba-price-box">
              {hasDiscount && (
                <>
                  <div className="nba-price-row">
                    <span className="muted">Preço original:</span>
                    <span className="strike">{fmt(ORIGINAL_PRICE)}</span>
                  </div>
                  <div className="nba-price-row">
                    <span className="muted">Seu desconto do quiz:</span>
                    <span className="green-bold">-{fmt(discount)}</span>
                  </div>
                  <div className="nba-price-divider" />
                </>
              )}
              <div className="nba-price-final-row">
                <span className="label-final">PREÇO CONQUISTADO:</span>
                <span className="price-final">{fmt(finalPrice)}</span>
              </div>
              {hasDiscount && (
                <p className="nba-quiz-note">🏆 Desconto conquistado no Quiz do Torcedor</p>
              )}
            </div>

            {/* SIZE */}
            <div className="nba-section">
              <div className="nba-section-head">
                <span>SELECIONE O TAMANHO:</span>
                <a href="#" className="nba-size-guide">Guia de Tamanhos ↗</a>
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
                <div className="nba-section-head"><span>QUANTIDADE:</span></div>
                <div className="nba-qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
              </div>
            )}

            {/* BUTTONS */}
            <button
              className={`nba-btn nba-btn-cart ${added ? "added" : ""}`}
              disabled={!canBuy}
              onClick={handleAdd}
            >
              {added ? "✓ ADICIONADO" : "ADICIONAR AO CARRINHO"}
            </button>
            <button className="nba-btn nba-btn-buy" disabled={!canBuy}>
              COMPRAR AGORA
            </button>

            {/* COUNTDOWN */}
            <div className={`nba-countdown ${expired ? "expired" : ""}`}>
              {expired ? (
                <p>Oferta expirada — <a href="/">recomece o quiz</a> para um novo desconto</p>
              ) : (
                <>⏱ Oferta expira em: <strong>00h : {mm}m : {ss}s</strong></>
              )}
            </div>

            {/* WISH/SHARE */}
            <div className="nba-wish">
              <button onClick={() => setWished((w) => !w)}>
                {wished ? "♥" : "♡"} Adicionar à lista de desejos
              </button>
              <button>↗ Compartilhar</button>
            </div>

            {/* TRUST */}
            <ul className="nba-trust">
              <li>🚚 Frete grátis acima de $75</li>
              <li>🔄 Devolução grátis em 30 dias</li>
              <li>🔒 Pagamento 100% seguro</li>
              <li>✅ Produto oficial NBA / Nike</li>
            </ul>
          </div>
        </div>

        {/* ACCORDIONS */}
        <section className="nba-accordions">
          {[
            { id: "details", label: "Detalhes do produto", body: [
              "Jersey Swingman oficial Nike",
              "Patch comemorativo 2026 NBA Finals bordado",
              "Tecnologia Dri-FIT para controle de temperatura",
              "100% poliéster reciclado",
              "Patch de campeão no ombro direito",
              "Numeração e nome em tackle twill",
              "Importado",
            ]},
            { id: "fit", label: "Tamanho e ajuste", body: [
              "Modelagem regular unissex",
              "Referência: tamanho M veste do P ao M",
              "Consulte o guia de tamanhos para dúvidas",
            ]},
            { id: "ship", label: "Entrega e devoluções", body: [
              "Frete grátis em pedidos acima de $75",
              "Entrega em 3-5 dias úteis",
              "Devolução gratuita em até 30 dias",
              "Produto oficial — garantia de autenticidade",
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
              <div className="muted">de 5 estrelas</div>
              <div className="muted">1.247 avaliações</div>
            </div>
            <div className="nba-bars">
              {[
                [5, 76], [4, 18], [3, 4], [2, 1], [1, 1],
              ].map(([s, p]) => (
                <div key={s} className="bar-row">
                  <span>{s} estrelas</span>
                  <div className="bar"><div style={{ width: `${p}%` }} /></div>
                  <span>{p}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="nba-review-cards">
            {[
              { n: "Carlos M.", c: "São Paulo", d: "2 dias", t: "Incrível qualidade!", b: "A blusa chegou perfeita, o patch do campeonato é lindo." },
              { n: "Marina S.", c: "Rio de Janeiro", d: "5 dias", t: "Sonho realizado", b: "Esperei tanto por esse título, e a jersey é digna do momento." },
              { n: "João P.", c: "Belo Horizonte", d: "1 semana", t: "Tecido excelente", b: "Bem leve, modelagem perfeita. Recomendo." },
            ].map((r) => (
              <article key={r.n} className="nba-review">
                <div className="stars">★★★★★</div>
                <h3>"{r.t}"</h3>
                <div className="meta">{r.n} · {r.c} · {r.d}</div>
                <p>"{r.b}"</p>
                <div className="verified">✓ Compra verificada</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="nba-related">
        <div className="nba-container">
          <h2>VOCÊ TAMBÉM PODE GOSTAR</h2>
          <div className="nba-related-grid">
            {[
              { n: "Knicks 2026 Champions Hoodie", p: 89.9 },
              { n: "Knicks Finals Cap Snapback", p: 39.9 },
              { n: "Knicks Champions T-Shirt", p: 34.9 },
              { n: "Knicks Banner 2026 Poster", p: 24.9 },
            ].map((p) => (
              <div key={p.n} className="nba-related-card">
                <div className="img">KNICKS</div>
                <div className="name">{p.n}</div>
                <div className="price">{fmt(p.p)}</div>
                <button>Adicionar</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="nba-footer">
        <div className="nba-container">
          <div className="nba-footer-grid">
            <div className="nba-footer-logo">NBA</div>
            <div>
              <h4>Minha Conta</h4>
              <ul><li>Pedidos</li><li>Lista de Desejos</li><li>Endereços</li></ul>
            </div>
            <div>
              <h4>Ajuda</h4>
              <ul><li>FAQ</li><li>Devoluções</li><li>Contato</li></ul>
            </div>
            <div>
              <h4>Sobre</h4>
              <ul><li>Parceiros</li><li>Política</li><li>Privacidade</li></ul>
            </div>
          </div>
          <div className="nba-pay">VISA · MASTERCARD · AMEX · PAYPAL · APPLE PAY</div>
          <div className="nba-copy">© 2026 NBA Store · Todos os direitos reservados</div>
        </div>
      </footer>

      {/* STICKY MOBILE BAR */}
      {showSticky && (
        <div className="nba-sticky-bar">
          <div className="img">P</div>
          <div className="info">
            <div className="n">KNICKS JERSEY 2026</div>
            <div className="p">{fmt(finalPrice)}</div>
          </div>
          <button disabled={!canBuy}>COMPRAR</button>
        </div>
      )}
    </div>
  );
}

const css = `
.nba-page { font-family: 'Inter', sans-serif; color: #333; background: #fff; min-height: 100vh; }
.nba-container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

/* HEADER */
.nba-header { position: sticky; top: 0; z-index: 1000; background: #000; }
.nba-header-inner { max-width: 1280px; margin: 0 auto; padding: 14px 24px; display: flex; justify-content: space-between; align-items: center; }
.nba-header-left { display: flex; align-items: center; gap: 32px; }
.nba-logo { color: #fff; font-family: 'Barlow Condensed'; font-weight: 800; font-style: italic; font-size: 24px; letter-spacing: 1px; }
.nba-nav { display: flex; gap: 22px; }
.nba-nav a { color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; text-decoration: none; font-weight: 500; }
.nba-nav a:hover { color: #F58426; }
.nba-header-right { display: flex; gap: 18px; color: #fff; font-size: 18px; align-items: center; }
.nba-cart { position: relative; }
.nba-cart-badge { position: absolute; top: -6px; right: -10px; background: #F58426; color: #000; font-size: 10px; font-weight: 700; padding: 1px 5px; border-radius: 10px; }
.nba-header-stripe { height: 3px; background: #F58426; }

/* CRUMB */
.nba-crumb { display: flex; gap: 8px; align-items: center; padding: 12px 0; font-size: 12px; color: #767676; }
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
.nba-img-placeholder { width: 100%; height: 100%; background: #E8F0F8; display: flex; align-items: center; justify-content: center; color: #006BB6; font-family: 'Barlow Condensed'; font-weight: 700; font-style: italic; font-size: 32px; text-align: center; transition: transform 0.1s; position: relative; }
.thumb-idx { position: absolute; bottom: 16px; right: 16px; font-size: 14px; color: #767676; font-family: 'Inter'; font-style: normal; }
.nba-finals-badge { position: absolute; top: 16px; left: 16px; background: #006BB6; color: #fff; font-size: 11px; font-weight: 700; padding: 6px 10px; letter-spacing: 0.5px; z-index: 2; }
.nba-thumbs { display: flex; gap: 8px; margin-top: 12px; overflow-x: auto; }
.nba-thumb { width: 80px; height: 80px; min-width: 80px; background: #F5F5F5; border: 1px solid #E5E5E5; cursor: pointer; color: #767676; font-weight: 600; }
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
.nba-related-card .img { aspect-ratio: 1; background: #E8F0F8; color: #006BB6; display: grid; place-items: center; font-family: 'Barlow Condensed'; font-style: italic; font-weight: 700; transition: transform 0.2s; overflow: hidden; }
.nba-related-card:hover .img { transform: scale(1.03); }
.nba-related-card .name { font-size: 13px; color: #333; }
.nba-related-card .price { font-weight: 700; color: #006BB6; }
.nba-related-card button { background: #000; color: #fff; border: none; padding: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; cursor: pointer; }

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
.nba-sticky-bar .img { width: 44px; height: 44px; background: #E8F0F8; color: #006BB6; display: grid; place-items: center; font-weight: 700; }
.nba-sticky-bar .info { flex: 1; color: #fff; min-width: 0; }
.nba-sticky-bar .info .n { font-size: 12px; font-weight: 600; }
.nba-sticky-bar .info .p { font-size: 16px; color: #F58426; font-weight: 700; }
.nba-sticky-bar button { background: #006BB6; color: #fff; border: none; padding: 12px 16px; font-weight: 700; font-size: 12px; text-transform: uppercase; cursor: pointer; }
.nba-sticky-bar button:disabled { opacity: 0.5; }
`;
