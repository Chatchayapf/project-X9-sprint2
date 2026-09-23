import apiClient from "../api/apiClient";

const USERS_PATH = "/users/me";

export const getProfile = () => {
  return apiClient.get(USERS_PATH);
};

export const updateUserProfile = (userData) => {
  return apiClient.patch(USERS_PATH, userData);
};
