import api from "./api";

export const getCart = async (userId: string) => {
  const res = await api.get(`/cart/${userId}`);
  return res.data;
};

export const addToCart = async (payload: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  return api.post("/cart/add", payload);
};
