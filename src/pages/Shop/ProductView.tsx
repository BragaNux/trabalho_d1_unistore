import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ProductView.css";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

export default function ProductView() {
  const { id } = useParams(); // ID do produto via rota
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [showMessage, setShowMessage] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`http://localhost:3333/api/products/${id}`);
        setProduct(response.data as Product);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        setProduct(null);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum, item) => sum + item.quantity * item.price_at_time, 0);

  const handleAdd = () => {
    if (!product) return;

    addToCart(product);
    setShowMessage(true);

    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (user?.email) {
      const existingCart = JSON.parse(localStorage.getItem(`cart_${user.email}`) || "[]");
      const itemIndex = existingCart.findIndex((item: any) => item.id === product.id);

      if (itemIndex >= 0) {
        existingCart[itemIndex].quantity += 1;
      } else {
        existingCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem(`cart_${user.email}`, JSON.stringify(existingCart));
    }

    setTimeout(() => setShowMessage(false), 2000);
  };

  if (!product) {
    return <p className="product-not-found">Produto não encontrado.</p>;
  }

  return (
    <div className="product-container">
      <div className="product-image-section">
        <img src={product.image} alt={product.name} className="product-detail-image" />
      </div>

      <div className="product-info-section">
        <h2 className="product-detail-name">{product.name}</h2>
        <p className="product-detail-description">{product.description}</p>
        <p className="product-detail-price">R$ {Number(product.price).toFixed(2)}</p>

        <div className="product-actions">
          <button onClick={handleAdd} className="product-button">
            🛒 Adicionar ao Carrinho
          </button>
          <button className="product-back" onClick={() => navigate("/shop")}>
            ← Voltar para loja
          </button>
        </div>
      </div>

      {showMessage && (
        <div className="snackbar success">Produto adicionado ao carrinho!</div>
      )}

      {cart.length > 0 && (
        <div className="cart-preview">
          <p>{totalItems} item(s) no carrinho • Total: R$ {totalValue.toFixed(2)}</p>
          <button onClick={() => navigate("/cart")}>Finalizar Compra</button>
        </div>
      )}
    </div>
  );
}
