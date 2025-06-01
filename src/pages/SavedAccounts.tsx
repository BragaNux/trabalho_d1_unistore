import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SavedAccounts.css";

// Define o tipo de dados esperado para um usuário
type User = {
  email: string;
  senha: string;
  telefone: string;
  foto?: string;
};

export default function SavedAccounts() {
  // Estado que armazena a lista de usuários salvos
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // Executa ao montar o componente
  useEffect(() => {
    // Recupera os usuários salvos no localStorage
    const data: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    // Verifica se existe um usuário admin padrão (admin/admin)
    const adminExists = data.some(
      (user) => user.email === "admin" && user.senha === "admin"
    );

    // Se não existir, adiciona o usuário admin como conta padrão
    if (!adminExists) {
      const adminAccount: User = {
        email: "admin",
        senha: "admin",
        telefone: "",
        foto: "/admin.png", // imagem padrão
      };
      data.unshift(adminAccount); // adiciona no topo da lista
      localStorage.setItem("users", JSON.stringify(data)); // salva de volta
    }

    // Atualiza o estado com os usuários
    setUsers(data);
  }, []);

  // Redireciona para a tela de login com o email selecionado
  const handleSelect = (email: string) => {
    navigate("/login", { state: { email } });
  };

  return (
    <div className="account-list-container">
      <h1>Selecionar Conta</h1>

      {/* Se não houver usuários cadastrados */}
      {users.length === 0 ? (
        <p>Nenhuma conta encontrada.</p>
      ) : (
        <div className="account-list">
          {/* Renderiza cada conta como um card clicável */}
          {users.map((u, index) => (
            <div
              key={index}
              className="account-card"
              onClick={() => handleSelect(u.email)}
              title={u.email}
            >
              <img
                src={u.foto || "/profile.svg"} // Usa imagem do usuário ou uma padrão
                alt="Foto"
                className="account-photo"
                onError={(e) => {
                  // Se a imagem falhar, usa uma imagem padrão
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
