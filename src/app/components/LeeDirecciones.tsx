import { useState, useEffect } from "react";
import { getEndPoint, getVars } from "../components/global";

export interface Address {
  id: string;
  id_user?: string;
  tipo: "Casa" | "Trabajo" | "Otro";
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  isdefault: boolean;
}

var data: Address[];

export function useDirecciones() {
  const [mockAddresses, setmockAddresses] = useState<Address[]>([]);
  const Variables = getVars("/");
  // Definimos la función fuera del useEffect
  const fetchDirecciones = async () => {
    try {
      const apiUrl = getEndPoint("/api/addressByUser/") + Variables.userId;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Variables.token}`,
        },
      });

      data = await response.json();
      setmockAddresses(data);
      console.log("Direcciones cargadas:", data);
    } catch (error) {
      console.error("*** ERROR AL CARGAR LAS DIRECCIONES ***", error);
    }
  };

  useEffect(() => {
    fetchDirecciones();
  }, [Variables.userId, Variables.token]);

  // Ahora sí puedes devolver reload
  return { mockAddresses, setmockAddresses, reload: fetchDirecciones };
}

export const tipos = ["Casa", "Trabajo", "Otro"] as const;
