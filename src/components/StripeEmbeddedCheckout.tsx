import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { capturePurchaseTrackingSnapshot, sessionIdFromClientSecret, trackPurchase, type PurchaseTrackingSnapshot } from "@/lib/purchase-tracking";
import { createCheckoutSession } from "@/utils/payments.functions";

interface CartItem {
  priceId: string;
  quantity?: number;
  size?: string;
  name?: string;
  price?: number;
}

interface Props {
  priceId?: string;
  quantity?: number;
  size?: string;
  items?: CartItem[];
  customerEmail?: string;
  returnUrl?: string;
  estimatedTotal?: number;
}

export function StripeEmbeddedCheckout({ priceId, quantity, size, items, customerEmail, returnUrl, estimatedTotal }: Props) {
  const initialCheckoutRef = useRef({ priceId, quantity, size, items, customerEmail, returnUrl, estimatedTotal });
  const checkoutSessionIdRef = useRef<string | undefined>(undefined);
  const trackingSnapshotRef = useRef<PurchaseTrackingSnapshot | undefined>(undefined);

  const isMissingKey = !import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

  const { data: clientSecret, isPending, error } = useQuery({
    queryKey: ["stripe-checkout-session", initialCheckoutRef.current],
    queryFn: async () => {
      if (isMissingKey) return null; // Previne rodar o fetch real se não tiver chave
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
          tracking: trackingSnapshotRef.current?.tracking,
        },
      });
      if ("error" in result) throw new Error(result.error);
      if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
      checkoutSessionIdRef.current = sessionIdFromClientSecret(result.clientSecret);
      return result.clientSecret;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const onComplete = useCallback(() => {
    if (!checkoutSessionIdRef.current) return;
    trackPurchase(checkoutSessionIdRef.current, trackingSnapshotRef.current, initialCheckoutRef.current.estimatedTotal).catch((err) => console.error("Purchase tracking failed", err));
  }, []);

  const checkoutOptions = useMemo(() => ({ clientSecret: clientSecret || "", onComplete }), [clientSecret, onComplete]);

  if (isMissingKey) {
    return (
      <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 8, fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#F58426", fontSize: 24, marginBottom: 12 }}>Stripe Checkout (Mock Local)</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 8, color: "#d32f2f" }}>
        <h2>Error loading payment</h2>
        <p>{error instanceof Error ? error.message : "Erro desconhecido"}</p>
      </div>
    );
  }

  if (isPending || !clientSecret) {
    return (
      <div style={{ padding: 60, textAlign: "center", background: "#fff", borderRadius: 8 }}>
        <h3 style={{ color: "#333", marginBottom: 16 }}>Please Wait...</h3>
        <p style={{ color: "#666" }}>While we connect to your payment</p>
      </div>
    );
  }

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={checkoutOptions}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
