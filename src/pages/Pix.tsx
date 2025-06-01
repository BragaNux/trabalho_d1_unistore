import { QRCode } from "react-qrcode-logo"; // Componente para gerar o QR Code com estilo
import "./Pix.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Pix() {
  const location = useLocation(); // Acesso aos dados passados via rota
  const navigate = useNavigate(); // Navegação programática entre páginas

  // Código gerado dinamicamente com base no ID do pedido
  const [codigoPix, setCodigoPix] = useState("");

  // Total e ID do pedido que vieram da página de pagamento
  const total = location.state?.total || 0;
  const pedidoId = location.state?.pedidoId || "";

  // Quando a tela carregar, monta o código Pix com base no ID
  useEffect(() => {
    const chave = `unistore-pix-${pedidoId}`;
    setCodigoPix(chave);
  }, [pedidoId]);

  // Função para copiar o código Pix para a área de transferência
  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigoPix);
    alert("Código Pix copiado!");
  };

  return (
    <div className="pix-container">
      <h1 className="pix-title">Pagamento via Pix</h1>
      <p className="pix-subtitle">Escaneie o QR Code abaixo ou copie o código Pix.</p>

      {/* Área do QR Code, visual moderna com logo se quiser depois */}
      <div className="pix-qr">
        <QRCode value={codigoPix} size={220} fgColor="#2d3436" />
      </div>

      {/* Exibe o valor total da compra */}
      <p className="pix-total">
        <strong>Total:</strong> R$ {total.toFixed(2)}
      </p>

      {/* Caixa com o código Pix e botão para copiar */}
      <div className="pix-code-box">
        <code>{codigoPix}</code>
        <button onClick={copiarCodigo}>📋 Copiar Código</button>
      </div>

      {/* Botão para o usuário voltar e ver os pedidos feitos */}
      <button className="pix-voltar" onClick={() => navigate("/orders")}>
        Ver Pedidos
      </button>
    </div>
  );
}
