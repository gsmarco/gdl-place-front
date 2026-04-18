import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { getEndPoint, getVars } from "../../../components/global";
import { useVerificaToken } from "../../../components/VerificaToken";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Briefcase,
  MapPinned,
} from "lucide-react";

import {
  useDirecciones,
  Address,
  tipos,
} from "../../../components/LeeDirecciones";

export function Addresses() {
  const { token, expired, userId, email } = useVerificaToken();
  if (!token) return;

  const [showAddForm, setShowAddForm] = useState(false);
  const { mockAddresses, setmockAddresses, reload } = useDirecciones();
  console.log(mockAddresses);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Casa":
        return <Home className="size-5" />;
      case "Trabajo":
        return <Briefcase className="size-5" />;
      default:
        return <MapPinned className="size-5" />;
    }
  };

  const [form, setForm] = useState<Address>({
    id: "",
    id_user: userId,
    tipo: "Casa",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    zipcode: "",
    isdefault: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const [error, setError] = useState<string | null>(null);

  const handleSetDefault = async (id: string) => {
    // 2. Actualiza el estado local
    const urlBase = getEndPoint("");
    const id_user = userId;
    var mensaje = "id_user: " + id_user;
    setmockAddresses(
      mockAddresses.map((addr) => ({
        ...addr,
        isdefault: addr.id === id,
      })),
    );

    // 2. Actualización en backend
    try {
      const res = await fetch(urlBase + "/api/address/setDefault", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_user,
          address_id: id,
        }),
      });

      // ⚠️ IMPORTANTE: validar si falló
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error desconocido");
      }

      const data = await res.json();
      console.log("Respuesta backend:", data);
    } catch (error) {
      alert("Error al actulizar el campo isDefault");
      console.error("Error al actualizar:", error);
    }
  };

  const editaDireccion = (id: string) => {
    // Buscar el registro dentro del arreglo
    const direccion = mockAddresses.find((dir) => dir.id === id);

    if (!direccion) {
      return <p>No se encontró la dirección con id {id}</p>;
    }

    setForm({
      id: id,
      id_user: direccion.id_user,
      tipo: direccion.tipo,
      street: direccion.street,
      neighborhood: direccion.neighborhood,
      city: direccion.city,
      state: direccion.state,
      zipcode: direccion.zipcode,
      isdefault: direccion.isdefault,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta dirección?",
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      var urlBase = getEndPoint("/api/address/" + id);

      const response = await fetch(urlBase, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la dirección");
      }

      const data = await response.json();

      alert("Dirección eliminada correctamente");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al eliminar la dirección: " + error);
    } finally {
      setLoading(false);
    }
    setmockAddresses(mockAddresses.filter((addr) => addr.id !== id));
  };

  async function enviaDatos() {
    console.log("DATOS ENVIADOS: ", JSON.stringify(form));
    const resultado = await handleSubmit();
    setShowAddForm(false);
    reload();
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);
      var urlBase = getEndPoint("/api/address");
      var metodo = "POST";
      if (form.id) {
        urlBase = urlBase + "/" + form.id;
        metodo = "PUT";
      }

      const response = await fetch(urlBase, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Error al guardar dirección");
      }

      const data = await response.json();

      console.log("Dirección creada:", data);

      alert("Dirección guardada correctamente");

      setForm({
        id: "",
        id_user: userId,
        tipo: "Casa",
        street: "",
        neighborhood: "",
        city: "",
        state: "",
        zipcode: "",
        isdefault: false,
      });
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
          <h2 className="text-2xl font-bold text-gray-900">Mis Direcciones</h2>
          <p className="text-gray-600 mt-1">
            Administra tus direcciones de envío
          </p>
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
        {mockAddresses.map((address) => (
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
                  checked={address.isdefault}
                  onChange={() => handleSetDefault(address.id)}
                  className="size-4 text-blue-600 cursor-pointer"
                />
              </div>

              {/* Icon */}
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  address.isdefault
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {getTypeIcon(address.tipo)}
              </div>

              {/* Address Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {address.tipo}
                  </h3>
                  {address.isdefault && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                      Predeterminada
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 text-sm text-gray-600">
                  <p>
                    {address.street}, {address.neighborhood}
                  </p>
                  <p>
                    {address.city}, {address.state}
                  </p>
                  <p>C.P. {address.zipcode}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => editaDireccion(address.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Nueva Dirección
            </h3>

            <div className="space-y-4">
              {/* ========================================== */}
              <select
                required
                value={form.tipo}
                onChange={
                  (e) =>
                    setForm({
                      ...form,
                      tipo: e.target.value as "Casa" | "Trabajo" | "Otro",
                    }) // 👈 propiedad correcta
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un tipo</option>
                {tipos.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {/* ========================================== */}

              <input
                type="text"
                placeholder="Calle y Número"
                name="street"
                value={form.street}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="text"
                placeholder="Colonia o asentamiento"
                name="neighborhood"
                value={form.neighborhood}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Estado"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="zipcode"
                  value={form.zipcode}
                  onChange={handleChange}
                  placeholder="Código Postal"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  // onClick={() => setShowAddForm(true)}
                  onClick={() => enviaDatos()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {mockAddresses.length === 0 && (
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
