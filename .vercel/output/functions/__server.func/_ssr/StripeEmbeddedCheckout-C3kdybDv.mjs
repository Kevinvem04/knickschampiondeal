import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { E as EmbeddedCheckoutProvider, a as EmbeddedCheckout } from "../_libs/stripe__react-stripe-js.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { l as loadStripe } from "../_libs/stripe__stripe-js.mjs";
import { b as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-wIqWYVKK.mjs";
const knicksLogo = "/assets/image_1-Rh4AHMd_.svg";
const camisaBrancaImg = "/assets/image_13-Cy3gto8x.webp";
let clientToken = "pk_live_51SKit9HRlwatDM20YlTlhHbFBRL4ib1Y0sgIlSiAcAUNgSfuxAyNmLBRNyl2B2mckZMc8yUEgzdQ8a0trtXiLcht00eC2Rpcua";
if (!clientToken || clientToken.startsWith("pk_test_")) {
  clientToken = "pk_live_51SKit9HRlwatDM20YlTlhHbFBRL4ib1Y0sgIlSiAcAUNgSfuxAyNmLBRNyl2B2mckZMc8yUEgzdQ8a0trtXiLcht00eC2Rpcua";
}
function paymentsEnvironment() {
  if (clientToken?.startsWith("pk_test_")) return "sandbox";
  if (clientToken?.startsWith("pk_live_")) return "live";
  throw new Error(
    "Pagamentos não configurados para esta build. Conclua o go-live do Stripe no Lovable para aceitar pagamentos reais."
  );
}
let stripePromise = null;
function getStripe() {
  if (!stripePromise) {
    paymentsEnvironment();
    stripePromise = loadStripe(clientToken);
  }
  return stripePromise;
}
function getStripeEnvironment() {
  return paymentsEnvironment();
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const sendUtmifyOrder = createServerFn({
  method: "POST"
}).validator((data) => {
  if (!/^cs_(test|live)_[a-zA-Z0-9]+$/.test(data.sessionId)) throw new Error("Invalid sessionId");
  return data;
}).handler(createSsrRpc("2d26034e4c816809b097f48fd4e9f2fe9f6da925f212611b2ee05bf0f5be0147"));
function readCookie(name) {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : void 0;
}
function validTrackingValue(value) {
  if (typeof value !== "string") return void 0;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return void 0;
  return trimmed;
}
function readLocalStorageValue(key) {
  try {
    const value = validTrackingValue(localStorage.getItem(key));
    if (!value) return void 0;
    const expiresAt = validTrackingValue(localStorage.getItem(`${key}_exp`));
    if (expiresAt && new Date(expiresAt) < /* @__PURE__ */ new Date()) {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_exp`);
      return void 0;
    }
    return value;
  } catch {
    return void 0;
  }
}
function readUtmifyWindowParam(key) {
  const maybeParams = window.utmParams;
  return maybeParams instanceof URLSearchParams ? validTrackingValue(maybeParams.get(key)) : void 0;
}
function readTracking() {
  const keys = ["utmify", "utms", "utmify_utms"];
  let stored = {};
  try {
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") stored = { ...stored, ...parsed };
        } catch {
        }
      }
    }
  } catch {
  }
  const params = new URLSearchParams(window.location.search);
  const pick = (k) => validTrackingValue(params.get(k)) ?? readUtmifyWindowParam(k) ?? validTrackingValue(stored[k]) ?? readLocalStorageValue(k) ?? validTrackingValue(readCookie(k)) ?? null;
  const xcod = pick("xcod");
  return {
    src: pick("src"),
    sck: pick("sck") ?? xcod,
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term")
  };
}
async function getPublicIp() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    const r = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
    clearTimeout(id);
    const j = await r.json();
    return j.ip;
  } catch {
    return void 0;
  }
}
async function capturePurchaseTrackingSnapshot() {
  return {
    tracking: readTracking(),
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    ip: await getPublicIp(),
    userAgent: navigator.userAgent,
    eventSourceUrl: window.location.href
  };
}
function sessionIdFromClientSecret(clientSecret) {
  return clientSecret.match(/^(cs_(?:test|live)_[a-zA-Z0-9]+)/)?.[1];
}
async function trackPurchase(sessionId, snapshot, totalValue) {
  const tracking = snapshot ?? await capturePurchaseTrackingSnapshot();
  const environment = getStripeEnvironment();
  const utmifyResult = await sendUtmifyOrder({
    data: {
      sessionId,
      environment,
      ip: tracking.ip,
      userAgent: tracking.userAgent,
      tracking: tracking.tracking
    }
  });
  if (!utmifyResult.ok) console.error("UTMify dispatch failed", utmifyResult.error);
}
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
}).handler(createSsrRpc("6186b6303b8f63886db376ba9a679f2f179f7619f609db631a0d86c4045dec88"));
function StripeEmbeddedCheckout({ priceId, quantity, size, items, customerEmail, returnUrl, estimatedTotal }) {
  const initialCheckoutRef = reactExports.useRef({ priceId, quantity, size, items, customerEmail, returnUrl, estimatedTotal });
  const checkoutSessionIdRef = reactExports.useRef(void 0);
  const trackingSnapshotRef = reactExports.useRef(void 0);
  const { data: clientSecret, isPending, error } = useQuery({
    queryKey: ["stripe-checkout-session", initialCheckoutRef.current],
    queryFn: async () => {
      const checkout = initialCheckoutRef.current;
      trackingSnapshotRef.current = await capturePurchaseTrackingSnapshot();
      const result = await createCheckoutSession({
        data: {
          priceId: checkout.priceId,
          quantity: checkout.quantity,
          size: checkout.size,
          items: checkout.items,
          customerEmail: checkout.customerEmail,
          returnUrl: checkout.returnUrl || `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
          environment: getStripeEnvironment(),
          tracking: trackingSnapshotRef.current?.tracking
        }
      });
      if ("error" in result) throw new Error(result.error);
      if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
      checkoutSessionIdRef.current = sessionIdFromClientSecret(result.clientSecret);
      return result.clientSecret;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1
  });
  const onComplete = reactExports.useCallback(() => {
    if (!checkoutSessionIdRef.current) return;
    trackPurchase(checkoutSessionIdRef.current, trackingSnapshotRef.current, initialCheckoutRef.current.estimatedTotal).catch((err) => console.error("Purchase tracking failed", err));
  }, []);
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 40, textAlign: "center", background: "#fff", borderRadius: 8, color: "#d32f2f" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Erro ao carregar pagamento" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: error instanceof Error ? error.message : "Erro desconhecido" })
    ] });
  }
  if (isPending || !clientSecret) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 60, textAlign: "center", background: "#fff", borderRadius: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { color: "#333", marginBottom: 16 }, children: "Carregando Pagamento Seguro..." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#666" }, children: "Por favor, aguarde enquanto conectamos com a Stripe." })
    ] });
  }
  const checkoutOptions = reactExports.useMemo(() => ({ clientSecret, onComplete }), [clientSecret, onComplete]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: "checkout", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmbeddedCheckoutProvider, { stripe: getStripe(), options: checkoutOptions, children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmbeddedCheckout, {}) }) });
}
export {
  StripeEmbeddedCheckout as S,
  camisaBrancaImg as c,
  knicksLogo as k,
  trackPurchase as t
};
