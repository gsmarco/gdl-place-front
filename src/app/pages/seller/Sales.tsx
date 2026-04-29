import { useState, useEffect } from "react";
import { useVerificaToken } from "../../components/VerificaToken";
import { useCargaVentas, useLeeTendencias } from "../../components/LeeVentas";
import { useProductosMasVendidos } from "../../components/ProductosMasVendidos";

import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Search,
  Eye,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  X,
} from "lucide-react";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Sale {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  total: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  date: string;
  status: "pending" | "completed" | "cancelled" | "shipped";
  trackingNumber?: string;
}

export function SellerSales() {
  const { token, expired, userId, email } = useVerificaToken();
  if (!token) return;

  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">(
    "week",
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { sales, setSales } = useCargaVentas(); // ✅ ahora sí devuelve datos

  console.log("Sales: ", sales);

  const filteredSales = sales.filter((sale) => {
    // Filtro por estado
    if (statusFilter !== "all" && sale.status !== statusFilter) return false;

    // Filtro por búsqueda (ID, cliente, producto)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesId = sale.id.toLowerCase().includes(query);
      const matchesCustomer = sale.buyerName.toLowerCase().includes(query);
      // const matchesProduct = sale.products.name[].toLowerCase().includes(query);
      const matchesProduct = sale.products.some((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );

      if (!matchesId && !matchesCustomer && !matchesProduct) return false;
    }

    // Filtro por fecha desde
    if (dateFrom && new Date(sale.date) < new Date(dateFrom)) return false;

    // Filtro por fecha hasta
    if (dateTo && new Date(sale.date) > new Date(dateTo)) return false;

    return true;
  });

  const openDetailModal = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedSale(null);
  };

  const markAsShipped = () => {
    if (selectedSale) {
      // Actualizar estado de la venta
      setSales(
        sales.map((s) =>
          s.id === selectedSale.id
            ? {
                ...s,
                status: "shipped" as const,
                trackingNumber: `TRK${Date.now()}`,
              }
            : s,
        ),
      );

      // Mostrar notificación
      toast.success("¡Pedido marcado como enviado!", {
        description: `Se ha notificado a ${selectedSale.buyerName} que su pedido está en camino.`,
      });

      closeDetailModal();
    }
  };

  // Estadísticas
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalOrders = filteredSales.length;
  const avgOrderValue = totalRevenue / totalOrders || 0;
  const completedOrders = filteredSales.filter(
    (s) => s.status === "completed",
  ).length;
  const pendingOrders = sales.filter((s) => s.status === "pending").length;

  const { trendData, loading, error } = useLeeTendencias(token || "", userId);

  // Datos para gráfico de productos vendidos

  type ProductSales = {
    name: string;
    value: number;
    color: string;
  };

  const { productSalesData, loadingMasVendidos, ErrorMasVendidos } =
    useProductosMasVendidos(userId, token) as {
      productSalesData: ProductSales[];
      loadingMasVendidos: boolean;
      ErrorMasVendidos: any;
    };

  console.log("productSalesData", productSalesData);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ventas</h1>
            <p className="text-gray-600">
              Analiza el rendimiento de tus ventas
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="size-5" />
            Exportar Reporte
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-gray-400" />
            <select
              value={timeFilter}
              onChange={(e) =>
                setTimeFilter(e.target.value as "week" | "month" | "year")
              }
              className="border-0 focus:ring-0 text-sm font-medium text-gray-700"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mes</option>
              <option value="year">Último Año</option>
            </select>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-0 focus:ring-0 text-sm font-medium text-gray-700"
            >
              <option value="all">Todos los Estados</option>
              <option value="completed">Completadas</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <Search className="size-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por ID, cliente o producto"
              className="border-0 focus:ring-0 text-sm font-medium text-gray-700"
            />
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Desde"
              className="border-0 focus:ring-0 text-sm font-medium text-gray-700"
            />
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-gray-400" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Hasta"
              className="border-0 focus:ring-0 text-sm font-medium text-gray-700"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <TrendingUp className="size-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-sm text-green-600">+12.5% vs mes anterior</p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total de Órdenes</p>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {totalOrders}
            </p>
            <p className="text-sm text-gray-500">
              {completedOrders} completadas
            </p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Valor Promedio</p>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              ${avgOrderValue.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">por orden</p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Tasa de Conversión</p>
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {((completedOrders / totalOrders) * 100 || 0).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">órdenes completadas</p>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Órdenes Pendientes</p>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {pendingOrders}
            </p>
            <p className="text-sm text-gray-500">requieren atención</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Tendencia de Ventas
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="fecha" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Ventas ($)"
                />
                <Line
                  type="monotone"
                  dataKey="ordenes"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Órdenes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Distribution */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Productos Más Vendidos
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productSalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productSalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color ?? ""} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales History Table */}
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Historial de Ventas
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Orden
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(sale.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {(sale.id ?? "").toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {"sale.productName"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {sale.buyerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {"sale.quantity"} uds
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${sale.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          sale.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : sale.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : sale.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sale.status === "completed"
                          ? "Completada"
                          : sale.status === "shipped"
                            ? "Enviada"
                            : sale.status === "pending"
                              ? "Pendiente"
                              : "Cancelada"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openDetailModal(sale)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="size-4" />
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay ventas para mostrar</p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedSale && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={closeDetailModal}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Detalle del Pedido
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {(selectedSale.id ?? "").toUpperCase()}
                    </p>
                  </div>
                  <button
                    onClick={closeDetailModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="size-5 text-gray-500" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Estado y Fecha */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-1">
                        Estado del Pedido
                      </p>
                      <span
                        className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                          selectedSale.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : selectedSale.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : selectedSale.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedSale.status === "completed"
                          ? "Completada"
                          : selectedSale.status === "shipped"
                            ? "Enviada"
                            : selectedSale.status === "pending"
                              ? "Pendiente"
                              : "Cancelada"}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm text-gray-600 mb-1">
                        Fecha de Compra
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(selectedSale.date).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Productos */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="size-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Productos
                      </h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg border divide-y">
                      {selectedSale.products.map((product, index) => (
                        <div
                          key={index}
                          className="p-4 flex items-center gap-4"
                        >
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Cantidad: {product.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              Precio unitario
                            </p>
                            <p className="font-semibold text-gray-900">
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Subtotal</p>
                            <p className="font-semibold text-gray-900">
                              ${(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">
                          Total del Pedido
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${selectedSale.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Información del Cliente */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="size-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Información del Cliente
                      </h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg border p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Nombre completo
                          </p>
                          <p className="font-medium text-gray-900">
                            {selectedSale.buyerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">
                            {selectedSale.buyerEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="size-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Teléfono</p>
                          <p className="font-medium text-gray-900">
                            {selectedSale.buyerPhone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dirección de Envío */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="size-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Dirección de Envío
                      </h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">
                          {selectedSale.shippingAddress.street}
                        </p>
                        <p className="text-gray-700">
                          {selectedSale.shippingAddress.city},{" "}
                          {selectedSale.shippingAddress.state}
                        </p>
                        <p className="text-gray-700">
                          {selectedSale.shippingAddress.zipCode}
                        </p>
                        <p className="text-gray-700">
                          {selectedSale.shippingAddress.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking */}
                  {selectedSale.trackingNumber && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="size-5 text-blue-600" />
                        <p className="font-medium text-blue-900">
                          Número de Seguimiento
                        </p>
                      </div>
                      <p className="text-lg font-mono font-semibold text-blue-600">
                        {selectedSale.trackingNumber}
                      </p>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={closeDetailModal}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cerrar
                    </button>
                    {selectedSale.status === "pending" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={markAsShipped}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 font-medium"
                      >
                        <Truck className="size-5" />
                        Marcar como Enviado y Notificar al Cliente
                      </motion.button>
                    )}
                    {selectedSale.status === "shipped" && (
                      <div className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-medium">
                        <CheckCircle className="size-5" />
                        Pedido Enviado
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
