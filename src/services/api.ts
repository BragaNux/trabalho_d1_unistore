// src/services/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3333/api", // Ajuste se for para produção
});

export default api;
