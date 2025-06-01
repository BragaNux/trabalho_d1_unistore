import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  // Estados para exibir dados do usuário logado
  const [name, setName] = useState("Usuário");
  const [email, setEmail] = useState("email@email.com");
  const [foto, setFoto] = useState("/profile.svg");

  // Carrega os dados do usuário logado assim que a tela inicia
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user_logged") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const usuarioCompleto = users.find((u: any) => u.email === loggedUser.email);

    // Atualiza os estados com os dados reais do usuário, se existirem
    if (usuarioCompleto) {
      setName(usuarioCompleto.nome || "Usuário");
      setEmail(usuarioCompleto.email || "email@email.com");
      setFoto(usuarioCompleto.foto || "/profile.svg");
    } else {
      // Se for um admin ou usuário não cadastrado
      setName("Administrador");
      setEmail("admin");
      setFoto("/admin.png");
    }
  }, []);

  // Atalhos principais com ícones e rotas
  const atalhoRapido = [
    { emoji: "🧾", label: "A pagar", path: "/orders" },
    { emoji: "📦", label: "A receber", path: "/orders" },
    { emoji: "⭐", label: "A avaliar", path: "/orders" },
    { emoji: "🛒", label: "Carrinho", path: "/cart" },
  ];

  // Opções relacionadas à conta do usuário
  const opcoesConta = [
    { emoji: "🏪", label: "Ir para loja", path: "/shop" },
    { emoji: "🛍️", label: "Minhas Compras", path: "/orders" },
    { emoji: "🧑‍💼", label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="home-container">
      {/* Cabeçalho com informações do usuário */}
      <div className="home-header">
        <img src={foto} alt="Foto de perfil" className="home-photo" />
        <h2 className="home-name">Olá, {name}!</h2>
        <p className="home-email">{email}</p>
      </div>

      {/* Seção de atalhos rápidos */}
      <div className="section-title">Resumo rápido</div>
      <div className="home-options">
        {atalhoRapido.map((item, index) => (
          <div key={index} className="option-card" onClick={() => navigate(item.path)}>
            <div className="option-icon">{item.emoji}</div>
            <p>{item.label}</p>
          </div>
        ))}
      </div>

      {/* Seção de links relacionados à conta */}
      <div className="section-title">Minha conta</div>
      <div className="home-links">
        {opcoesConta.map((item, index) => (
          <button key={index} className="home-link-button" onClick={() => navigate(item.path)}>
            <span className="link-icon">{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Botão para sair da conta */}
      <button className="home-button logout" onClick={() => navigate("/")}>
        Sair
      </button>
    </div>
  );
}
