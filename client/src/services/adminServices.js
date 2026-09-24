import apiClient from "../api/apiClient";

const ADMIN_PRODUCTS_PATH = "/admin/products";

export const getAllProducts = () => {
  return apiClient.get(ADMIN_PRODUCTS_PATH);
};

export const createProduct = (formData) => {
  return apiClient.post(ADMIN_PRODUCTS_PATH, formData);
};

export const updateProduct = (id, data) => {
  return apiClient.patch(`${ADMIN_PRODUCTS_PATH}/${id}`, data);
};

export const deleteProduct = (id) => {
  return apiClient.delete(`${ADMIN_PRODUCTS_PATH}/${id}`);
};
