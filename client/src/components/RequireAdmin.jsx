import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext/AuthContext";
import Forbidden from "./Forbidden";

const RequireAdmin = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Forbidden />;
  }

  return <Outlet />;
};

export default RequireAdmin;
