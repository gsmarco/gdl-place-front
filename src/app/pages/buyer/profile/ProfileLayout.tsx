import { Outlet, Link, useLocation, Navigate } from 'react-router';
import { UserCircle, MapPin, CreditCard, Package } from 'lucide-react';
import { useBuyerAuth } from '../../../contexts/BuyerAuthContext';

const profileMenuItems = [
  { path: '/profile/info', label: 'Mi Información', icon: UserCircle },
  { path: '/profile/addresses', label: 'Direcciones', icon: MapPin },
  { path: '/profile/payment-methods', label: 'Métodos de Pago', icon: CreditCard },
  { path: '/profile/orders', label: 'Historial de Pedidos', icon: Package },
];

export function ProfileLayout() {
  const location = useLocation();
  const { user, isAuthenticated } = useBuyerAuth();

  // Redirect if not authenticated or is guest
  if (!isAuthenticated || user?.isGuest) {
    return <Navigate to="/buyer/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border p-4 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                <div className="size-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCircle className="size-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user.email}</p>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-1">
                {profileMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="size-5 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
