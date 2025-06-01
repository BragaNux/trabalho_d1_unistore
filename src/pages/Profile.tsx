import { useState, useEffect } from "react";
import "./Profile.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Profile() {
  // Estados para controle da edição e exibição de mensagem de sucesso
  const [editando, setEditando] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Campos do perfil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [card, setCard] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // Carrega os dados do usuário ao abrir a página
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user_logged") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Busca o usuário logado dentro do array de usuários salvos
    const current = users.find((u: any) => u.email === loggedUser.email);

    // Popula os campos se encontrar o usuário
    if (current) {
      setName(current.nome || "");
      setEmail(current.email || "");
      setPhone(current.telefone || "");
      setStreet(current.rua || "");
      setNeighborhood(current.bairro || "");
      setCity(current.cidade || "");
      setCard(current.cartao || "");
      setPhoto(current.foto || null);
    } else {
      // fallback padrão (usuário admin, por exemplo)
      setName("Administrador");
      setEmail("admin");
    }
  }, []);

  // Salva os dados atualizados do perfil
  const handleSave = () => {
    const updated = {
      nome: name,
      email,
      telefone: phone,
      rua: street,
      bairro: neighborhood,
      cidade: city,
      cartao: card,
      foto: photo,
    };

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Atualiza o usuário correspondente no array
    const updatedUsers = users.map((u: any) =>
      u.email === email ? { ...u, ...updated } : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("profile", JSON.stringify(updated)); // extra opcional
    setEditando(false);
    setShowSnackbar(true); // exibe feedback

    // Some o snackbar após 2.5 segundos
    setTimeout(() => setShowSnackbar(false), 2500);
  };

  // Carrega a imagem de perfil escolhida e converte para base64
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">👤 Meu Perfil</h1>
      <p className="profile-subtitle">Edite seus dados cadastrados abaixo</p>

      {/* Botão para alternar entre edição e visualização */}
      <button className="edit-toggle" onClick={() => setEditando(!editando)}>
        {editando ? "❌ Cancelar" : "✏️ Editar Perfil"}
      </button>

      {/* Área da foto de perfil */}
      <div className="profile-photo-wrapper">
        <label className={`photo-editable ${editando ? "active" : ""}`}>
          {photo ? (
            <img src={photo} alt="Foto de perfil" className="photo-preview" />
          ) : (
            <AccountCircleIcon sx={{ fontSize: 60, color: "#aaa" }} />
          )}
          {editando && (
            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
          )}
        </label>
      </div>

      {/* Conteúdo do perfil dividido por seção */}
      <div className="profile-content">
        {/* Seção de dados pessoais */}
        <div className="profile-card">
          <h2 className="card-title">Dados Pessoais</h2>
          <div className="info-row">
            <label className="info-label">Nome:</label>
            <input className="input-edit" value={name} onChange={(e) => setName(e.target.value)} readOnly={!editando} />
          </div>
          <div className="info-row">
            <label className="info-label">E-mail:</label>
            <input className="input-edit" value={email} readOnly />
          </div>
          <div className="info-row">
            <label className="info-label">Telefone:</label>
            <input className="input-edit" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={!editando} />
          </div>
        </div>

        {/* Seção de endereço */}
        <div className="profile-card">
          <h2 className="card-title">Endereço</h2>
          <div className="info-row">
            <label className="info-label">Rua:</label>
            <input className="input-edit" value={street} onChange={(e) => setStreet(e.target.value)} readOnly={!editando} />
          </div>
          <div className="info-row">
            <label className="info-label">Bairro:</label>
            <input className="input-edit" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} readOnly={!editando} />
          </div>
          <div className="info-row">
            <label className="info-label">Cidade:</label>
            <input className="input-edit" value={city} onChange={(e) => setCity(e.target.value)} readOnly={!editando} />
          </div>
        </div>

        {/* Botão de salvar visível apenas se estiver editando */}
        {editando && (
          <button className="save-profile-button" onClick={handleSave}>
            💾 Salvar Alterações
          </button>
        )}
      </div>

      {/* Snackbar de sucesso */}
      {showSnackbar && <div className="snackbar success">✅ Perfil atualizado com sucesso!</div>}
    </div>
  );
}
