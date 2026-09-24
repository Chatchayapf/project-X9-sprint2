import apiClient from "../api/apiClient";

const ORDERS_PATH = "/orders";

export const getMyOrders = () => {
  return apiClient.get(ORDERS_PATH);
};

export const getOrderById = (orderId) => {
  return apiClient.get(`${ORDERS_PATH}/${orderId}`);
};

export const cancelOrder = (orderId) => {
  return apiClient.patch(`${ORDERS_PATH}/${orderId}/cancel`);
};

export const getAllOrders = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.order_status) params.set("order_status", filters.order_status);
  if (filters.payment_status) params.set("payment_status", filters.payment_status);
  const query = params.toString();
  return apiClient.get(`${ORDERS_PATH}/admin/all${query ? `?${query}` : ""}`);
};

export const updateOrderStatus = (orderId, order_status) => {
  return apiClient.patch(`${ORDERS_PATH}/${orderId}/status`, { order_status });
};

export const updatePaymentStatus = (orderId, payment_status) => {
  return apiClient.patch(`${ORDERS_PATH}/${orderId}/payment`, { payment_status });
};
