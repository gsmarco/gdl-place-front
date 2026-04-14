import { useState, useEffect, useMemo } from "react";
import { getEndPoint, getVars } from "./global";

export interface MetodosPago {
  id: string;
  id_user: number;
  type: "mastercard" | "visa";
  last_four: string;
  expiry_date: string;
  holder_name: string;
  isdefault: boolean;
}

export function useMetodosPago() {
  const [MetodosPago, setMetodosPago] = useState<MetodosPago[]>([]);

  const Variables = getVars("/");
  console.log("token en useMetodosPagos", Variables.token);

  const fetchMetodosPago = async () => {
    try {
      const apiUrl = getEndPoint("/api/MetodosPagoByUser/") + Variables.userId;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Variables.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("MetodosPago cargados:", data);
      setMetodosPago(data);
    } catch (error) {
      console.error("*** ERROR AL CARGAR ***", error);
    }
  };

  useEffect(() => {
    //   if (!Variables.userId || !Variables.token) return;

    fetchMetodosPago();
  }, [Variables.userId, Variables.token]);

  return { MetodosPago, setMetodosPago, reload: fetchMetodosPago };
}
export const tipos = ["mastercard", "visa"] as const;

// export function useMetodosPago(id: string) {
//   const [MetodosPago, setMetodosPago] = useState<MetodosPago[]>([]);
//   const Variables = getVars("/");
//   console.log("Variables: ", Variables);
//   const [loading, setLoading] = useState(true);
//   // Definimos la función fuera del useEffect
//   const fetchMetodosPago = async () => {
//     try {
//       setLoading(true);
//       const apiUrl = getEndPoint("/api/MetodosPagoByUser/") + Variables.userId;
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${Variables.token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       setMetodosPago(data);
//       console.log("MetodosPago cargados:", data);
//       console.log("Métodos de pago seteados: ", MetodosPago);
//     } catch (error) {
//       console.error("*** ERROR AL CARGAR LAS MetodosPago ***", error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchMetodosPago();
//   }, [Variables.userId, Variables.token]);

//   // Ahora sí puedes devolver reload
//   return { MetodosPago, setMetodosPago, reload: fetchMetodosPago };
// }
