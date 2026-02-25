import { useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Store, 
  ChevronRight, 
  Minus, 
  Plus,
  Shield,
  Truck,
  RotateCcw,
  Star,
  Heart,
  Share2
} from 'lucide-react';
import { mockProducts, Product } from '../../data/mockData';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { ProductCard } from '../../components/ProductCard';

interface OutletContext {
  addToCart: (product: Product) => void;
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useOutletContext<OutletContext>();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe</p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // Mock images - en producción estas vendrían del producto
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  // Productos relacionados (misma categoría)
  const relatedProducts = mockProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Mostrar feedback visual
    const button = document.getElementById('add-to-cart-btn');
    if (button) {
      button.textContent = '✓ Agregado al carrito';
      setTimeout(() => {
        button.textContent = 'Agregar al carrito';
      }, 2000);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-600">
              Inicio
            </button>
            <ChevronRight className="size-4" />
            <button onClick={() => navigate('/catalog')} className="hover:text-blue-600">
              Catálogo
            </button>
            <ChevronRight className="size-4" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-white rounded-2xl border-2 border-gray-200 overflow-hidden relative group"
            >
              <ImageWithFallback
                src={`https://via.placeholder.com/800x800?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-full">
                  Solo {product.stock} disponibles
                </div>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold text-lg">
                    Agotado
                  </span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === idx
                      ? 'border-blue-600 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <ImageWithFallback
                    src={`https://via.placeholder.com/200x200?text=${idx + 1}`}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2.5 rounded-lg border transition-colors ${
                      isFavorite
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`size-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
                    <Share2 className="size-5" />
                  </button>
                </div>
              </div>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {product.category}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-5 ${
                      i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">4.0 (127 reseñas)</span>
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${(product.price * 1.2).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                  -17%
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">Especificaciones</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium text-gray-900">{product.stock} unidades</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-medium text-gray-900">#{product.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-green-600">Nuevo</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cantidad
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-gray-900 border-x-2 border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} disponibles
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                id="add-to-cart-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-lg"
              >
                <ShoppingCart className="size-5" />
                Agregar al carrito
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  handleAddToCart();
                  navigate('/cart');
                }}
                disabled={product.stock === 0}
                className="px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed font-semibold"
              >
                Comprar ahora
              </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Truck className="size-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">Envío gratis</p>
                <p className="text-xs text-gray-600">En compras +$500</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Shield className="size-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">Compra segura</p>
                <p className="text-xs text-gray-600">100% protegida</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <RotateCcw className="size-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-medium text-gray-900">Devoluciones</p>
                <p className="text-xs text-gray-600">30 días gratis</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-lg">
                    <Store className="size-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vendido por</p>
                    <p className="font-semibold text-gray-900">{product.sellerName}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Ver tienda
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Productos Relacionados</h2>
              <button
                onClick={() => navigate('/catalog')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Ver todos →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={addToCart}
                  variant="buyer"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
