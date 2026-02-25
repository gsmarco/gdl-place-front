import { Outlet } from 'react-router';
import { Header } from './Header';
import { useState } from 'react';
import { CartItem, Product } from '../../data/mockData';
import { Toaster } from '../ui/sonner';

export function Layout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="flex-1">
        <Outlet context={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }} />
      </main>
      <Toaster richColors position="top-right" />
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">GDL-Place</h3>
              <p className="text-sm text-gray-400">
                Tu marketplace local de confianza
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Comprar</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/catalog" className="hover:text-white">Catálogo</a></li>
                <li><a href="#" className="hover:text-white">Categorías</a></li>
                <li><a href="#" className="hover:text-white">Ofertas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Vender</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/seller/register" className="hover:text-white">Registrarse</a></li>
                <li><a href="#" className="hover:text-white">Guías</a></li>
                <li><a href="#" className="hover:text-white">Tarifas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Términos</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 GDL-Place. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}