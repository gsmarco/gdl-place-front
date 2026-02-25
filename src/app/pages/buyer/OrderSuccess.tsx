import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export function OrderSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="size-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Pedido Confirmado!
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Gracias por tu compra. Tu pedido ha sido recibido y está siendo procesado.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Package className="size-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Número de Orden: #ORD-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Recibirás un email de confirmación con los detalles de tu pedido
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="text-left p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tiempo estimado</p>
                <p className="font-semibold">3-5 días hábiles</p>
              </div>
              <div className="text-left p-4 border rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Estado del pedido</p>
                <p className="font-semibold text-green-600">Confirmado</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/catalog"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Seguir Comprando
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/"
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
