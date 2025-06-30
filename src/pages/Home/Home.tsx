import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [name, setName] = useState("Usuário");
  const [email, setEmail] = useState("email@email.com");
  const [foto, setFoto] = useState("/profile.svg");

  useEffect(() => {
  const loadUser = () => {
    const raw = localStorage.getItem("user_logged");
    if (!raw) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(raw);
      setName(user.name || "Usuário");
      setEmail(user.email || "email@email.com");
      setFoto(user.foto || "/profile.svg");
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      navigate("/login");
    }
  };

  loadUser();

  const handleFocus = () => loadUser();
  window.addEventListener("focus", handleFocus);

  return () => window.removeEventListener("focus", handleFocus);
}, []);


  const atalhoRapido = [
    { emoji: "🧾", label: "A pagar", path: "/orders" },
    { emoji: "📦", label: "A receber", path: "/orders" },
    { emoji: "⭐", label: "A avaliar", path: "/orders" },
    { emoji: "🛒", label: "Carrinho", path: "/cart" },
  ];

  const opcoesConta = [
    { emoji: "🏪", label: "Ir para loja", path: "/shop" },
    { emoji: "🛍️", label: "Minhas Compras", path: "/orders" },
    { emoji: "🧑‍💼", label: "Perfil", path: "/profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user_logged");
    navigate("/");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <img src={foto} alt="Foto de perfil" className="home-photo" />
        <h2 className="home-name">Olá, {name}!</h2>
        <p className="home-email">{email}</p>
      </div>

      <div className="section-title">Resumo rápido</div>
      <div className="home-options">
        {atalhoRapido.map((item, index) => (
          <div key={index} className="option-card" onClick={() => navigate(item.path)}>
            <div className="option-icon">{item.emoji}</div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      <div className="section-title">Minha conta</div>
      <div className="home-links">
        {opcoesConta.map((item, index) => (
          <button key={index} className="home-link-button" onClick={() => navigate(item.path)}>
            <span className="link-icon">{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>

      <button className="home-button logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
