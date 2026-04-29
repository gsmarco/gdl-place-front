import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getTokenData } from "./global";
import { useBuyerAuth } from "../contexts/BuyerAuthContext";

export const useVerificaToken = () => {
  const navigate = useNavigate();
  const { logout } = useBuyerAuth();
  const { token, expired, id, email } = getTokenData();

  useEffect(() => {
    if (!token || expired) {
      alert("Token inválido, inicie sesión de nuevo");
      logout();
      // navigate("/buyer/login");
      navigate("/");
      return;
    }
  }, []);
  // }, [token, expired, navigate, logout]);

  return { token, expired, userId: id ?? "", email };
};

// import { useNavigate } from "react-router";
// import { getTokenData } from "./global";
// import { useBuyerAuth } from "../contexts/BuyerAuthContext";

// export const useVerificaToken = () => {
//   const navigate = useNavigate();
//   const { logout } = useBuyerAuth();
//   const { token, expired, id, email } = getTokenData();

//   if (!token || expired) {
//     alert("Token inválido, inicie sesión de nuevo");
//     logout();
//     navigate("/");
//     return { token: "", expired: true, userId: "", email: "" };
//   }

//   return { token, expired, userId: id!, email };
// };

// import { useNavigate } from "react-router";
// import { getTokenData } from "./global";
// import { useBuyerAuth } from "../contexts/BuyerAuthContext";

// interface TokenData {
//   token?: string;
//   expired: boolean;
//   userId: string;
//   email?: string;
// }

// export const verificaToken = (ruta: string = ""): TokenData => {
//   const navigate = useNavigate();
//   const { user, isAuthenticated, logout } = useBuyerAuth();
//   const { token, expired, id, email } = getTokenData();
//   if (token) {
//     if (expired) {
//       alert("token invalido, inicie sesión de nuevo");
//       logout();
//       navigate("/buyer/login");
//       return { token: "", expired: true, userId: "", email: "" };
//     }
//     return { token, expired, userId: id!, email };
//   }

//   alert("Inicie sesión");
//   logout();
//   navigate("/buyer/login");
//   return { token: "", expired: true, userId: "", email: "" };
// };
