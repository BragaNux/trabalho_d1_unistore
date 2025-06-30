import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import axios from "axios";
import "./Shop.css";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [showMessage, setShowMessage] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // 🔄 Buscar produtos da API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get<Product[]>("http://localhost:3333/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    }
    fetchProducts();
  }, []);

  const handleAdd = async (product: Product) => {
    await addToCart(product);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum, item) => sum + item.quantity * item.price_at_time, 0);
  const goToProduct = (id: number) => navigate(`/product/${id}`);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">🎓 Produtos Acadêmicos</h1>
        <p className="shop-subtitle">Tudo que você precisa para a rotina universitária.</p>
      </div>

      <div className="product-grid">
        {products.map((item) => (
          <div
            key={item.id}
            className="product-card"
            onClick={() => goToProduct(item.id)}
          >
            <img src={item.image} alt={item.name} className="product-image" />
            <h2 className="product-name">{item.name}</h2>
            <p className="product-price">R$ {Number(item.price).toFixed(2)}</p>
            <button
              className="view-button"
              onClick={(e) => {
                e.stopPropagation();
                handleAdd(item);
              }}
            >
              🛒 Adicionar
            </button>
          </div>
        ))}
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
