import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { capturePurchaseTrackingSnapshot, sessionIdFromClientSecret, trackPurchase, type PurchaseTrackingSnapshot } from "@/lib/purchase-tracking.client";
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
  let checkoutSessionId: string | undefined;
  let trackingSnapshot: PurchaseTrackingSnapshot | undefined;

  const fetchClientSecret = async (): Promise<string> => {
    trackingSnapshot = await capturePurchaseTrackingSnapshot();
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
    checkoutSessionId = sessionIdFromClientSecret(result.clientSecret);
    return result.clientSecret;
  };

  const onComplete = () => {
    if (!checkoutSessionId) return;
    trackPurchase(checkoutSessionId, trackingSnapshot).catch((err) => console.error("Purchase tracking failed", err));
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret, onComplete }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
