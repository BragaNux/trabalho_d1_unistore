import api from "./api";

export const fetchProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const fetchProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};
