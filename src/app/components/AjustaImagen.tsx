import { Product } from "../data/mockData";

export function getFirstImage(product: Product): string {
  let imagen: string = "";

  if (Array.isArray(product.image)) {
    imagen = product.image[0];
  } else {
    imagen = product.image; // ya es string o algo parecido
  }

  if (!imagen) return "";

  const imagenStr = imagen.toString(); // convertir a string

  return imagenStr;
}
