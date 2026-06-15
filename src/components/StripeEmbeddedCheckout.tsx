import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useRef } from "react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { capturePurchaseTrackingSnapshot, sessionIdFromClientSecret, trackPurchase, type PurchaseTrackingSnapshot } from "@/lib/purchase-tracking";
import { createCheckoutSession } from "@/utils/payments.functions";

interface CartItem {
  priceId: string;
  quantity?: number;
  size?: string;
}

interface Props {
  priceId?: string;
  quantity?: number;
  size?: string;
  items?: CartItem[];
  customerEmail?: string;
  returnUrl?: string;
}

export function StripeEmbeddedCheckout({ priceId, quantity, size, items, customerEmail, returnUrl }: Props) {
  const checkoutSessionIdRef = useRef<string | undefined>(undefined);
  const trackingSnapshotRef = useRef<PurchaseTrackingSnapshot | undefined>(undefined);

  const fetchClientSecret = async (): Promise<string> => {
    trackingSnapshotRef.current = await capturePurchaseTrackingSnapshot();
    const result = await createCheckoutSession({
      data: {
        priceId,
        quantity,
        size,
        items,
        customerEmail,
        returnUrl: returnUrl || `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    checkoutSessionIdRef.current = sessionIdFromClientSecret(result.clientSecret);
    return result.clientSecret;
  };

  const onComplete = () => {
    if (!checkoutSessionIdRef.current) return;
    trackPurchase(checkoutSessionIdRef.current, trackingSnapshotRef.current).catch((err) => console.error("Purchase tracking failed", err));
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret, onComplete }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
