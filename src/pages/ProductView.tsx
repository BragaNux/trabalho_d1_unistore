import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./ProductView.css";

// Mesmos produtos usados em Shop.tsx
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
  { id: 1, name: "Caneca Universitária", price: 29.9, image: caneca, description: "Caneca personalizada para estudantes." },
  { id: 2, name: "Caderno Inteligente", price: 49.9, image: caderno, description: "Caderno removível e reutilizável." },
  { id: 3, name: "Livro de Algoritmos", price: 79.9, image: livro, description: "Livro essencial para quem estuda lógica." },
  { id: 4, name: "Pen Drive 64GB", price: 59.9, image: pendrive, description: "Armazene todos seus arquivos com segurança." },
  { id: 5, name: "Mochila Acadêmica", price: 149.9, image: mochila, description: "Confortável e ideal para o dia a dia." },
  { id: 6, name: "Calculadora Científica", price: 89.9, image: calculadora, description: "Funções completas para cálculos avançados." },
  { id: 7, name: "Kit Marca Texto", price: 19.9, image: marcatexto, description: "Destaque seus estudos com estilo." },
  { id: 8, name: "Fone Bluetooth", price: 99.9, image: fone, description: "Perfeito para estudar ouvindo música." },
  { id: 9, name: "Bloco de Anotações", price: 14.9, image: bloco, description: "Anote ideias e lembretes rapidamente." },
  { id: 10, name: "Agenda 2025", price: 34.9, image: agenda, description: "Organize seu ano acadêmico com eficiência." },
  { id: 11, name: "Camiseta UniStore", price: 54.9, image: camisa, description: "Vista a camisa do conhecimento." },
  { id: 12, name: "Óculos de Leitura", price: 69.9, image: oculos, description: "Conforto visual para longas leituras." },
  { id: 13, name: "Estojo Minimalista", price: 24.9, image: estojo, description: "Design limpo para seus materiais." },
  { id: 14, name: "Garrafa Térmica 500ml", price: 59.9, image: garrafa, description: "Beba água ou café na temperatura certa." },
  { id: 15, name: "Luminária de Mesa", price: 79.9, image: luminaria, description: "Iluminação ideal para estudos noturnos." },
  { id: 16, name: "Tripé com Suporte Celular", price: 89.9, image: tripe, description: "Grave vídeos ou assista aulas com estabilidade." },
  { id: 17, name: "Adaptador USB-C", price: 39.9, image: adaptador, description: "Compatível com seus dispositivos modernos." },
  { id: 18, name: "Mouse Sem Fio", price: 69.9, image: mouse, description: "Precisão e conforto para suas tarefas." },
  { id: 19, name: "Teclado Compacto", price: 119.9, image: teclado, description: "Economia de espaço com estilo." },
  { id: 20, name: "Lousa Portátil", price: 44.9, image: lousa, description: "Ideal para revisões rápidas." },
  { id: 21, name: "Fichário Estudantil", price: 74.9, image: fichario, description: "Organização sem complicações." },
  { id: 22, name: "Relógio Digital", price: 99.9, image: relogio, description: "Pontualidade nos seus compromissos." },
  { id: 23, name: "Adesivos Motivacionais", price: 9.9, image: adesivos, description: "Inspire-se enquanto estuda." },
  { id: 24, name: "Base de Apoio para Notebook", price: 109.9, image: base, description: "Ergonomia para longas horas de uso." },
];

export default function ProductView() {
  const { id } = useParams(); // Pegando ID do produto via URL
  const navigate = useNavigate(); // Navegação programática
  const { addToCart, cart } = useCart(); // Hook de contexto do carrinho
  const [showMessage, setShowMessage] = useState(false); // Controle da snackbar

  const product = products.find((p) => p.id === Number(id)); // Localiza o produto pelo ID

  // Totais do carrinho para exibir preview
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Lógica ao clicar em "Adicionar ao Carrinho"
  const handleAdd = () => {
    if (!product) return;

    addToCart(product); // Atualiza o carrinho global
    setShowMessage(true); // Exibe feedback visual

    const user = JSON.parse(localStorage.getItem("user_logged") || "{}");
    if (user?.email) {
      const existingCart = JSON.parse(localStorage.getItem(`cart_${user.email}`) || "[]");
      const itemIndex = existingCart.findIndex((item: any) => item.id === product.id);

      // Atualiza a quantidade no carrinho persistido localmente
      if (itemIndex >= 0) {
        existingCart[itemIndex].quantity += 1;
      } else {
        existingCart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem(`cart_${user.email}`, JSON.stringify(existingCart));
    }

    // Some a snackbar após 2 segundos
    setTimeout(() => setShowMessage(false), 2000);
  };

  // Produto não encontrado
  if (!product) {
    return <p className="product-not-found">Produto não encontrado.</p>;
  }

  return (
    <div className="product-container">
      {/* Imagem do produto */}
      <div className="product-image-section">
        <img src={product.image} alt={product.name} className="product-detail-image" />
      </div>

      {/* Informações e ações do produto */}
      <div className="product-info-section">
        <h2 className="product-detail-name">{product.name}</h2>
        <p className="product-detail-description">{product.description}</p>
        <p className="product-detail-price">R$ {product.price.toFixed(2)}</p>

        <div className="product-actions">
          <button onClick={handleAdd} className="product-button">
            🛒 Adicionar ao Carrinho
          </button>
          <button className="product-back" onClick={() => navigate("/shop")}>
            ← Voltar para loja
          </button>
        </div>
      </div>

      {/* Feedback visual de adição ao carrinho */}
      {showMessage && (
        <div className="snackbar success">
          Produto adicionado ao carrinho!
        </div>
      )}

      {/* Preview do carrinho no rodapé da página */}
      {cart.length > 0 && (
        <div className="cart-preview">
          <p>{totalItems} item(s) no carrinho • Total: R$ {totalValue.toFixed(2)}</p>
          <button onClick={() => navigate("/cart")}>Finalizar Compra</button>
        </div>
      )}
    </div>
  );
}
