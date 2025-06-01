import "./Boleto.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Boleto() {
  const location = useLocation();
  const navigate = useNavigate();

  // Dados recebidos via navegação entre páginas
  const total = location.state?.total || 0;
  const pedidoId = location.state?.pedidoId || "";
  const cart = location.state?.cart || [];

  const [codigoDeBarras, setCodigoDeBarras] = useState("");

  useEffect(() => {
    // Geração de código de barras fake (formato aproximado de boleto real)
    const base = "23793381286000";
    const rand = Math.floor(100000000 + Math.random() * 900000000);
    setCodigoDeBarras(`${base}${rand}${pedidoId.slice(-4)}`);

    // Verifica e registra o pedido apenas se ainda não existir
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (user?.email) {
      const pedidosExistentes = JSON.parse(
        localStorage.getItem(`orders_${user.email}`) || "[]"
      );

      const jaExiste = pedidosExistentes.some((p: any) => p.id === pedidoId);
      if (!jaExiste) {
        const novoPedido = {
          id: pedidoId,
          items: cart.map((i: any) => i.name),
          total,
          metodo: "Boleto",
          status: "Pendente",
        };

        localStorage.setItem(
          `orders_${user.email}`,
          JSON.stringify([...pedidosExistentes, novoPedido])
        );
      }
    }
  }, [pedidoId, total, cart]);

  // Copia o código de barras para área de transferência
  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoDeBarras);
    alert("Código de barras copiado!");
  };

  return (
    <div className="boleto-container">
      <h1>Boleto Bancário</h1>
      <p className="boleto-subtitle">Use os dados abaixo para efetuar o pagamento</p>

      <div className="boleto-box">
        <div className="boleto-info">
          <strong>UniStore Institucional</strong>
          <p><strong>Valor:</strong> R$ {total.toFixed(2)}</p>
          <p><strong>Vencimento:</strong> 10 dias após emissão</p>
          <p><strong>Pedido:</strong> #{pedidoId}</p>
        </div>

        <div className="boleto-barcode">
          <code>{codigoDeBarras}</code>
          <button onClick={copiarCodigo}>📋 Copiar Código</button>
        </div>

        {/* Visualização fake das barras do boleto */}
        <div className="barcode-visual">
          {codigoDeBarras.split("").map((char, index) => (
            <span key={index} className="bar" />
          ))}
        </div>
      </div>

      <button className="boleto-voltar" onClick={() => navigate("/orders")}>
        Ver Pedidos
      </button>
    </div>
  );
}
