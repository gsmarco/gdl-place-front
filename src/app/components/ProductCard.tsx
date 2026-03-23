import { ShoppingCart, Package } from "lucide-react";
import { Product } from "../data/mockData";
import { getVars } from "./global";
import { ImageWithFallback } from "./figma/ImageWithFallback";
// import { unsplash_tool } from 'unsplash_tool';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  variant?: "buyer" | "seller";
  onEdit?: () => void;
}

// const apiUrlBase = getVars("");
// const fileScr =
//   apiUrlBase + "localhost:3000/Tarjeta%20Gr%C3%A1fica%20RTX%204070.jpg";

export function ProductCard({
  product,
  onAddToCart,
  variant = "buyer",
  onEdit,
}: ProductCardProps) {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <ImageWithFallback
          // src={`localhost:3000/uploads=${encodeURIComponent(product.name)}`}
          // src="http://localhost:3000/uploads/Tarjeta%20Gr%C3%A1fica%20RTX%204070.jpg"
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
            Solo {product.stock}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">
            {product.name}
          </h3>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
            {product.category}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {variant === "seller" && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <Package className="size-4" />
            <span>Stock: {product.stock} unidades</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${product.price}
            </span>
          </div>

          {variant === "buyer" && onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="size-4" />
              Añadir
            </button>
          )}

          {variant === "seller" && onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
