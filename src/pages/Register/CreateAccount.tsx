import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";
import { useState, useRef } from "react";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [sexo, setSexo] = useState("");
  const [rua, setRua] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setTelefone(raw);
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone: string) => /^\d{10,11}$/.test(phone);
  const isValidSenha = (senha: string) => senha.length >= 4;
  const isValidCpf = (cpf: string) => /^\d{11}$/.test(cpf);

  const isFormValid = () =>
    nome &&
    isValidEmail(email) &&
    isValidSenha(senha) &&
    isValidPhone(telefone) &&
    isValidCpf(cpf) &&
    sexo &&
    rua &&
    bairro &&
    cidade;

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("name", nome);
    formData.append("email", email);
    formData.append("password", senha);
    formData.append("cpf", cpf);
    formData.append("phone", telefone);
    formData.append("street", rua);
    formData.append("neighborhood", bairro);
    formData.append("city", cidade);
    formData.append("gender", sexo);


    const file = fileInputRef.current?.files?.[0];
    if (file) {
      formData.append("photo", file);
    }

    try {
      await axios.post("http://localhost:3333/api/users/register", formData);
      navigate("/login", { state: { email } });
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

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

        <label className="create-photo">
          {preview ? (
            <img src={preview} alt="Preview" className="photo-preview" />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 45, color: "#aaa" }} />
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            hidden
          />
        </label>

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

        <div className="input-wrapper">
          <input
            type="text"
            className="create-input"
            placeholder="CPF (somente números)"
            value={cpf}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
            onBlur={() => setTouched((t) => ({ ...t, cpf: true }))}
            maxLength={11}
          />
          {touched.cpf && renderStatusIcon(isValidCpf(cpf))}
        </div>
        {touched.cpf && !isValidCpf(cpf) && (
          <p className="error-text">CPF inválido</p>
        )}

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
