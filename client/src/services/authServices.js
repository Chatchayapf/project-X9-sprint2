import apiClient from "../api/apiClient";

<<<<<<< HEAD
export const login = (credentials) =>
  apiClient.post("/auth/login", credentials);

export const register = (userData) =>
  apiClient.post("/auth/register", userData);

export const logout = () => apiClient.post("/auth/logout");
=======
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
>>>>>>> main
