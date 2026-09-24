import apiClient from "../api/apiClient";

const AUTH_PATH = "/auth";

export const register = (userData) => {
  return apiClient.post(`${AUTH_PATH}/register`, userData);
};

export const login = (credentials) => {
  return apiClient.post(`${AUTH_PATH}/login`, credentials);
};

export const logout = () => {
  return apiClient.post(`${AUTH_PATH}/logout`);
};
