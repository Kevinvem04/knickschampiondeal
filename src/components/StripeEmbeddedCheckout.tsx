import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCallback, useMemo, useRef } from "react";
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

  if (isMissingKey) {
    return (
      <div style={{ padding: 40, textAlign: "center", background: "#fff", borderRadius: 8, fontFamily: "sans-serif" }}>
        <h2 style={{ color: "#F58426", fontSize: 24, marginBottom: 12 }}>Stripe Checkout (Mock Local)</h2>
        <p style={{ color: "#666", marginBottom: 24, lineHeight: 1.5 }}>
          As chaves do Stripe são gerenciadas pelo Lovable Cloud e não estão presentes no seu ambiente local.<br/>
          Para testar o checkout real, abra o projeto pela URL de Preview do Lovable ou insira chaves de teste no <code>.env</code>.
        </p>
        <button 
          onClick={() => alert("Isso simularia o sucesso do checkout no ambiente real!")} 
          style={{ padding: "12px 24px", background: "#006BB6", color: "white", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}>
          Simular Sucesso (Local)
        </button>
      </div>
    );
  }

  const fetchClientSecret = useCallback(async (): Promise<string> => {
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
        tracking: trackingSnapshotRef.current.tracking,
      },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    checkoutSessionIdRef.current = sessionIdFromClientSecret(result.clientSecret);
    return result.clientSecret;
  }, []);

  const onComplete = useCallback(() => {
    if (!checkoutSessionIdRef.current) return;
    trackPurchase(checkoutSessionIdRef.current, trackingSnapshotRef.current, initialCheckoutRef.current.estimatedTotal).catch((err) => console.error("Purchase tracking failed", err));
  }, []);

  const checkoutOptions = useMemo(() => ({ fetchClientSecret, onComplete }), [fetchClientSecret, onComplete]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={checkoutOptions}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
