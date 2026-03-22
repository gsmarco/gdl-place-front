import { useEffect, useState } from "react";

export interface Seller {
  id: number;
  bussines_name: string;
  owner_name: string;
  email: string;
  address: string;
  phone: string;
  city: string;
  category: string;
  description: string;
  date_created: string;
}

export function useSeller(email: string, auth: string) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email || !auth) {
      setError("Falta email o token");
      setLoading(false);
      return;
    }

    const fetchSeller = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:3000/api/sellerByEmail/${email}`,
          {
            method: "GET",
            headers: {
              Authorization: auth ?? "",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener datos de la tienda");
        }
        const data: Seller = await response.json();
        setSeller(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSeller();
  }, [email, auth]);

  return { seller, loading, error };
}
