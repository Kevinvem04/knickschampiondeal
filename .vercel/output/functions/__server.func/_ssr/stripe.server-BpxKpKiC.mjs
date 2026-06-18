import { T as TSS_SERVER_FUNCTION } from "./server-wIqWYVKK.mjs";
import { S as Stripe } from "../_libs/stripe.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const getEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};
const GATEWAY_STRIPE_BASE = "https://connector-gateway.lovable.dev/stripe";
function getConnectionApiKey(env) {
  return env === "sandbox" ? getEnv("STRIPE_SANDBOX_API_KEY") : getEnv("STRIPE_LIVE_API_KEY");
}
function createStripeClient(env) {
  const connectionApiKey = getConnectionApiKey(env);
  if (connectionApiKey.startsWith("sk_") || connectionApiKey.startsWith("rk_")) {
    return new Stripe(connectionApiKey, {
      // @ts-ignore
      apiVersion: "2026-03-25.dahlia"
    });
  }
  const lovableApiKey = getEnv("LOVABLE_API_KEY");
  return new Stripe(connectionApiKey, {
    // @ts-ignore
    apiVersion: "2026-03-25.dahlia",
    httpClient: Stripe.createFetchHttpClient((input, init) => {
      const stripeUrl = input instanceof Request ? input.url : input.toString();
      const gatewayUrl = stripeUrl.replace("https://api.stripe.com", GATEWAY_STRIPE_BASE);
      return fetch(gatewayUrl, {
        ...init,
        headers: {
          ...Object.fromEntries(
            new Headers(init?.headers ?? (input instanceof Request ? input.headers : void 0)).entries()
          ),
          "X-Connection-Api-Key": connectionApiKey,
          "Lovable-API-Key": lovableApiKey
        }
      });
    })
  });
}
function getStripeErrorMessage(error) {
  if (error && typeof error === "object") {
    const stripeError = error;
    const message = stripeError.raw?.message ?? stripeError.message;
    if (message) return message;
  }
  return "Stripe request failed";
}
export {
  createStripeClient as a,
  createServerRpc as c,
  getStripeErrorMessage as g
};
