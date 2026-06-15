import { getStripeEnvironment } from "@/lib/stripe";
import { sendPurchaseCapi } from "@/utils/meta-capi.functions";
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
  const pick = (k: string) => stored[k] ?? readCookie(k) ?? params.get(k) ?? null;
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

export async function getPublicIp(): Promise<string | undefined> {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
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

export async function trackPurchase(sessionId: string, snapshot?: PurchaseTrackingSnapshot) {
  const tracking = snapshot ?? await capturePurchaseTrackingSnapshot();
  const environment = getStripeEnvironment();

  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq === "function") {
    w.fbq("track", "Purchase", { currency: "USD", value: 59.9 }, { eventID: sessionId });
  }

  const [metaResult, utmifyResult] = await Promise.allSettled([
    sendPurchaseCapi({
      data: {
        sessionId,
        environment,
        eventSourceUrl: tracking.eventSourceUrl,
        userAgent: tracking.userAgent,
        ip: tracking.ip,
        fbp: tracking.fbp,
        fbc: tracking.fbc,
      },
    }),
    sendUtmifyOrder({
      data: {
        sessionId,
        environment,
        ip: tracking.ip,
        userAgent: tracking.userAgent,
        tracking: tracking.tracking,
      },
    }),
  ]);

  if (metaResult.status === "rejected") console.error("CAPI dispatch failed", metaResult.reason);
  if (utmifyResult.status === "rejected") console.error("UTMify dispatch failed", utmifyResult.reason);
}