import apiClient from "../api/apiClient";

const CUSTOM_ORDER_PATH = "/custom-order";

export const createCustomOrder = (customOrderData) => {
  return apiClient.post(CUSTOM_ORDER_PATH, customOrderData);
};

export const getMyCustomOrders = () => {
  return apiClient.get(CUSTOM_ORDER_PATH);
};

export const getCustomOrderById = (id) => {
  return apiClient.get(`${CUSTOM_ORDER_PATH}/${id}`);
};

export const updateCustomOrder = (id, updates) => {
  return apiClient.patch(`${CUSTOM_ORDER_PATH}/${id}`, updates);
};

export const cancelCustomOrder = (id) => {
  return apiClient.delete(`${CUSTOM_ORDER_PATH}/${id}`);
};

export const getAllCustomOrders = (status = "") => {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return apiClient.get(`${CUSTOM_ORDER_PATH}/admin/all${query}`);
};

export const approveCustomOrder = (id, price) => {
  return apiClient.patch(`${CUSTOM_ORDER_PATH}/${id}/approve`, { price });
};

export const rejectCustomOrder = (id) => {
  return apiClient.patch(`${CUSTOM_ORDER_PATH}/${id}/reject`);
};
