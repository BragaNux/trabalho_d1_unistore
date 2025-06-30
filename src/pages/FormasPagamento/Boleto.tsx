import "./Boleto.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Boleto() {
  const location = useLocation();
  const navigate = useNavigate();

  const total = location.state?.total || 0;
  const pedidoId = location.state?.pedidoId || "";

  const [codigoDeBarras, setCodigoDeBarras] = useState("");

  useEffect(() => {
    const base = "23793381286000";
    const rand = Math.floor(100000000 + Math.random() * 900000000);
    const codigo = `${base}${rand}${pedidoId.slice(-4)}`;
    setCodigoDeBarras(codigo);

    fetch("http://localhost:3000/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: pedidoId,
        method: "boleto",
        transactionCode: codigo,
      }),
    });
  }, [pedidoId]);

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
        <div className="barcode-visual">
          {codigoDeBarras.split("").map((_, index) => (
            <span key={index} className="bar" />
          ))}
        </div>
      </div>
      <button className="boleto-voltar" onClick={() => navigate("/orders")}>Ver Pedidos</button>
    </div>
  );
}
