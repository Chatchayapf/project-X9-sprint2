import { useEffect, useState } from "react";
import {
  login as authLogin,
  logout as authLogout,
} from "../../services/authServices";
import { getUserProfile } from "../../services/userServices";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ Children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth;
  }, []);

  const login = async (credentials) => {
    const res = await authLogin(credentials);
    const profileRes = await getUserProfile();
    setUser(profileRes.data);
    return res;
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  return (
    <AuthContext value={{ user, setUser, loading, login, logout }}>
      {!loading && Children}
    </AuthContext>
  );
};