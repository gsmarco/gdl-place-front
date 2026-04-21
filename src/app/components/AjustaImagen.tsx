import { Product } from "../data/mockData";

const baseUrl = import.meta.env.VITE_API_URL;

export function getFirstImage(product: Product): string {
  let imagen: string = "";

  if (Array.isArray(product.image)) {
    imagen = product.image[0];
  } else {
    imagen = product.image; // ya es string o algo parecido
  }

  if (!imagen) return "";

  const imagenStr = imagen.toString(); // 🔑 convertir a string

  if (typeof imagen === "string" && imagen.startsWith("/uploads/")) {
    return baseUrl + imagen;
  } else {
    return baseUrl + "/uploads/" + imagen.toString();
  }
}
