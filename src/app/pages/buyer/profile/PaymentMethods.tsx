import { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  lastFour: string;
  expiryDate: string;
  holderName: string;
  isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'visa',
    lastFour: '4242',
    expiryDate: '12/25',
    holderName: 'Juan Pérez',
    isDefault: true,
  },
  {
    id: '2',
    type: 'mastercard',
    lastFour: '8888',
    expiryDate: '06/26',
    holderName: 'Juan Pérez',
    isDefault: false,
  },
];

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [showAddForm, setShowAddForm] = useState(false);

  const getCardColor = (type: string) => {
    switch (type) {
      case 'visa':
        return 'from-blue-600 to-blue-700';
      case 'mastercard':
        return 'from-orange-500 to-red-600';
      case 'amex':
        return 'from-green-600 to-teal-700';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métodos de Pago</h2>
          <p className="text-gray-600 mt-1">Administra tus tarjetas y métodos de pago</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-4" />
          Agregar Tarjeta
        </motion.button>
      </div>

      {/* Payment Cards - Vertical Layout */}
      <div className="bg-white rounded-xl border p-6">
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                method.isDefault 
                  ? 'border-blue-500 bg-blue-50/50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                {/* Radio Button */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="defaultPayment"
                    checked={method.isDefault}
                    onChange={() => handleSetDefault(method.id)}
                    className="size-4 text-blue-600 cursor-pointer"
                  />
                </div>

                {/* Card Preview - Smaller */}
                <div className={`bg-gradient-to-br ${getCardColor(method.type)} rounded-lg p-4 text-white w-64 flex-shrink-0`}>
                  <div className="flex items-start justify-between mb-3">
                    <CreditCard className="size-6" />
                    {method.isDefault && (
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
                        <Star className="size-2.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">Principal</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex gap-1.5 mb-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-0.5">
                          {[...Array(4)].map((_, j) => (
                            <div key={j} className="size-1 bg-white/60 rounded-full" />
                          ))}
                        </div>
                      ))}
                      <p className="text-base font-semibold tracking-wider ml-1">{method.lastFour}</p>
                    </div>

                    <div className="flex items-end justify-between text-xs">
                      <div>
                        <p className="text-white/70 mb-0.5">Titular</p>
                        <p className="font-medium">{method.holderName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 mb-0.5">Expira</p>
                        <p className="font-medium">{method.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {method.type.charAt(0).toUpperCase() + method.type.slice(1)} •••• {method.lastFour}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Vence {method.expiryDate}
                      </p>
                      {method.isDefault && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
                          <Star className="size-3 fill-blue-600" />
                          Tarjeta principal
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(method.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Agregar Tarjeta</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Titular
                </label>
                <input
                  type="text"
                  placeholder="Como aparece en la tarjeta"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Expiración
                  </label>
                  <input
                    type="text"
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {paymentMethods.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <CreditCard className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No tienes métodos de pago guardados</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Agregar tu primera tarjeta
          </button>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <CreditCard className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Seguridad garantizada</h4>
            <p className="text-sm text-blue-700">
              Tus datos de pago están protegidos con encriptación de nivel bancario. 
              Nunca almacenamos tu información completa de la tarjeta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
