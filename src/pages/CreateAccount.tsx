import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  // Dados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [sexo, setSexo] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  // Campos já visitados para validações visuais
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Carrega imagem local para pré-visualização
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Formata e armazena apenas números do telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setTelefone(raw);
  };

  // Validações básicas
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone: string) => /^\d{10,11}$/.test(phone);
  const isValidSenha = (senha: string) => senha.length >= 4;

  // Validação final do formulário
  const isFormValid = () =>
    nome &&
    isValidEmail(email) &&
    isValidSenha(senha) &&
    isValidPhone(telefone) &&
    sexo &&
    rua &&
    bairro &&
    cidade;

  // Cria usuário e salva no localStorage
  const handleCreate = () => {
    const fotoFinal =
      photo ||
      (sexo === "masculino"
        ? "/default_male.png"
        : sexo === "feminino"
        ? "/default_female.png"
        : "/default_icon.png");

    const novoUsuario = {
      nome,
      email,
      senha,
      telefone,
      rua,
      bairro,
      cidade,
      sexo,
      foto: fotoFinal,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(novoUsuario);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("profile", JSON.stringify(novoUsuario));

    navigate("/login");
  };

  // Ícones de status para validações visuais
  const renderStatusIcon = (valid: boolean) => {
    return valid ? (
      <CheckCircleIcon className="icon-success" />
    ) : (
      <ErrorIcon className="icon-error" />
    );
  };

  return (
    <div className="create-container">
      <div className="create-box">
        <h1 className="create-title">Criar Conta</h1>

        {/* Upload de Foto */}
        <label className="create-photo">
          {photo ? (
            <img src={photo} alt="Preview" className="photo-preview" />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 45, color: "#aaa" }} />
          )}
          <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
        </label>

        {/* Nome */}
        <div className="input-wrapper">
          <input
            type="text"
            className="create-input"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
          />
          {touched.nome && nome && renderStatusIcon(true)}
        </div>

        {/* E-mail */}
        <div className="input-wrapper">
          <input
            type="email"
            className="create-input"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          />
          {touched.email && renderStatusIcon(isValidEmail(email))}
        </div>
        {touched.email && !isValidEmail(email) && (
          <p className="error-text">E-mail inválido</p>
        )}

        {/* Senha */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            className="create-input"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, senha: true }))}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <VisibilityIcon className="mui-eye" />
            ) : (
              <VisibilityOffIcon className="mui-eye" />
            )}
          </span>
        </div>

        {/* Telefone */}
        <div className="input-wrapper">
          <input
            type="tel"
            className="create-input"
            placeholder="DDD + Número"
            value={telefone}
            onChange={handlePhoneChange}
            onBlur={() => setTouched((t) => ({ ...t, telefone: true }))}
            maxLength={11}
          />
          {touched.telefone && renderStatusIcon(isValidPhone(telefone))}
        </div>
        {touched.telefone && !isValidPhone(telefone) && (
          <p className="error-text">Número inválido</p>
        )}

        {/* Sexo */}
        <div className="input-wrapper">
          <select
            className="create-input"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, sexo: true }))}
          >
            <option value="">Selecione o sexo</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
          </select>
        </div>

        {/* Endereço: Rua */}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Rua"
            className="create-input"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, rua: true }))}
          />
          {touched.rua && renderStatusIcon(rua.length > 0)}
        </div>

        {/* Bairro */}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Bairro"
            className="create-input"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, bairro: true }))}
          />
          {touched.bairro && renderStatusIcon(bairro.length > 0)}
        </div>

        {/* Cidade */}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Cidade"
            className="create-input"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, cidade: true }))}
          />
          {touched.cidade && renderStatusIcon(cidade.length > 0)}
        </div>

        {/* Botões */}
        <button
          className="create-button"
          onClick={handleCreate}
          disabled={!isFormValid()}
        >
          Concluir
        </button>

        <button className="create-cancel" onClick={() => navigate("/")}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
