import { useState, useEffect } from "react";
import { getEndPoint } from "../components/global";
import { useVerificaToken } from "../components/VerificaToken";

interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  date: string;
  status: "pending" | "completed" | "cancelled" | "shipped";
  trackingNumber?: string;
}

export function useCargaVentas() {
  const [sales, setSales] = useState<Sale[]>([]);
  const { token, expired, userId, email } = useVerificaToken();

  useEffect(() => {
    const apiUrl = getEndPoint("/api/getVentas/" + userId);
    const fetchVentas = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setSales(data);
      } catch (error) {
        console.error("*** ERROR AL CARGAR LAS VENTAS ***", error);
      }
    };

    fetchVentas();
  }, []);

  // 🔑 Aquí devolvemos el estado y el setter
  return { sales, setSales };
}

export function useLeeTendencias(token: string, userId: string) {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 👇 SOLO ejecuta cuando haya datos reales
    if (!token || !userId) return;

    const fetchTendencias = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://127.0.0.1:3000/api/tendenciasVentas/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        setTrendData(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTendencias();
  }, [token, userId]); // 👈 CLAVE

  return { trendData, loading, error };
}
