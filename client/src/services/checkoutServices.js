import apiClient from "../api/apiClient";

const CHECKOUT_PATH = "/checkout";

export const checkoutCart = () => {
  return apiClient.post(CHECKOUT_PATH);
};

export const checkoutCustomItem = (customProductId) => {
  return apiClient.post(`${CHECKOUT_PATH}/custom`, {
    custom_product_id: customProductId,
  });
};
