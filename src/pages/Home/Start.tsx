import { useNavigate } from 'react-router-dom';
import "./Start.css";

export default function Start() {
  // Hook do React Router para navegação entre rotas
  const navigate = useNavigate();

  // Função que redireciona o usuário para a tela de login
  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className="start-container">
      {/* Logo principal da loja */}
      <img
        src="/logo_unistore.png"
        alt="Carrinho Shoppe"
        className="start-image"
      />

      {/* Subtítulo com propósito da loja */}
      <p className="start-subtitle">Sua loja acadêmica favorita</p>

      {/* Botão que leva o usuário à tela de login */}
      <button className="start-button" onClick={handleStart}>
        Realizar Acesso
      </button>

      {/* Rodapé com crédito de autoria */}
      <p className="start-footer">Desenvolvido por Brayan</p>
    </div>
  );
}
