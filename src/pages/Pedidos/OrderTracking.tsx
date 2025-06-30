import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./OrderTracking.css";

type Pedido = {
  id: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
};

type Item = {
  name: string;
  quantity: number;
  price_at_time: number;
};

type Tracking = {
  status: string;
};

const etapas = [
  { title: "Pedido Recebido", description: "Recebemos seu pedido e estamos preparando." },
  { title: "Separando Estoque", description: "Estamos separando os itens do seu pedido." },
  { title: "Saiu para Entrega", description: "O pedido está a caminho do endereço informado." },
  { title: "Entregue", description: "Seu pedido foi entregue com sucesso." },
];

const statusParaEtapa = (status: string): number => {
  switch (status.toLowerCase()) {
    case "processing":
      return 0;
    case "shipped":
      return 1;
    case "in_transit":
      return 2;
    case "delivered":
      return 3;
    default:
      return 0;
  }
};

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [itens, setItens] = useState<Item[]>([]);
  const [tracking, setTracking] = useState<Tracking | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (!user?.id || !id) return;

    const fetchPedido = async () => {
      try {
        const res = await fetch(`http://localhost:3333/api/orders/${user.id}`);
        const pedidos = await res.json();
        const encontrado = pedidos.find((p: any) => p.id == id);
        setPedido(encontrado || null);
      } catch (err) {
        console.error("Erro ao buscar pedido:", err);
      }
    };

    const fetchItens = async () => {
      try {
        const res = await fetch(`http://localhost:3333/api/orders/details/${id}`);
        const data = await res.json();
        setItens(data || []);
      } catch (err) {
        console.error("Erro ao buscar itens:", err);
      }
    };

    const fetchTracking = async () => {
      try {
        const res = await fetch(`http://localhost:3333/api/tracking/${id}`);
        const data = await res.json();
        setTracking(data || null);
      } catch (err) {
        console.error("Erro ao buscar tracking:", err);
      }
    };

    fetchPedido();
    fetchItens();
    fetchTracking();
  }, [id]);

  if (!pedido) {
    return <p style={{ textAlign: "center", marginTop: "100px" }}>Pedido não encontrado.</p>;
  }

  const statusIndex = tracking ? statusParaEtapa(tracking.status) : 0;
  const progresso = ((statusIndex + 1) / etapas.length) * 100;

  return (
    <div className="track-container">
      <div className="track-header">
        <img src="/order_tracking.png" alt="Pedido" className="track-avatar" />
        <div>
          <h2 className="track-title">Rastreamento do Pedido</h2>
          <p className="track-subtitle">Pedido #{pedido.id}</p>
        </div>
      </div>

      <div className="track-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progresso}%` }} />
        </div>
        <div className="track-progress-status">
          {etapas.map((_, index) => (
            <span
              key={index}
              className={`progress-status-dot ${index <= statusIndex ? "completed" : "pending"}`}
            >
              {index + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="track-box">
        <p className="track-label">Itens do Pedido</p>
        {itens.map((item, idx) => (
          <div key={idx} className="track-code">
            {item.name} x{item.quantity} - R$ {(item.price_at_time * item.quantity).toFixed(2)}
          </div>
        ))}
      </div>

      <div className="track-steps">
        {etapas.map((step, index) => (
          <div
            key={index}
            className={`track-step ${index > statusIndex ? "future" : ""}`}
          >
            <div className="step-info">
              <strong>{step.title}</strong>
              <span>{index <= statusIndex ? "✔️" : "⏳"}</span>
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
