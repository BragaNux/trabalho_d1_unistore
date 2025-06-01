import "./Cart.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  // Cálculo do total baseado nos itens do carrinho
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [address, setAddress] = useState("Carregando...");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Busca informações do usuário logado
    const loggedUser = JSON.parse(localStorage.getItem("user_logged") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    setUserEmail(loggedUser.email);

    // Recupera endereço completo do perfil
    const user = users.find((u: any) => u.email === loggedUser.email);

    if (user) {
      const street = user.rua || "Rua Exemplo 123";
      const neighborhood = user.bairro || "Bairro";
      const city = user.cidade || "Cidade - UF";
      setAddress(`${street}, ${neighborhood}, ${city}`);
    } else {
      setAddress("Endereço não encontrado");
    }

    // Carrega carrinho salvo anteriormente
    const savedCart = localStorage.getItem(`cart_${loggedUser.email}`);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          // Evento customizado usado no contexto global
          window.dispatchEvent(new CustomEvent("loadUserCart", { detail: parsedCart }));
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Salva carrinho no localStorage sempre que ele for alterado
    if (userEmail) {
      localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
    }
  }, [cart, userEmail]);

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
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-image" />
                <div className="cart-info">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-price">R$ {item.price.toFixed(2)}</p>
                  <div className="cart-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-remove" onClick={() => removeFromCart(item.id)}>
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
