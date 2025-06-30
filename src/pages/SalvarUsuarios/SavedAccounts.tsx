import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SavedAccounts.css";

type User = {
  email: string;
  telefone: string;
  foto?: string; // base64 ou URL
};

export default function SavedAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/all");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Se não houver admin, adiciona manualmente para manter compatibilidade
          const adminExists = data.some(u => u.email === "admin");
          if (!adminExists) {
            data.unshift({
              email: "admin",
              telefone: "",
              foto: "/admin.png",
            });
          }
          setUsers(data);
        }
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSelect = (email: string) => {
    navigate("/login", { state: { email } });
  };

  return (
    <div className="account-list-container">
      <h1>Selecionar Conta</h1>

      {users.length === 0 ? (
        <p>Nenhuma conta encontrada.</p>
      ) : (
        <div className="account-list">
          {users.map((u, index) => (
            <div
              key={index}
              className="account-card"
              onClick={() => handleSelect(u.email)}
              title={u.email}
            >
              <img
                src={
                  u.foto?.startsWith("data:image")
                    ? u.foto
                    : u.foto || "/profile.svg"
                }
                alt="Foto"
                className="account-photo"
                onError={(e) => {
                  e.currentTarget.src = "/profile.svg";
                }}
              />
              <p className="account-email">{u.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
