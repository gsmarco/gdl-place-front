import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export interface authVars {
  token: string;
  auth: string;
  userId: number;
  userName: string;
  email: string;
  message: string;
}

interface token_urlBase_userId {
  token: string;
  urlBase: string;
  userId: number;
}

export const get_token_urlBase_id = () => {
  let vars: token_urlBase_userId = {
    token: "",
    urlBase: "",
    userId: 0,
  };

  var mensaje = "";
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return vars;
    }

    // Para obtener el valor de id:
    const raw = localStorage.getItem("user");
    let userId = 0;

    if (raw) {
      // Convertir el string JSON a objeto
      const user = JSON.parse(raw);
      userId = user.id;
    } else {
      mensaje = "No existe la clave 'user' en localStorage";
      console.log(mensaje);
    }
    vars = {
      token: token!,
      urlBase: import.meta.env.VITE_API_URL,
      userId: userId,
    };

    return vars;
  } catch (error) {
    console.log("Error al obtener token y url base: " + error);
    return vars;
  }
};

export const getEndPoint = (_api: string) => {
  const apiUrlBase = import.meta.env.VITE_API_URL;
  return apiUrlBase + _api;
};

export const getVars = (ruta: string) => {
  const navigate = useNavigate();
  let vars: authVars = {
    token: "",
    auth: "",
    userId: 0,
    userName: "",
    email: "",
    message: "Inicie sesión de vendedor",
  };

  let mensaje = "";
  const token = localStorage.getItem("token");

  if (!token) {
    return vars;
  }

  const auth = "Bearer " + token;

  // Para obtener el valor de id:
  const raw = localStorage.getItem("user");

  let userId = 0;
  let userName = "";
  let email = "";

  if (raw) {
    // Convertir el string JSON a objeto
    const user = JSON.parse(raw);

    userId = user.id;
    email = user.email;
    userName = user.name;
  } else {
    mensaje = "No existe la clave 'user' en localStorage";
    console.log(mensaje);
  }

  vars = {
    token: token,
    auth: auth,
    userId: userId,
    userName: userName,
    email: email,
    message: mensaje,
  };

  return vars;
};

interface TokenData {
  token?: string;
  expired: boolean;
  id?: string;
  email?: string;
}

export const getTokenData = (): TokenData => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No existe el token");
    return { token: "", expired: true };
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
      console.log("Token expirado");
    } else {
      console.log("Token válido");
    }

    return {
      token,
      expired,
      id: decoded.id,
      email: decoded.email,
    };
  } catch (error) {
    console.error("Token inválido", error);
    return { expired: true };
  }
};

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");

  // Verifica que exp exista antes de compararlo
  if (token) {
    const decoded: { exp?: number } = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      console.log("Token expirado");
      return true;
    } else {
      console.log("Token válido o sin fecha de expiración");
      return false;
    }
  }
  console.log("No existe el token");
  return true;
};
