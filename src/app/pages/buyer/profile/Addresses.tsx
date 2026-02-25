import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, MapPinned } from 'lucide-react';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'Casa',
    street: 'Av. Revolucion 1234',
    city: 'Guadalajara',
    state: 'Jalisco',
    zipCode: '44100',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    name: 'Oficina',
    street: 'Calle Juarez 567',
    city: 'Guadalajara',
    state: 'Jalisco',
    zipCode: '44200',
    isDefault: false,
  },
];

export function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [showAddForm, setShowAddForm] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="size-5" />;
      case 'work':
        return <Briefcase className="size-5" />;
      default:
        return <MapPinned className="size-5" />;
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Direcciones</h2>
          <p className="text-gray-600 mt-1">Administra tus direcciones de envío</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="size-4" />
          Agregar Dirección
        </motion.button>
      </div>

      {/* Address Cards */}
      <div className="space-y-4">
        {addresses.map((address) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* Radio Button */}
              <div className="flex items-center pt-1">
                <input
                  type="radio"
                  name="defaultAddress"
                  checked={address.isDefault}
                  onChange={() => handleSetDefault(address.id)}
                  className="size-4 text-blue-600 cursor-pointer"
                />
              </div>

              {/* Icon */}
              <div className={`p-2 rounded-lg flex-shrink-0 ${
                address.isDefault ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {getTypeIcon(address.type)}
              </div>

              {/* Address Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{address.name}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      Predeterminada
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 text-sm text-gray-600">
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state}</p>
                  <p>C.P. {address.zipCode}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 className="size-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="size-4 text-red-600" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Form Modal (simplified) */}
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nueva Dirección</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre (Casa, Oficina, etc.)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Calle y Número"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Ciudad"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Estado"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="Código Postal"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

      {addresses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MapPin className="size-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No tienes direcciones guardadas</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Agregar tu primera dirección
          </button>
        </div>
      )}
    </div>
  );
}