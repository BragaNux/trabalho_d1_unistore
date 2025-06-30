import api from "./api";

export const checkout = async (userId: string, paymentMethod: string) => {
  return api.post("/orders/checkout", { userId, paymentMethod });
};

export const getOrders = async (userId: string) => {
  const res = await api.get(`/orders/${userId}`);
  return res.data;
};

export const getOrderDetails = async (orderId: string) => {
  const res = await api.get(`/orders/details/${orderId}`);
  return res.data;
};
