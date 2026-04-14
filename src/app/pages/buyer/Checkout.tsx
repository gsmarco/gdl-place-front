import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { CartItem } from "../../data/mockData";
import { CreditCard, MapPin, User, Check } from "lucide-react";
import { getEndPoint, getVars, authVars } from "../../components/global";

interface OutletContext {
  cartItems: CartItem[];
  clearCart: () => void;
}

let userId = 0;
let token = "";
let baseUrl = {};
let Variables: authVars = {
  token: "",
  auth: "",
  userId: 0,
  userName: "",
  email: "",
  message: "Inicie sesión de vendedor",
};

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useOutletContext<OutletContext>();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    // Shipping
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    // Payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  baseUrl = getEndPoint("");
  Variables = getVars("/");
  userId = Variables.userId;
  token = Variables.token;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = 15;
  const total = subtotal + shipping;

  const guardaDatos = async () => {
    const saleData = {
      total: cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      ),
      buyer_id: userId, // o del usuario logueado
      buyerName: formData.fullName,
      buyerEmail: formData.email,
      buyerPhone: formData.phone,
      street: formData.address,
      city: formData.city,
      state: "Jalisco",
      zipCode: formData.zipCode,
      country: "México",
      products: cartItems.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: Array.isArray(item.product.image)
          ? item.product.image[0]
          : item.product.image,
      })),
      shipping: shipping,
      date_sale: new Date().toISOString().split("T")[0],
      status: "pending",
      cardNumber: formData.cardNumber,
      cardName: formData.cardName,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
    };

    const datosJson = JSON.stringify(saleData);
    console.log("Datos envíados", datosJson);
    const urlApi = baseUrl;
    try {
      const response = await fetch(baseUrl + "/api/sales", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: datosJson,
      });

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        // Aquí puedes lanzar un error con más detalle
        alert(`Error ${response.status}: ${response.statusText}`);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Rgreso de la API", data);
    } catch (error) {
      // Aquí capturas cualquier error de red o de la API
      if (error instanceof Error) {
        console.error("Ocurrió un error:", error.message);
        throw error; // ✅ propagas el error hacia handleSubmit
      }
      throw new Error("Error desconocido");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) {
      try {
        const resultado = await guardaDatos();
        setTimeout(() => {
          clearCart();
          navigate("/order-success");
        }, 1500);
      } catch (error) {
        if (error instanceof Error) {
          alert("Error al guardar la venta: " + error.message);
        }
      }
    } else {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  // Va mostrando lo que se captura en los campos
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Finalizar Compra
        </h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Envío" },
              { num: 2, label: "Revisión" },
              { num: 3, label: "Pago" },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step >= s.num
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }`}
                  >
                    {step > s.num ? <Check className="size-5" /> : s.num}
                  </div>
                  <span className="text-xs mt-2 font-medium">{s.label}</span>
                </div>
                {idx < 2 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step > s.num ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border p-6"
            >
              {/* Step 1: Shipping Info */}
              {step === 1 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="size-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">
                      Información de Envío
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          updateField("fullName", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="juan@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Calle Principal 123, Apto 4B"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ciudad *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ciudad"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código Postal *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.zipCode}
                          onChange={(e) =>
                            updateField("zipCode", e.target.value)
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="12345"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Review Order */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">
                    Revisa tu Pedido
                  </h2>

                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between py-3 border-b"
                      >
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium mb-2">Dirección de Envío</h3>
                    <p className="text-sm text-gray-700">{formData.fullName}</p>
                    <p className="text-sm text-gray-700">{formData.address}</p>
                    <p className="text-sm text-gray-700">
                      {formData.city}, {formData.zipCode}
                    </p>
                    <p className="text-sm text-gray-700">{formData.phone}</p>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="size-5 text-blue-600" />
                    <h2 className="text-xl font-semibold">
                      Información de Pago
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Tarjeta *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardNumber}
                        onChange={(e) =>
                          updateField("cardNumber", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre en la Tarjeta *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cardName}
                        onChange={(e) =>
                          updateField("cardName", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="JUAN PEREZ"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fecha de Vencimiento *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.expiryDate}
                          onChange={(e) =>
                            updateField("expiryDate", e.target.value)
                          }
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="MM/AA"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.cvv}
                          onChange={(e) => updateField("cvv", e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Atrás
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {step === 3 ? "Confirmar Pago" : "Continuar"}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Resumen</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-900">
                  🔒 Pago 100% seguro y encriptado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
