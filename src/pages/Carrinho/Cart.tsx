import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  photo?: string;
};

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("Carregando...");

  useEffect(() => {
    const fetchAddress = async () => {
      const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
      if (!user?.id) {
        setAddress("Usuário não identificado");
        return;
      }

      try {
        const res = await axios.get<User>(`http://localhost:3333/api/users/${user.id}`);
        const userData = res.data;

        if (userData?.street && userData?.neighborhood && userData?.city) {
          setAddress(`${userData.street}, ${userData.neighborhood}, ${userData.city}`);
        } else {
          setAddress("Endereço incompleto");
        }
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
        setAddress("Erro ao carregar endereço");
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.price_at_time * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  return (
    <div className="cart-container">
      <h1 className="cart-title">
        Carrinho <span className="cart-badge">{cart.length}</span>
      </h1>

      {cart.length > 0 && (
        <div className="cart-address">
          <div>
            <strong>Endereço de Entrega</strong>
            <p>{address}</p>
          </div>
          <button className="edit-btn" onClick={() => navigate("/profile")}>✏️</button>
        </div>
      )}

      {cart.length === 0 ? (
        <p className="cart-empty">Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.product_id} className="cart-item">
                <img
                  src={item.image || "/produto.png"}
                  alt={item.name}
                  className="cart-image"
                />
                <div className="cart-info">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-price">
                    R$ {Number(item.price_at_time).toFixed(2)}
                  </p>
                  <div className="cart-controls">
                    <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button
                  className="cart-remove"
                  onClick={() => removeFromCart(item.product_id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <span className="cart-total">Total: R$ {total.toFixed(2)}</span>
            <button
              className="checkout-button"
              onClick={() => navigate("/payment", { state: { cart, total } })}
            >
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
