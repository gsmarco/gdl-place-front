import { EnConstruccion } from "../../components/EnConstruccion";

export function SellerDashboard() {
  return (
    <div>
      {" "}
      <EnConstruccion ruta="/" texto="Ir a la página de inicio" />{" "}
    </div>
  );
}

// import { TrendingUp, Package, DollarSign, ShoppingBag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
// import { mockSales, mockProducts } from '../../data/mockData';
// import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// export function SellerDashboard() {
//   // Calcular estadísticas
//   const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.total, 0);
//   const totalSales = mockSales.length;
//   const totalProducts = mockProducts.length;
//   const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);

//   // Datos para gráficos
//   const salesData = [
//     { date: '10 Feb', ventas: 2400, productos: 12 },
//     { date: '11 Feb', ventas: 1398, productos: 8 },
//     { date: '12 Feb', ventas: 3800, productos: 15 },
//     { date: '13 Feb', ventas: 2780, productos: 11 },
//     { date: '14 Feb', ventas: 4590, productos: 18 },
//     { date: '15 Feb', ventas: 3200, productos: 13 },
//     { date: '16 Feb', ventas: 4100, productos: 16 },
//   ];

//   const categoryData = [
//     { category: 'Electrónica', cantidad: 35 },
//     { category: 'Accesorios', cantidad: 28 },
//     { category: 'Fotografía', cantidad: 12 },
//     { category: 'Otros', cantidad: 8 },
//   ];

//   const stats = [
//     {
//       label: 'Ingresos Totales',
//       value: `$${totalRevenue.toFixed(2)}`,
//       change: '+12.5%',
//       positive: true,
//       icon: DollarSign,
//       color: 'bg-green-500'
//     },
//     {
//       label: 'Ventas Totales',
//       value: totalSales,
//       change: '+8.2%',
//       positive: true,
//       icon: ShoppingBag,
//       color: 'bg-blue-500'
//     },
//     {
//       label: 'Productos Activos',
//       value: totalProducts,
//       change: '+3',
//       positive: true,
//       icon: Package,
//       color: 'bg-purple-500'
//     },
//     {
//       label: 'Stock Total',
//       value: totalStock,
//       change: '-5.4%',
//       positive: false,
//       icon: TrendingUp,
//       color: 'bg-orange-500'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Panel de Control
//           </h1>
//           <p className="text-gray-600">
//             Bienvenido de vuelta, aquí está el resumen de tu negocio
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, idx) => (
//             <div key={idx} className="bg-white rounded-xl border p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
//                   <stat.icon className="size-6 text-white" />
//                 </div>
//                 <span className={`flex items-center gap-1 text-sm font-medium ${
//                   stat.positive ? 'text-green-600' : 'text-red-600'
//                 }`}>
//                   {stat.positive ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
//                   {stat.change}
//                 </span>
//               </div>
//               <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
//               <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Charts */}
//         <div className="grid lg:grid-cols-2 gap-6 mb-8">
//           {/* Sales Trend */}
//           <div className="bg-white rounded-xl border p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">
//               Tendencia de Ventas
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={salesData}>
//                 <defs>
//                   <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="date" stroke="#9ca3af" />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="ventas"
//                   stroke="#3b82f6"
//                   fillOpacity={1}
//                   fill="url(#colorVentas)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Category Distribution */}
//           <div className="bg-white rounded-xl border p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-6">
//               Ventas por Categoría
//             </h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={categoryData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                 <XAxis dataKey="category" stroke="#9ca3af" />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip />
//                 <Bar dataKey="cantidad" fill="#3b82f6" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Sales */}
//         <div className="bg-white rounded-xl border">
//           <div className="p-6 border-b">
//             <h2 className="text-lg font-semibold text-gray-900">
//               Ventas Recientes
//             </h2>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ID Orden
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Producto
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Cliente
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Cantidad
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Estado
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {mockSales.slice(0, 5).map((sale) => (
//                   <tr key={sale.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {sale.id.toUpperCase()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {sale.productName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {sale.buyerName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                       {sale.quantity}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       ${sale.total.toFixed(2)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         sale.status === 'completed'
//                           ? 'bg-green-100 text-green-800'
//                           : sale.status === 'pending'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {sale.status === 'completed' ? 'Completado' : sale.status === 'pending' ? 'Pendiente' : 'Cancelado'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
