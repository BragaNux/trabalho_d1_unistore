import "./Payment.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart, CartItem } from "../../context/CartContext";
import { useState, useEffect } from "react";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const cart: CartItem[] = location.state?.cart || [];
  const baseTotal: number = location.state?.total || 0;

  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [paymentMethod, setPaymentMethod] = useState("pix");

  const [profile, setProfile] = useState({
    street: "",
    neighborhood: "",
    city: "",
    phone: "",
    email: "",
    id: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    setProfile({
      street: user.street || "Rua Exemplo",
      neighborhood: user.neighborhood || "Bairro",
      city: user.city || "Cidade",
      phone: user.phone || "+55 11 99999-9999",
      email: user.email || "email@exemplo.com",
      id: user.id || "",
    });
  }, []);

  const shippingCost = shipping === "express" ? 12 : 0;
  const total = baseTotal + shippingCost;

  const handleConfirm = async () => {
    if (!profile.id) return alert("Usuário não autenticado.");

    try {
      const response = await fetch("http://localhost:3333/api/orders/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.id,
          paymentMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao finalizar pedido");

      clearCart();

      const state = {
        pedidoId: data.orderId,
        total,
        cart,
      };

      if (paymentMethod === "pix") {
        navigate("/payment/pix", { state });
      } else if (paymentMethod === "boleto") {
        navigate("/payment/boleto", { state });
      } else {
        navigate("/payment/credit", { state });
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert("Erro ao finalizar pedido. Tente novamente.");
    }
  };

  return (
    <div className="payment-container">
      <h1 className="payment-title">Pagamento</h1>

      {/* Endereço e Contato */}
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

      {/* Itens */}
      <div className="payment-items">
        <h2>Itens ({cart.length})</h2>
        {cart.map((item: CartItem) => (
          <div key={item.id} className="payment-item">
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <small>x{item.quantity}</small>
            </div>
            <span>R$ {(item.price_at_time * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Entrega */}
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

      {/* Pagamento */}
      <div className="payment-methods">
        <h2>Forma de Pagamento</h2>
        <div className="payment-method-select">
          <button className={paymentMethod === "pix" ? "active" : ""} onClick={() => setPaymentMethod("pix")}>Pix</button>
          <button className={paymentMethod === "credit" ? "active" : ""} onClick={() => setPaymentMethod("credit")}>Cartão</button>
          <button className={paymentMethod === "boleto" ? "active" : ""} onClick={() => setPaymentMethod("boleto")}>Boleto</button>
        </div>
      </div>

      {/* Rodapé */}
      <div className="payment-footer">
        <span>Total: <strong>R$ {total.toFixed(2)}</strong></span>
        <button onClick={handleConfirm}>Pagar</button>
      </div>
    </div>
  );
}
