import { QRCode } from "react-qrcode-logo";
import "./Pix.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Pix() {
  const location = useLocation();
  const navigate = useNavigate();

  const total = location.state?.total || 0;
  const pedidoId = location.state?.pedidoId || "";
  const userId = location.state?.userId || "";

  const [codigoPix, setCodigoPix] = useState("");

  useEffect(() => {
    const chave = `unistore-pix-${pedidoId}`;
    setCodigoPix(chave);

    // Cria pagamento
    fetch("http://localhost:3000/api/payments/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: pedidoId,
        method: "pix",
        transactionCode: chave,
      }),
    });
  }, [pedidoId]);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoPix);
    alert("Código Pix copiado!");
  };

  return (
    <div className="pix-container">
      <h1 className="pix-title">Pagamento via Pix</h1>
      <p className="pix-subtitle">Escaneie o QR Code abaixo ou copie o código Pix.</p>
      <div className="pix-qr">
        <QRCode value={codigoPix} size={220} fgColor="#2d3436" />
      </div>
      <p className="pix-total"><strong>Total:</strong> R$ {total.toFixed(2)}</p>
      <div className="pix-code-box">
        <code>{codigoPix}</code>
        <button onClick={copiarCodigo}>📋 Copiar Código</button>
      </div>
      <button className="pix-voltar" onClick={() => navigate("/orders")}>Ver Pedidos</button>
    </div>
  );
}
