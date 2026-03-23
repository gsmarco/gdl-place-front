import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export const getEndPoint = (_api: string) => {
  // let apiUrlBase = "https://gdl-place-backend.onrender.com";
  const apiUrlBase = import.meta.env.VITE_API_URL;
  return apiUrlBase + _api;
};

export const getVars = (ruta: string) => {
  const navigate = useNavigate();
  let vars: authVars = {
    token: "",
    auth: "",
    sellerId: 0,
    sellerName: "",
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
    sellerId: userId,
    sellerName: userName,
    email: email,
    message: mensaje,
  };

  return vars;
};

interface authVars {
  token: string;
  auth: string;
  sellerId: number;
  sellerName: string;
  email: string;
  message: string;
}
