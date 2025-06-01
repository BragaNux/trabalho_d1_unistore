import { useState } from "react";
import "./PaymentMethod.css";
import QRCode from "react-qr-code";

export default function PaymentMethod() {
  // Guarda o método de pagamento selecionado
  const [metodo, setMetodo] = useState("");
  // Indica se o pagamento foi registrado com sucesso
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  // Quando o usuário clica em "Pagar", registra o método no localStorage
  const handlePagar = () => {
    if (metodo) {
      const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
      if (user?.email) {
        // Salva o método escolhido vinculado ao e-mail do usuário
        localStorage.setItem(`pagamento_${user.email}`, metodo);
        setPagamentoConfirmado(true);
      }
    }
  };

  return (
    <div className="payment-container">
      <h1>Escolha o Método de Pagamento</h1>

      {/* Opções de pagamento disponíveis */}
      <div className="payment-options">
        <label>
          <input
            type="radio"
            name="metodo"
            value="pix"
            checked={metodo === "pix"}
            onChange={() => setMetodo("pix")}
          />
          PIX
        </label>
        <label>
          <input
            type="radio"
            name="metodo"
            value="boleto"
            checked={metodo === "boleto"}
            onChange={() => setMetodo("boleto")}
          />
          Boleto
        </label>
        <label>
          <input
            type="radio"
            name="metodo"
            value="cartao"
            checked={metodo === "cartao"}
            onChange={() => setMetodo("cartao")}
          />
          Cartão de Crédito
        </label>
      </div>

      {/* Exibe a área correspondente ao método selecionado */}
      <div className="payment-display">
        {metodo === "pix" && (
          <div className="pix-area">
            <p>Escaneie o QR Code para pagar</p>
            <QRCode value="pix-unistore-123456789" size={180} />
          </div>
        )}

        {metodo === "boleto" && (
          <div className="boleto-area">
            <p>Boleto Bancário</p>
            <div className="boleto">
              <strong>Banco UniStore</strong><br />
              <span>34191.79001 01043.510047 91020.150008 1 23450000010000</span><br />
              <span>Vencimento: 10/06/2025</span><br />
              <span>Valor: R$ 100,00</span>
            </div>
          </div>
        )}

        {metodo === "cartao" && (
          <div className="cartao-area">
            {/* Campos fictícios para simular o formulário de cartão */}
            <input type="text" placeholder="Número do Cartão" />
            <input type="text" placeholder="Nome Impresso no Cartão" />
            <input type="text" placeholder="Validade (MM/AA)" />
            <input type="text" placeholder="CVV" />
          </div>
        )}
      </div>

      {/* Botão para confirmar pagamento */}
      <button className="pagar-button" onClick={handlePagar}>
        Pagar
      </button>

      {/* Mensagem de sucesso após confirmação */}
      {pagamentoConfirmado && (
        <div className="sucesso-msg">Pagamento salvo com sucesso!</div>
      )}
    </div>
  );
}
