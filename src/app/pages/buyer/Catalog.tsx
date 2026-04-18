import { useState } from "react";
import { useOutletContext } from "react-router";
import { Product, categories } from "../../data/mockData";
import { ProductCard } from "../../components/ProductCard";
import { verificaToken } from "../../components/VerificaToken";

import {
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCargaProductos } from "../../components/LeeProductos";

interface OutletContext {
  addToCart: (product: Product) => void;
}

export function Catalog() {
  const { mockProducts } = useCargaProductos(); // ✅ ahora sí devuelve datos
  const featuredProducts = mockProducts.slice(0, 3);
  const { addToCart } = useOutletContext<OutletContext>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const ITEMS_PER_PAGE = 6; // 3x3 grid

  const filteredProducts = mockProducts
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory,
    )
    .filter((product) => {
      if (priceRange === "all") return true;
      const price = product.price;
      if (priceRange === "low") return price < 500;
      if (priceRange === "mid") return price >= 500 && price < 1000;
      if (priceRange === "high") return price >= 1000;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Resetear a la primera página cuando cambian los filtros
  const handleFilterChange =
    (setter: (value: string) => void) => (value: string) => {
      setter(value);
      setCurrentPage(1);
    };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Descubre productos increíbles
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Compra directamente de vendedores locales. Calidad garantizada.
          </p>
        </div>
      </div>

      {/* Filters & Products */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="size-5" />
                <h2 className="font-semibold">Filtros</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Categoría
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === "all"}
                      onChange={(e) =>
                        handleFilterChange(setSelectedCategory)(e.target.value)
                      }
                      className="text-blue-600"
                    />
                    <span className="text-sm">Todas</span>
                  </label>
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) =>
                          handleFilterChange(setSelectedCategory)(
                            e.target.value,
                          )
                        }
                        className="text-blue-600"
                      />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Precio
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="all"
                      checked={priceRange === "all"}
                      onChange={(e) =>
                        handleFilterChange(setPriceRange)(e.target.value)
                      }
                      className="text-blue-600"
                    />
                    <span className="text-sm">Todos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="low"
                      checked={priceRange === "low"}
                      onChange={(e) =>
                        handleFilterChange(setPriceRange)(e.target.value)
                      }
                      className="text-blue-600"
                    />
                    <span className="text-sm">Menos de $500</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="mid"
                      checked={priceRange === "mid"}
                      onChange={(e) =>
                        handleFilterChange(setPriceRange)(e.target.value)
                      }
                      className="text-blue-600"
                    />
                    <span className="text-sm">$500 - $1000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="high"
                      checked={priceRange === "high"}
                      onChange={(e) =>
                        handleFilterChange(setPriceRange)(e.target.value)
                      }
                      className="text-blue-600"
                    />
                    <span className="text-sm">Más de $1000</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange("all");
                  setSortBy("featured");
                }}
                className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-xl border p-4 mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} productos encontrados
              </p>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border-0 focus:ring-0 text-gray-700"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
              </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  variant="buyer"
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No se encontraron productos con estos filtros
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border p-4">
                <p className="text-sm text-gray-600">
                  Mostrando {startIndex + 1}-
                  {Math.min(endIndex, filteredProducts.length)} de{" "}
                  {filteredProducts.length} productos
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Mostrar solo algunas páginas para evitar overflow
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        if (!showPage) {
                          if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      },
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
