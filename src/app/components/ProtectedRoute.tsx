import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export const ProtectedRoute = ({ children }: any) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/seller/login" replace />;
  }

  try {
    const decoded: {
      exp?: number;
      id?: string;
      email?: string;
    } = jwtDecode(token);

    const now = Math.floor(Date.now() / 1000);
    const expired = decoded.exp ? decoded.exp < now : false;
    if (expired) {
      return <Navigate to="/seller/login" replace />;
    }
  } catch (error) {}

  return children;
};
