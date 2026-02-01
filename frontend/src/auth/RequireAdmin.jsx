import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAdmin() {
  const { user } = useAuth();
  return user?.role === "ADMIN" ? <Outlet /> : <Navigate to="/user" />;
}
