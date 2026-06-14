import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout/return")({
  validateSearch: (search: Record<string, unknown>): { session_id?: string } => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  component: CheckoutReturn,
});

function CheckoutReturn() {
  const { session_id: sessionId } = Route.useSearch();
  return (
    <div style={{ maxWidth: 560, margin: "80px auto", padding: 24, textAlign: "center", fontFamily: "system-ui" }}>
      {sessionId ? (
        <>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>🏆 Pedido confirmado!</h1>
          <p style={{ color: "#555", marginBottom: 24 }}>
            Recebemos seu pagamento. Você receberá um e-mail com os detalhes do envio em breve.
          </p>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 24 }}>Pedido: {sessionId}</p>
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Nenhuma informação encontrada</h1>
          <p style={{ color: "#555", marginBottom: 24 }}>Não conseguimos localizar este pedido.</p>
        </>
      )}
      <Link to="/" style={{ color: "#F58426", fontWeight: 700 }}>← Voltar para a loja</Link>
    </div>
  );
}
