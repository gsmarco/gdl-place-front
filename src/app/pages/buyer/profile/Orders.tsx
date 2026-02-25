import { useState } from 'react';
import { motion } from 'motion/react';
import { Package, Search, Eye, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  trackingNumber?: string;
  shippingCarrier?: string;
  deliveryDate?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2026-02-15',
    status: 'delivered',
    total: 1299.99,
    items: [
      { name: 'Laptop Gaming Pro', quantity: 1, price: 1299.99, image: 'laptop gaming workspace' },
    ],
    trackingNumber: 'TRK123456789',
    shippingCarrier: 'FedEx',
    deliveryDate: '2026-02-18',
  },
  {
    id: 'ORD-002',
    date: '2026-02-10',
    status: 'shipped',
    total: 599.98,
    items: [
      { name: 'Auriculares Bluetooth Premium', quantity: 1, price: 249.99, image: 'premium headphones black' },
      { name: 'Smartwatch Elite', quantity: 1, price: 349.99, image: 'luxury smartwatch fitness' },
    ],
    trackingNumber: 'TRK987654321',
    shippingCarrier: 'DHL Express',
  },
  {
    id: 'ORD-003',
    date: '2026-02-19',
    status: 'processing',
    total: 1099.99,
    items: [
      { name: 'Tablet Pro 12.9"', quantity: 1, price: 1099.99, image: 'modern tablet workspace' },
    ],
  },
  {
    id: 'ORD-004',
    date: '2026-02-19',
    status: 'pending',
    total: 459.97,
    items: [
      { name: 'Mouse Inalámbrico RGB', quantity: 1, price: 89.99, image: 'wireless rgb mouse' },
      { name: 'Teclado Mecánico Gaming', quantity: 1, price: 199.99, image: 'mechanical keyboard rgb' },
      { name: 'Mousepad XXL', quantity: 1, price: 169.99, image: 'large gaming mousepad' },
    ],
  },
];

export function Orders() {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pendiente' };
      case 'processing':
        return { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Procesando' };
      case 'shipped':
        return { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Enviado' };
      case 'delivered':
        return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Entregado' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelado' };
      default:
        return { icon: Package, color: 'text-gray-600', bg: 'bg-gray-50', label: 'Desconocido' };
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historial de Pedidos</h2>
          <p className="text-gray-600 mt-1">Revisa el estado de tus compras</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'processing', 'shipped', 'delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Todos' : getStatusConfig(status).label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          const StatusIcon = statusConfig.icon;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{order.id}</h3>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg}`}>
                      <StatusIcon className={`size-4 ${statusConfig.color}`} />
                      <span className={`text-sm font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pedido el {new Date(order.date).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {order.trackingNumber && (
                    <div className="flex flex-col gap-0.5 mt-1">
                      {order.shippingCarrier && (
                        <p className="text-sm text-gray-600">
                          Paquetería: <span className="font-medium text-gray-900">{order.shippingCarrier}</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Rastreo: <span className="font-mono text-blue-600">{order.trackingNumber}</span>
                      </p>
                    </div>
                  )}
                  {order.status === 'delivered' && order.deliveryDate && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      ✓ Entregado el {new Date(order.deliveryDate).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${order.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                  </p>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-2 mb-4">
                {order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="size-12 bg-gray-100 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-gray-900">{item.name}</p>
                      <p className="text-gray-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">
                      ${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-600 pl-15">
                    +{order.items.length - 2} producto(s) más
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  <Eye className="size-4" />
                  Ver Detalles
                </button>
                {order.trackingNumber && order.status !== 'delivered' && (
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Truck className="size-4" />
                    Rastrear Envío
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedOrder.id}</h3>
                <p className="text-gray-600 mt-1">
                  {new Date(selectedOrder.date).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 pb-4 border-b">
                  <div className="size-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    ${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            {/* Shipping Info */}
            {selectedOrder.trackingNumber && selectedOrder.shippingCarrier && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <Truck className="size-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-900 mb-2">Información de Envío</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-700">Paquetería:</span>
                        <span className="font-semibold text-purple-900">{selectedOrder.shippingCarrier}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-700">Guía de rastreo:</span>
                        <span className="font-mono font-semibold text-purple-900">{selectedOrder.trackingNumber}</span>
                      </div>
                      {selectedOrder.deliveryDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-700">Fecha de entrega:</span>
                          <span className="font-semibold text-purple-900">
                            {new Date(selectedOrder.deliveryDate).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                    {selectedOrder.status !== 'delivered' && (
                      <button className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium underline">
                        Rastrear paquete en línea
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span>${selectedOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Package className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No tienes pedidos en esta categoría</p>
        </div>
      )}
    </div>
  );
}