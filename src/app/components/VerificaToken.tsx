import { useNavigate } from "react-router";
import { getTokenData } from "./global";
import { useBuyerAuth } from "../contexts/BuyerAuthContext";

interface TokenData {
  token?: string;
  expired: boolean;
  userId: string;
  email?: string;
}

export const verificaToken = (): TokenData => {
  const { token, expired, id, email } = getTokenData();
  if (expired) {
    alert("token invalido, es necesario iniciar sesión de nuevo");
    const { user, isAuthenticated, logout } = useBuyerAuth();
    logout();
    const navigate = useNavigate();
    navigate("/");

    return { token: "", expired: true, userId: "", email: "" };
  }
  return { token, expired, userId: id!, email };
};
