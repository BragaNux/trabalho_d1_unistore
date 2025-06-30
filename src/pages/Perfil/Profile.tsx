import { useState, useEffect } from "react";
import "./Profile.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import axios from "axios";

export default function Profile() {
  const [editando, setEditando] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("user_logged");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setUserId(user.id);
        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setStreet(user.street || "");
        setNeighborhood(user.neighborhood || "");
        setCity(user.city || "");
        setPhoto(user.foto || null);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    }
  }, []);

  const handleSave = async () => {
  try {
    const formData = new FormData();
    formData.append("id", String(userId));
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("street", street);
    formData.append("neighborhood", neighborhood);
    formData.append("city", city);

    if (photo?.startsWith("data:image")) {
      const base64 = photo.split(",")[1]; // remove o prefixo
      formData.append("photo", base64);
    } else if (photo) {
      formData.append("photo", photo); // fallback se já for base64 sem prefixo
    }

    const response = await axios.put<{ user: any }>("http://localhost:3333/api/users/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedUser = response.data.user;

    // 🔁 Adiciona prefixo antes de salvar no localStorage
    const fotoComPrefixo = updatedUser.photo
      ? `data:image/png;base64,${updatedUser.photo}`
      : null;

    localStorage.setItem(
      "user_logged",
      JSON.stringify({
        ...updatedUser,
        foto: fotoComPrefixo,
      })
    );

    setEditando(false);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 2500);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    alert("Erro ao atualizar perfil");
  }
};


  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">👤 Meu Perfil</h1>
      <p className="profile-subtitle">Edite seus dados cadastrados abaixo</p>

      <button className="edit-toggle" onClick={() => setEditando(!editando)}>
        {editando ? "❌ Cancelar" : "✏️ Editar Perfil"}
      </button>

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

      <div className="profile-content">
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

        {editando && (
          <button className="save-profile-button" onClick={handleSave}>
            💾 Salvar Alterações
          </button>
        )}
      </div>

      {showSnackbar && <div className="snackbar success">✅ Perfil atualizado com sucesso!</div>}
    </div>
  );
}
