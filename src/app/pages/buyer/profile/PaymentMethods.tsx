import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Plus, Trash2, Star } from "lucide-react";
import { verificaToken } from "../../../components/VerificaToken";
import { getEndPoint } from "../../../components/global";
import { useRef } from "react";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last_four: string;
  expiry_date: string;
  holder_name: string;
  isdefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "visa",
    last_four: "4242",
    expiry_date: "12/25",
    holder_name: "Juan Pérez",
    isdefault: true,
  },
  {
    id: "2",
    type: "mastercard",
    last_four: "8888",
    expiry_date: "06/26",
    holder_name: "Juan Pérez",
    isdefault: false,
  },
];

import {
  useMetodosPago,
  MetodosPago,
  tipos,
} from "../../../components/LeeMetodosPago";

export function PaymentMethods() {
  const [loading, setLoading] = useState(false);
  const { token, expired, userId, email } = verificaToken();

  const [showAddForm, setShowAddForm] = useState(false);
  // const { MetodosPago, setMetodosPago, reload } = useMetodosPago(userId);

  const { MetodosPago, reload } = useMetodosPago();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    setPaymentMethods(MetodosPago);
  }, [MetodosPago]);

  console.log("Métodos de Pago: ", MetodosPago);

  const getCardColor = (type: string) => {
    switch (type) {
      case "visa":
        return "from-blue-600 to-blue-700";
      case "mastercard":
        return "from-orange-500 to-red-600";
      case "amex":
        return "from-green-600 to-teal-700";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isdefault: method.id === id,
      })),
    );
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta dirección?",
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      var urlBase = getEndPoint("/api/metodosPago/" + id);

      const response = await fetch(urlBase, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la el Método de Pago");
      }

      const data = await response.json();
      setPaymentMethods(paymentMethods.filter((method) => method.id !== id));

      alert("Método de Pago eliminado correctamente");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar el Método de Pago: " + error);
    } finally {
      setLoading(false);
    }
  };

  function getHtmlValue(elemento: string) {
    const input = document.getElementById(elemento) as HTMLInputElement;
    return input.value;
  }

  async function enviaDatos() {
    const tipoTarjeta = getHtmlValue("tipoTarjeta");
    const Tarjeta = getHtmlValue("Tarjeta");
    const Titular = getHtmlValue("Titular");
    const Expira = getHtmlValue("Expira");
    const cvv = getHtmlValue("cvv");

    const limpio = Tarjeta.replace(/\s/g, "");
    const ultimos4 = limpio.slice(-4);

    const dataForm = {
      id_user: userId,
      type: tipoTarjeta,
      last_four: ultimos4,
      expiry_date: Expira,
      holder_name: Titular,
      isdefault: false,
    };

    console.log("DATOS A ENVIAR: ", dataForm);
    const resultado = await handleSubmit(dataForm);
    setShowAddForm(false);
    reload();
  }

  const handleSubmit = async (dataForm: any) => {
    try {
      setLoading(true);
      var urlBase = getEndPoint("/api/metodosPago");
      var metodo = "POST";
      urlBase = urlBase;
      metodo = "POST";

      const response = await fetch(urlBase, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      if (!response.ok) {
        throw new Error("Error al guardar dirección");
      }

      const data = await response.json();

      console.log("Dirección creada:", data);

      alert("Dirección guardada correctamente");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar la dirección: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Métodos de Pago</h2>
          <p className="text-gray-600 mt-1">
            Administra tus tarjetas y métodos de pago
          </p>
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
              <div
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  method.isdefault
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Radio Button */}
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="defaultPayment"
                    checked={method.isdefault}
                    onChange={() => handleSetDefault(method.id)}
                    className="size-4 text-blue-600 cursor-pointer"
                  />
                </div>

                {/* Card Preview - Smaller */}
                <div
                  className={`bg-gradient-to-br ${getCardColor(method.type)} rounded-lg p-4 text-white w-64 flex-shrink-0`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <CreditCard className="size-6" />
                    {method.isdefault && (
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
                            <div
                              key={j}
                              className="size-1 bg-white/60 rounded-full"
                            />
                          ))}
                        </div>
                      ))}
                      <p className="text-base font-semibold tracking-wider ml-1">
                        {method.last_four}
                      </p>
                    </div>

                    <div className="flex items-end justify-between text-xs">
                      <div>
                        <p className="text-white/70 mb-0.5">Titular</p>
                        <p className="font-medium">{method.holder_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/70 mb-0.5">Expira</p>
                        <p className="font-medium">{method.expiry_date}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {method.type.charAt(0).toUpperCase() +
                          method.type.slice(1)}{" "}
                        •••• {method.last_four}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Vence {method.expiry_date}
                      </p>
                      {method.isdefault && (
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Agregar Tarjeta
            </h3>
            <div className="space-y-4">
              <div>
                {/* ========================================== */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de tarjeta
                </label>
                <select
                  id="tipoTarjeta"
                  name="cardType"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value=""> Selecciona una opción </option>
                  <option value="mastercard">Mastercard</option>
                  <option value="visa">Visa</option>
                  <option value="amex">American Express</option>
                </select>
                {/* ========================================== */}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  id="Tarjeta"
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
                  id="Titular"
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
                    id="Expira"
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
                    id="cvv"
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
                {/* <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button> */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // 🔥 evita que el click suba al fondo
                    console.log("CLICK GUARDAR");
                    enviaDatos();
                  }}
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
            <h4 className="font-medium text-blue-900 mb-1">
              Seguridad garantizada
            </h4>
            <p className="text-sm text-blue-700">
              Tus datos de pago están protegidos con encriptación de nivel
              bancario. Nunca almacenamos tu información completa de la tarjeta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
