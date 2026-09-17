import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage =
      error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(errorMessage));
  },
);

export default apiClient;
