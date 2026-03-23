import React from "react";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Star } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import { ProductCard } from "../../components/ProductCard";
import { Product } from "../../data/mockData";
import { useCargaProductos } from "../../components/LeeProductos";

interface OutletContext {
  addToCart: (product: Product) => void;
}

export function Home() {
  const { addToCart } = useOutletContext<OutletContext>();
  const { mockProducts } = useCargaProductos(); // ✅ ahora sí devuelve datos
  const featuredProducts = mockProducts.slice(0, 3);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Compra Local,
              <br />
              Apoya a tu Comunidad
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Descubre productos únicos de vendedores locales. Calidad
              garantizada, envíos rápidos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg"
              >
                Explorar Productos
                <ArrowRight className="size-5" />
              </Link>
              <Link
                to="/seller/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-medium text-lg"
              >
                Vender en GDL-Place
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="size-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Compra Segura
              </h3>
              <p className="text-gray-600">
                Todos los pagos están protegidos con encriptación de última
                generación
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Truck className="size-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Envío Rápido
              </h3>
              <p className="text-gray-600">
                Recibe tus productos en 3-5 días hábiles. Envío gratis en
                compras superiores a $1000
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="size-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pago Flexible
              </h3>
              <p className="text-gray-600">
                Acepta múltiples métodos de pago para tu conveniencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Productos Destacados
              </h2>
              <p className="text-gray-600">
                Los mejores productos seleccionados para ti
              </p>
            </div>
            <Link
              to="/catalog"
              className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todo
              <ArrowRight className="size-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                variant="buyer"
              />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todos los productos
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Tienes un negocio?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a GDL-Place y comienza a vender tus productos a miles de
            clientes potenciales
          </p>
          <Link
            to="/seller/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg"
          >
            Comienza a Vender
            <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Vendedores Activos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Productos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Clientes Felices</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-blue-600">4.8</span>
                <Star className="size-8 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-gray-600">Calificación Promedio</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
