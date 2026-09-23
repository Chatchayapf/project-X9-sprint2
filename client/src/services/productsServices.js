import apiClient from "../api/apiClient";

const PRODUCTS_PATH = "/products";

export const getProducts = (search = "", type = "All type") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (type && type !== "All type") params.append("type", type);
  return apiClient.get(`${PRODUCTS_PATH}?${params.toString()}`);
};

export const getProductById = (id) => {
  return apiClient.get(`${PRODUCTS_PATH}/${id}`);
};
