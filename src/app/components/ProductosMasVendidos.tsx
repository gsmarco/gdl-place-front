import { useState, useEffect } from "react";
import { getEndPoint } from "./global";

export function useProductosMasVendidos(userId: string, token: string) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = getEndPoint("");

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/api/productosMasVendidos/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Error en la petición: " + response.status);
        }

        const data = await response.json();
        setProductos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [userId]);

  return {
    productSalesData: productos,
    loadingMasVendidos: loading,
    ErrorMasVendidos: error,
  };
}
