import api from "./api";

export const getTracking = async (orderId: string) => {
  const res = await api.get(`/tracking/${orderId}`);
  return res.data;
};
