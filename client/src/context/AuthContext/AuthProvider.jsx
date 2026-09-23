import { useState } from "react";
import { AuthContext } from "./AuthContext";
import * as authService from "../../services/authServices";

const STORAGE_KEY = "auth_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleAuthSuccess = (data) => {
    setUser(data.user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
    return data.user;
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    return handleAuthSuccess(data);
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    return handleAuthSuccess(data);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};