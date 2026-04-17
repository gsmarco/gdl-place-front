import { useEffect, useState } from "react";
import { Store } from "./types";

export const useStore = (id: string, baseUrl: string) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    let isMounted = true;
    const fetchStore = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${baseUrl}/api/Store/${id}`);

        if (!response.ok) {
          throw new Error("Error al obtener la tienda");
        }

        const data = await response.json();

        if (isMounted) {
          setStore(data);
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStore();
    return () => {
      isMounted = false;
    };
  }, [id]);

  return { store, loading, error };
};
