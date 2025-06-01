import "./Payment.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart, CartItem } from "../context/CartContext";
import { useState, useEffect } from "react";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  // Recupera itens do carrinho e valor total da tela anterior
  const cart: CartItem[] = location.state?.cart || [];
  const baseTotal: number = location.state?.total || 0;

  // Estado para método de entrega e pagamento
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState("pix");

  // Dados de perfil usados no resumo do pagamento
  const [profile, setProfile] = useState({
    street: "",
    neighborhood: "",
    city: "",
    phone: "",
    email: "",
  });

  // Carrega dados do usuário logado para exibir endereço e contato
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    setProfile({
      street: user.street || "Rua Exemplo",
      neighborhood: user.neighborhood || "Bairro",
      city: user.city || "Cidade",
      phone: user.telefone || "+55 11 99999-9999",
      email: user.email || "email@exemplo.com",
    });
  }, []);

  const shippingCost = shipping === "express" ? 12 : 0;
  const total = baseTotal + shippingCost;

  // Ao confirmar o pagamento, cria o pedido e redireciona para a tela correspondente
  const handleConfirm = () => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (!user.email) return;

    const pedidoId = Date.now().toString();
    const state = { total, pedidoId, cart };

    // Se for cartão, redireciona para a página de preenchimento
    if (paymentMethod === "credit") {
      navigate("/payment/credit", { state });
      return;
    }

    // Define o status dependendo do método
    const status = paymentMethod === "boleto" ? "Pendente" : "Pago";

    const pedido = {
      id: pedidoId,
      items: cart.map((i) => i.name),
      total,
      metodo: paymentMethod,
      status,
    };

    // Salva o pedido no histórico do usuário
    const existing = JSON.parse(localStorage.getItem(`orders_${user.email}`) || "[]");
    localStorage.setItem(`orders_${user.email}`, JSON.stringify([...existing, pedido]));

    // Salva o registro de pagamento
    localStorage.setItem(`pagamento_${user.email}`, JSON.stringify({
      metodo: paymentMethod,
      total,
      data: new Date().toISOString(),
    }));

    clearCart();

    // Redireciona conforme o método
    if (paymentMethod === "pix") {
      navigate("/payment/pix", { state });
    } else if (paymentMethod === "boleto") {
      navigate("/payment/boleto", { state });
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Pagamento</h1>

      {/* Bloco de endereço e contato */}
      <div className="payment-box">
        <div className="payment-section">
          <strong>Endereço de Entrega</strong>
          <p>{profile.street}, {profile.neighborhood}, {profile.city}</p>
          <button className="edit-btn" onClick={() => navigate("/profile")}>✏️</button>
        </div>

        <div className="payment-section">
          <strong>Contato</strong>
          <p>{profile.phone}</p>
          <p>{profile.email}</p>
          <button className="edit-btn" onClick={() => navigate("/profile")}>✏️</button>
        </div>
      </div>

      {/* Listagem dos produtos */}
      <div className="payment-items">
        <h2>Itens ({cart.length})</h2>
        {cart.map((item: CartItem) => (
          <div key={item.id} className="payment-item">
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <small>x{item.quantity}</small>
            </div>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Opções de entrega */}
      <div className="payment-options">
        <h2>Opções de Entrega</h2>
        <label className={shipping === "standard" ? "selected" : ""}>
          <input
            type="radio"
            name="shipping"
            value="standard"
            checked={shipping === "standard"}
            onChange={() => setShipping("standard")}
          />
          <div>
            <strong>Padrão</strong>
            <p>5-7 dias úteis - <span className="free">Grátis</span></p>
          </div>
        </label>
        <label className={shipping === "express" ? "selected" : ""}>
          <input
            type="radio"
            name="shipping"
            value="express"
            checked={shipping === "express"}
            onChange={() => setShipping("express")}
          />
          <div>
            <strong>Expressa</strong>
            <p>1-2 dias úteis - <span className="price">R$ 12,00</span></p>
          </div>
        </label>
      </div>

      {/* Seleção de forma de pagamento */}
      <div className="payment-methods">
        <h2>Forma de Pagamento</h2>
        <div className="payment-method-select">
          <button
            className={paymentMethod === "pix" ? "active" : ""}
            onClick={() => setPaymentMethod("pix")}
          >
            Pix
          </button>
          <button
            className={paymentMethod === "credit" ? "active" : ""}
            onClick={() => setPaymentMethod("credit")}
          >
            Cartão
          </button>
          <button
            className={paymentMethod === "boleto" ? "active" : ""}
            onClick={() => setPaymentMethod("boleto")}
          >
            Boleto
          </button>
        </div>
      </div>

      {/* Total e botão de pagar */}
      <div className="payment-footer">
        <span>Total: <strong>R$ {total.toFixed(2)}</strong></span>
        <button onClick={handleConfirm}>Pagar</button>
      </div>
    </div>
  );
}
