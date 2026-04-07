import { useState, useEffect } from "react";
import { getEndPoint } from "../components/global";
import { Product } from "../data/mockData";

export function useCargaProductos() {
  const [mockProducts, setMockProducts] = useState<Product[]>([]);

  useEffect(() => {
    const apiUrl = getEndPoint("/api/Products");

    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setMockProducts(data);
        console.log("Productos cargados:", data);
      } catch (error) {
        console.error("*** ERROR AL CARGAR LOS PRODUCTOS ***", error);
      }
    };

    fetchProducts();
  }, []);

  // 🔑 Aquí devolvemos el estado y el setter
  return { mockProducts, setMockProducts };
}
