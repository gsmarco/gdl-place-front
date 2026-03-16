import { Link, useLocation, useNavigate } from 'react-router';
import { ShoppingCart, Store, User, Search, ChevronDown, LogOut, Package, MapPin, CreditCard, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useBuyerAuth } from '../../contexts/BuyerAuthContext';

interface HeaderProps {
  cartItemsCount?: number;
  userType?: 'buyer' | 'seller';
}

export function Header({ cartItemsCount = 0, userType = 'buyer' }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isSeller = location.pathname.startsWith('/seller');
  const EsVendedor = localStorage.getItem("user.role");
  const { user, isAuthenticated, logout } = useBuyerAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to={isSeller ? "/seller/dashboard" : "/"} className="flex items-center gap-2">
            <Store className="size-6 text-blue-600" />
            <span className="text-xl font-semibold">GDL-Place</span>
          </Link>

          {/* Search bar - solo para compradores */}
          {!isSeller && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {isSeller ? (
              <>
                <Link
                  to="/seller/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/seller/dashboard'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/seller/products"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/seller/products'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Productos
                </Link>
                <Link
                  to="/seller/sales"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/seller/sales'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Ventas
                </Link>
                <Link
                  to="/seller/my-store"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/seller/my-store'
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Mi Tienda
                </Link>
                <Link to="/" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Ver como Comprador
                </Link>
              </>
            ) : (
              <>
                <Link to="/catalog" className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  Catálogo
                </Link>
                <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg">
                  <ShoppingCart className="size-5 text-gray-600" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 flex items-center justify-center text-xs font-medium text-white bg-blue-600 rounded-full">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated && user ? (
                  // User Menu
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="size-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="size-4 text-white" />
                      </div>
                      <span className="hidden md:block text-sm font-medium text-gray-700">
                        {user.isGuest ? 'Invitado' : user.name}
                      </span>
                      <ChevronDown className="size-4 text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border py-2">
                        <div className="px-4 py-3 border-b">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          {!user.isGuest && (
                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                          )}
                        </div>

                        {!user.isGuest && (
                          <>
                            <Link
                              to="/profile/info"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <UserCircle className="size-4" />
                              Mi Información
                            </Link>
                            <Link
                              to="/profile/addresses"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <MapPin className="size-4" />
                              Direcciones
                            </Link>
                            <Link
                              to="/profile/payment-methods"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <CreditCard className="size-4" />
                              Métodos de Pago
                            </Link>
                            <Link
                              to="/profile/orders"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Package className="size-4" />
                              Historial de Pedidos
                            </Link>
                            <div className="border-t my-2"></div>
                          </>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="size-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // Login/Register buttons
                  <>
                    <Link to="/buyer/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
                      Iniciar Sesión
                    </Link>
                    <Link to="/seller/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Vender
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
