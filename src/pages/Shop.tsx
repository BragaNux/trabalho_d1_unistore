import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./Shop.css";

// Imagens importadas
import caneca from "../assets/images/products/caneca.jpg";
import caderno from "../assets/images/products/caderno.jpg";
import livro from "../assets/images/products/livro.jpg";
import pendrive from "../assets/images/products/pendrive.jpg";
import mochila from "../assets/images/products/mochila.jpg";
import calculadora from "../assets/images/products/calculadora.jpg";
import marcatexto from "../assets/images/products/marcatexto.jpg";
import fone from "../assets/images/products/fone.jpg";
import bloco from "../assets/images/products/bloco.png";
import agenda from "../assets/images/products/agenda.jpg";
import camisa from "../assets/images/products/camisa.png";
import oculos from "../assets/images/products/oculos.png";
import estojo from "../assets/images/products/estojo.png";
import garrafa from "../assets/images/products/garrafa.png";
import luminaria from "../assets/images/products/luminaria.jpg";
import tripe from "../assets/images/products/tripe.jpg";
import adaptador from "../assets/images/products/adaptador.png";
import mouse from "../assets/images/products/mouse.png";
import teclado from "../assets/images/products/teclado.png";
import lousa from "../assets/images/products/lousa.jpg";
import fichario from "../assets/images/products/fichario.png";
import relogio from "../assets/images/products/relogio.png";
import adesivos from "../assets/images/products/adesivos.png";
import base from "../assets/images/products/base.jpg";

const products = [
  { id: 1, name: "Caneca Universitária", price: 29.9, image: caneca },
  { id: 2, name: "Caderno Inteligente", price: 49.9, image: caderno },
  { id: 3, name: "Livro de Algoritmos", price: 79.9, image: livro },
  { id: 4, name: "Pen Drive 64GB", price: 59.9, image: pendrive },
  { id: 5, name: "Mochila Acadêmica", price: 149.9, image: mochila },
  { id: 6, name: "Calculadora Científica", price: 89.9, image: calculadora },
  { id: 7, name: "Kit Marca Texto", price: 19.9, image: marcatexto },
  { id: 8, name: "Fone Bluetooth", price: 99.9, image: fone },
  { id: 9, name: "Bloco de Anotações", price: 14.9, image: bloco },
  { id: 10, name: "Agenda 2025", price: 34.9, image: agenda },
  { id: 11, name: "Camiseta UniStore", price: 54.9, image: camisa },
  { id: 12, name: "Óculos de Leitura", price: 69.9, image: oculos },
  { id: 13, name: "Estojo Minimalista", price: 24.9, image: estojo },
  { id: 14, name: "Garrafa Térmica 500ml", price: 59.9, image: garrafa },
  { id: 15, name: "Luminária de Mesa", price: 79.9, image: luminaria },
  { id: 16, name: "Tripé com Suporte Celular", price: 89.9, image: tripe },
  { id: 17, name: "Adaptador USB-C", price: 39.9, image: adaptador },
  { id: 18, name: "Mouse Sem Fio", price: 69.9, image: mouse },
  { id: 19, name: "Teclado Compacto", price: 119.9, image: teclado },
  { id: 20, name: "Lousa Portátil", price: 44.9, image: lousa },
  { id: 21, name: "Fichário Estudantil", price: 74.9, image: fichario },
  { id: 22, name: "Relógio Digital", price: 99.9, image: relogio },
  { id: 23, name: "Adesivos Motivacionais", price: 9.9, image: adesivos },
  { id: 24, name: "Base para Notebook", price: 109.9, image: base },
];

export default function Shop() {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [showMessage, setShowMessage] = useState(false);

  // Adiciona um produto ao carrinho e salva no localStorage
  const handleAdd = (product: any) => {
    addToCart(product);
    setShowMessage(true);

    // Verifica se há usuário logado
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

    // Feedback temporário
    setTimeout(() => setShowMessage(false), 2000);
  };

  // Calcula total de itens e valor do carrinho
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Redireciona para a página do produto
  const goToProduct = (id: number) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1 className="shop-title">🎓 Produtos Acadêmicos</h1>
        <p className="shop-subtitle">Tudo que você precisa para a rotina universitária.</p>
      </div>

      {/* Grade de produtos */}
      <div className="product-grid">
        {products.map((item) => (
          <div
            key={item.id}
            className="product-card"
            onClick={() => goToProduct(item.id)}
          >
            <img src={item.image} alt={item.name} className="product-image" />
            <h2 className="product-name">{item.name}</h2>
            <p className="product-price">R$ {item.price.toFixed(2)}</p>
            <button
              className="view-button"
              onClick={(e) => {
                e.stopPropagation(); // Impede o clique no card
                handleAdd(item);
              }}
            >
              🛒 Adicionar
            </button>
          </div>
        ))}
      </div>

      {/* Feedback visual ao adicionar item */}
      {showMessage && (
        <div className="snackbar success">
          Produto adicionado ao carrinho!
        </div>
      )}

      {/* Visualização rápida do carrinho */}
      {cart.length > 0 && (
        <div className="cart-preview">
          <p>{totalItems} item(s) no carrinho • Total: R$ {totalValue.toFixed(2)}</p>
          <button onClick={() => navigate("/cart")}>Finalizar Compra</button>
        </div>
      )}
    </div>
  );
}