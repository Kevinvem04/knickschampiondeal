import { loadStripe, type Stripe } from "@stripe/stripe-js";

type StripeEnv = "sandbox" | "live";

let clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

// Força o uso da chave Live caso o terminal/extensão do Lovable esteja injetando a pk_test_ por cima do .env
if (!clientToken || clientToken.startsWith("pk_test_")) {
  clientToken = "pk_live_51SKit9HRlwatDM20YlTlhHbFBRL4ib1Y0sgIlSiAcAUNgSfuxAyNmLBRNyl2B2mckZMc8yUEgzdQ8a0trtXiLcht00eC2Rpcua";
}

function paymentsEnvironment(): StripeEnv {
  if (clientToken?.startsWith("pk_test_")) return "sandbox";
  if (clientToken?.startsWith("pk_live_")) return "live";
  throw new Error(
    "Pagamentos não configurados para esta build. Conclua o go-live do Stripe no Lovable para aceitar pagamentos reais.",
  );
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    paymentsEnvironment();
    stripePromise = loadStripe(clientToken as string);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return paymentsEnvironment();
}
