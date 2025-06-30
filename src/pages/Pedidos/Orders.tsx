import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";

// Tipagem de pedido
type Pedido = {
  id: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
};

type Pagamento = {
  method: string;
  status: string;
};

export default function Orders() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (!user?.id) return;

    const fetchPedidos = async () => {
      try {
        const res = await fetch(`http://localhost:3333/api/orders/${user.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Erro ao buscar pedidos");

        setPedidos(data);
      } catch (err) {
        console.error("Erro:", err);
      } finally {
        setCarregando(false);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="orders-container">
      <h1 className="orders-title">🧾 Minhas Compras</h1>

      {carregando ? (
        <p>Carregando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p className="orders-empty">Você ainda não realizou nenhuma compra.</p>
      ) : (
        <div className="orders-list">
          {pedidos.map((p) => (
            <div key={p.id} className="order-card">
              <h3 className="order-id">Pedido #{p.id}</h3>

              <p className="order-total">
                💰 Total: <strong>R$ {Number(p.total_amount).toFixed(2)}</strong>
              </p>


              <p className="order-method">
                💳 Método:{" "}
                <strong>
                  {p.payment_method.charAt(0).toUpperCase() + p.payment_method.slice(1)}
                </strong>
              </p>

              <p className="order-status">
                <span
                  className={`status-dot ${p.status.toLowerCase().replace(/\s+/g, "-")}`}
                ></span>
                <span
                  className={`status ${p.status.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {p.status}
                </span>
              </p>

              <p className="order-date">
                📅 Realizado em: {new Date(p.created_at).toLocaleDateString("pt-BR")}
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
