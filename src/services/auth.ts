import api from "./api";

// Definindo a estrutura da resposta esperada do backend
type UserData = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  gender?: string;
  foto?: string;
};

type LoginResponse = {
  user: UserData;
  token: string;
};

// Função de login
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/users/login", { email, password });

  if (res.data.user) {
    localStorage.setItem("user_logged", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const updateUser = async (id: number, dados: FormData) => {
  const token = localStorage.getItem("token");

  const res = await api.put(`/users/${id}`, dados, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


// Função de registro
export const register = async (dados: {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone?: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  gender?: string;
  photo?: string;
}) => {
  const res = await api.post("/users/register", dados);
  return res.data;
};
