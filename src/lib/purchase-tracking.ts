import { getStripeEnvironment } from "@/lib/stripe";
import { sendUtmifyOrder, type TrackingParams } from "@/utils/utmify.functions";

export type PurchaseTrackingSnapshot = {
  tracking: TrackingParams;
  fbp?: string;
  fbc?: string;
  ip?: string;
  userAgent: string;
  eventSourceUrl: string;
};

export function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function validTrackingValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "null" || trimmed === "undefined") return undefined;
  return trimmed;
}

function readLocalStorageValue(key: string): string | undefined {
  try {
    const value = validTrackingValue(localStorage.getItem(key));
    if (!value) return undefined;
    const expiresAt = validTrackingValue(localStorage.getItem(`${key}_exp`));
    if (expiresAt && new Date(expiresAt) < new Date()) {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_exp`);
      return undefined;
    }
    return value;
  } catch {
    return undefined;
  }
}

function readUtmifyWindowParam(key: string): string | undefined {
  const maybeParams = (window as unknown as { utmParams?: URLSearchParams }).utmParams;
  return maybeParams instanceof URLSearchParams ? validTrackingValue(maybeParams.get(key)) : undefined;
}

export function readTracking(): TrackingParams {
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
          // Ignore malformed UTM storage.
        }
      }
    }
  } catch {
    // localStorage may be unavailable.
  }
  const params = new URLSearchParams(window.location.search);
  const pick = (k: string) => (
    validTrackingValue(params.get(k))
    ?? readUtmifyWindowParam(k)
    ?? validTrackingValue(stored[k])
    ?? readLocalStorageValue(k)
    ?? validTrackingValue(readCookie(k))
    ?? null
  );
  const xcod = pick("xcod");
  return {
    src: pick("src"),
    sck: pick("sck") ?? xcod,
    utm_source: pick("utm_source"),
    utm_medium: pick("utm_medium"),
    utm_campaign: pick("utm_campaign"),
    utm_content: pick("utm_content"),
    utm_term: pick("utm_term"),
  };
}

export async function getPublicIp(): Promise<string | undefined> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1500);
    const r = await fetch("https://api.ipify.org?format=json", { signal: controller.signal });
    clearTimeout(id);
    const j = (await r.json()) as { ip?: string };
    return j.ip;
  } catch {
    return undefined;
  }
}

export async function capturePurchaseTrackingSnapshot(): Promise<PurchaseTrackingSnapshot> {
  return {
    tracking: readTracking(),
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    ip: await getPublicIp(),
    userAgent: navigator.userAgent,
    eventSourceUrl: window.location.href,
  };
}

export function sessionIdFromClientSecret(clientSecret: string): string | undefined {
  return clientSecret.match(/^(cs_(?:test|live)_[a-zA-Z0-9]+)/)?.[1];
}

export async function trackPurchase(sessionId: string, snapshot?: PurchaseTrackingSnapshot, totalValue?: number) {
  const tracking = snapshot ?? await capturePurchaseTrackingSnapshot();
  const environment = getStripeEnvironment();

  const utmifyResult = await sendUtmifyOrder({
    data: {
      sessionId,
      environment,
      ip: tracking.ip,
      userAgent: tracking.userAgent,
      tracking: tracking.tracking,
    },
  });

  if (!utmifyResult.ok) console.error("UTMify dispatch failed", utmifyResult.error);
}