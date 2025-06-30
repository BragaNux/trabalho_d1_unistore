import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      {/* Código de erro visível na tela */}
      <h1 className="notfound-title">404</h1>

      {/* Mensagem descritiva da falha */}
      <p className="notfound-subtitle">Página não encontrada.</p>

      {/* Link para retornar à página inicial */}
      <Link to="/" className="notfound-button">
        Voltar ao início
      </Link>
    </div>
  );
}
