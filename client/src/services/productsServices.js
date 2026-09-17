import apiClient from "../api/apiClient";

const PRODUCTS_PATH = "/products";

export const getProducts = () => {
  return apiClient.get(PRODUCTS_PATH);
};
