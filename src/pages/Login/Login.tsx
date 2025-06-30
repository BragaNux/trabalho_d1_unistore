import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { login } from "../../services/auth";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erro, setErro] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleLogin = async () => {
    try {
      const res = await login(email, senha) as { token: string; user: any };
      const { token, user } = res;

      // Salva token e dados do usuário autenticado
      localStorage.setItem("token", token);
      localStorage.setItem("user_logged", JSON.stringify(user));

      // Redireciona para tela principal
      navigate("/home");
      window.location.reload();
    } catch (err) {
      setErro(true);
      setTimeout(() => setErro(false), 3000);
    }
  };

  const limparStorage = () => {
    localStorage.clear();
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img
          src="/logo_unistore.png"
          alt="Carrinho Shoppe"
          className="login-image"
        />
        <p className="login-subtitle">Entre com sua conta institucional</p>

        <input
          type="email"
          placeholder="E-mail"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="login-password-wrapper">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            className="login-input"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <span className="login-toggle" onClick={() => setMostrarSenha(!mostrarSenha)}>
            <img
              src={mostrarSenha ? "/visibility_on.svg" : "/visibility_off.svg"}
              alt="Mostrar senha"
              className="eye-icon"
            />
          </span>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Entrar
        </button>

        <p className="login-footer">
          Não possui conta?{" "}
          <span className="login-link" onClick={() => navigate("/create-account")}>
            Criar agora
          </span>
        </p>

        <button className="login-cancel" onClick={() => navigate("/")}>
          Voltar
        </button>

        <button className="login-clear" onClick={limparStorage}>
          Limpar LocalStorage
        </button>

        <button className="login-saved" onClick={() => navigate("/saved-accounts")}>
          📄 Ver Contas Salvas
        </button>
      </div>

      {erro && (
        <div className="snackbar snackbar-error">E-mail ou senha inválidos!</div>
      )}

      {sucesso && (
        <div className="snackbar snackbar-success">
          LocalStorage limpo com sucesso!
        </div>
      )}
    </div>
  );
}
