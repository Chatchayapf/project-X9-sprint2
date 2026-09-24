import apiClient from "../api/apiClient";

const CART_PATH = "/cart";

export const getCart = () => {
  return apiClient.get(CART_PATH);
};

export const addItemToCart = (productId, quantity = 1) => {
  return apiClient.post(`${CART_PATH}/items`, {
    product_id: productId,
    product_quantity: quantity,
  });
};

export const updateCartItem = (productId, action) => {
  return apiClient.patch(`${CART_PATH}/items/${productId}`, { action });
};

export const removeCartItem = (productId) => {
  return apiClient.delete(`${CART_PATH}/items/${productId}`);
};
