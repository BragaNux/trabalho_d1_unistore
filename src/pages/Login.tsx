import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Estados do formulário de login
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estados de feedback visual
  const [erro, setErro] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // Se o usuário veio de outra tela com e-mail preenchido, já preenche o campo
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleLogin = () => {
    const usuarios = JSON.parse(localStorage.getItem("users") || "[]");

    // Procura usuário com e-mail e senha correspondentes
    const existeUsuario = usuarios.find(
      (u: any) => u.email === email && u.senha === senha
    );

    // Se existir ou for o admin padrão
    if (existeUsuario || (email === "admin" && senha === "admin")) {
      const userData = existeUsuario
        ? {
            nome: existeUsuario.nome,
            email: existeUsuario.email,
            telefone: existeUsuario.telefone,
            street: existeUsuario.rua,
            neighborhood: existeUsuario.bairro,
            city: existeUsuario.cidade,
          }
        : {
            email: "admin",
            nome: "Administrador",
            telefone: "+55 11 99999-9999",
            street: "Rua Admin",
            neighborhood: "Centro",
            city: "Adminópolis",
          };

      // Salva os dados do usuário logado no localStorage
      localStorage.setItem("user_logged", JSON.stringify(userData));

      // Recarrega carrinho salvo vinculado ao e-mail do usuário
      const userCart = JSON.parse(localStorage.getItem(`cart_${userData.email}`) || "[]");
      window.dispatchEvent(new CustomEvent("loadUserCart", { detail: userCart }));

      // Redireciona para a tela principal e força atualização
      navigate("/home");
      window.location.reload();
    } else {
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

        {/* Ações extras */}
        <button className="login-cancel" onClick={() => navigate("/")}>
          Voltar
        </button>

        <button className="login-clear" onClick={limparStorage}>
          Limpar LocalStorage
        </button>

        <button
          className="login-saved"
          onClick={() => navigate("/saved-accounts")}
        >
          📄 Ver Contas Salvas
        </button>
      </div>

      {/* Feedback visual */}
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
