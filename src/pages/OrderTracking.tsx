import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderTracking.css";

// Tipagem do pedido armazenado localmente
type Pedido = {
  id: string;
  items: string[];
  total: number;
  metodo?: string;
  tipo?: string;
  status?: string;
  statusIndex?: number; // Etapa atual da entrega
};

// Etapas fixas do processo de entrega
const etapas = [
  {
    title: "Pedido Recebido",
    description: "Recebemos seu pedido e estamos preparando.",
  },
  {
    title: "Separando Estoque",
    description: "Estamos separando os itens do seu pedido.",
  },
  {
    title: "Saiu para Entrega",
    description: "O pedido está a caminho do endereço informado.",
  },
  {
    title: "Entregue",
    description: "Seu pedido foi entregue com sucesso.",
  },
];

export default function OrderTracking() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (!user?.email) return;

    const key = `orders_${user.email}`;
    const allOrders: Pedido[] = JSON.parse(localStorage.getItem(key) || "[]");
    const index = allOrders.findIndex((p) => p.id === id);

    // Caso encontre o pedido, atualiza e define etapa (se ainda não tiver)
    if (index !== -1) {
      if (allOrders[index].statusIndex === undefined) {
        allOrders[index].statusIndex = Math.floor(Math.random() * etapas.length);
        localStorage.setItem(key, JSON.stringify(allOrders));
      }

      const pedidoCorrigido: Pedido = {
        ...allOrders[index],
        metodo: allOrders[index].metodo || allOrders[index].tipo || "Desconhecido",
        status: allOrders[index].status || "Pendente",
        items: allOrders[index].items || [],
      };

      setPedido(pedidoCorrigido);
    }
  }, [id]);

  if (!pedido) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Pedido não encontrado.</p>;
  }

  // Calcula progresso com base na etapa atual
  const progresso = ((pedido.statusIndex! + 1) / etapas.length) * 100;

  return (
    <div className="track-container">
      <div className="track-header">
        <img src="/order_tracking.png" alt="Profile" className="track-avatar" />
        <div>
          <h2 className="track-title">Rastreamento do Pedido</h2>
          <p className="track-subtitle">Pedido #{pedido.id}</p>
        </div>
      </div>

      {/* Barra de progresso com indicador dinâmico */}
      <div className="track-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progresso}%` }} />
        </div>
        <div className="track-progress-status">
          {etapas.map((_, index) => (
            <span
              key={index}
              className={`progress-status-dot ${
                index <= pedido.statusIndex! ? "completed" : "pending"
              }`}
            >
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Itens do pedido */}
      <div className="track-box">
        <p className="track-label">Itens do Pedido</p>
        <div className="track-code">{pedido.items.join(", ")}</div>
      </div>

      {/* Etapas detalhadas */}
      <div className="track-steps">
        {etapas.map((step, index) => (
          <div
            key={index}
            className={`track-step ${index > pedido.statusIndex! ? "future" : ""}`}
          >
            <div className="step-info">
              <strong>{step.title}</strong>
              <span>{index <= pedido.statusIndex! ? "✔️" : "⏳"}</span>
            </div>
            <p>{step.description}</p>
          </div>
        ))}
      </div>

      <button className="track-back" onClick={() => navigate("/orders")}>
        Voltar para pedidos
      </button>
    </div>
  );
}
