import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

// Tipagem de pedido
type Pedido = {
  id: string;
  items: string[];
  total: number;
  metodo?: string;
  tipo?: string; // fallback antigo
  status?: string;
};

export default function Orders() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (!user?.email) return;

    const stored = JSON.parse(localStorage.getItem(`orders_${user.email}`) || "[]");

    // Garante que todos os campos tenham valores padrão
    const withDefaults = stored.map((p: Pedido) => ({
      ...p,
      metodo: p.metodo || p.tipo || "Desconhecido",
      status: p.status || "Pendente",
      items: p.items || [],
    }));

    setPedidos(withDefaults);
  }, []);

  return (
    <div className="orders-container">
      <h1 className="orders-title">🧾 Minhas Compras</h1>

      {/* Se não houver pedidos, mostra mensagem amigável */}
      {pedidos.length === 0 ? (
        <p className="orders-empty">Você ainda não realizou nenhuma compra.</p>
      ) : (
        <div className="orders-list">
          {pedidos.map((p) => (
            <div key={p.id} className="order-card">
              <h3 className="order-id">Pedido #{p.id}</h3>

              <p className="order-items">
                🛍️ Itens: {p.items.join(", ")}
              </p>

              <p className="order-total">
                💰 Total: <strong>R$ {p.total.toFixed(2)}</strong>
              </p>

              <p className="order-method">
                💳 Método:{" "}
                <strong>
                  {p.metodo
                    ? p.metodo.charAt(0).toUpperCase() + p.metodo.slice(1)
                    : "Desconhecido"}
                </strong>
              </p>

              <p className="order-status">
                {/* Indicador visual de status */}
                <span
                  className={`status-dot ${p.status?.toLowerCase().replace(/\s+/g, "-")}`}
                ></span>
                <span
                  className={`status ${p.status?.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {p.status}
                </span>
              </p>

              <button
                className="track-btn"
                onClick={() => navigate(`/order-tracking/${p.id}`)}
              >
                📦 Rastrear Pedido
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
