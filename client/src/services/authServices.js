import apiClient from "../api/apiClient";

export const login = (credentials) =>
  apiClient.post("/auth/login", credentials);

export const register = (userData) =>
  apiClient.post("/auth/register", userData);

export const logout = () => apiClient.post("/auth/logout");