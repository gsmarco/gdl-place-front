import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Save, Edit2 } from "lucide-react";
import { useBuyerAuth } from "../../../contexts/BuyerAuthContext";
import { getEndPoint } from "../../../components/global";
import { useVerificaToken } from "../../../components/VerificaToken";
import FormateadorMoneda from "../../../components/formateaNumero";

interface EstadisticasCompras {
  num_compras: number;
  total_comprado: number;
}

export function ProfileInfo() {
  const { token, expired, userId, email } = useVerificaToken();
  if (!token) return;

  const { user } = useBuyerAuth();

  const baseUrl = getEndPoint("");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [numCompras, setNumCompras] = useState(0);
  const [totalCompras, setTotalCompras] = useState(0);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    email_ant: user?.email || "",
  });

  const date_created = user?.date_created;

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  async function cargarDatosIniciales() {
    await cargarEstadisticas();

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      setFormData({
        name: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        email_ant: parsed.email || "",
      });
    }
  }

  async function cargarEstadisticas() {
    try {
      const estadisticas = await leeEstadisticas();

      setNumCompras(estadisticas.num_compras);
      setTotalCompras(estadisticas.total_comprado);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  }

  async function leeEstadisticas(): Promise<EstadisticasCompras> {
    const apiUrl = `${baseUrl}/api/estadisticas/${userId}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar estadísticas");
    }

    return await response.json();
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      const response = await fetch(`${baseUrl}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const data = await response.json();

      const updatedUser = {
        ...user,
        ...data,
        ...formData,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("No se pudo actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mi Información</h2>
          <p className="text-gray-600 mt-1">
            Administra tu información personal
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Edit2 className="size-4" />
          {isEditing ? "Cancelar" : "Editar"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border p-6"
      >
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                placeholder="123-456-7890"
                className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="size-4" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Account Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Cuenta creada</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {date_created}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">
            Número de compras
          </p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            <FormateadorMoneda valor={numCompras} tipo="entero" />
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">
            Total de compras
          </p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            <FormateadorMoneda valor={totalCompras} />
          </p>
        </div>
      </div>
    </div>
  );
}
