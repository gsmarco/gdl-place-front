import { useState } from 'react';
import { useNavigate } from 'react-router';
import { validateEmail } from "../../components/validateEmail";
import { useBuyerAuth } from '../../contexts/BuyerAuthContext';
import { Store, Mail, Phone, MapPin, User, Building, Lock, Eye, EyeOff } from 'lucide-react';
import { Category } from '@mui/icons-material';

export function SellerRegister() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { register_seller } = useBuyerAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    address: '',
    phone: '',
    city: '',
    category: '',
    description: '',
    password: '',
    confirmPassword: '',
  });

    const validateField = (name: string, value: string) => {
    switch (name) {
      case 'bussinnesName':
        if (!value) return 'El nombre del negocio requerido';
        return '';
      case 'ownerName':
        if (!value) return 'El nombre del propietario es requerido';
        return '';
      case 'email':
        if (!value) return 'El correo es requerido';
        if (!validateEmail(value)) return 'Correo inválido';
        return '';
      case 'password':
        if (!value) return 'El password es requerido';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return '';
      case 'confirmPassword':
        if (!value) return 'ConfirmPassword es requerido';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return '';
      case 'phone':
        if (!value) return 'El teléfono es requerido';
        if (value.length < 10) return 'Mínimo 10 caracteres';
        return '';
      case 'address':
        if (!value) return 'La Dirección es requerida';
        return '';
      case 'city':
        if (!value) return 'La ciudad es requerida';
        return '';
      case 'category':
        if (!value) return 'La Categoría es requerida';
        if (value.length < 5) return 'Mínimo 10 caracteres';
        return '';
      case 'description':
        if (!value) return 'La descripción es requerida';
        return '';
 
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;        
      }
    });

    setTouched({ bussinesName: true, ownerName: true, email: true, address: true, phone: true, city: true, category: true, description: true, password: true, confirmPassword: true });

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        await register_seller(
          formData.businessName,
          formData.ownerName,
          formData.email,
          formData.address,
          formData.phone,
          formData.city,
          formData.category,
          formData.description,
          formData.password,
        );
        navigate('/');
      } catch (error) {
        alert("Error al crear los datos del negocio. Intenta de nuevo.");
        setErrors({ submit: 'Error al crear los datos del negocio. Intenta de nuevo.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Store className="size-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Conviértete en Vendedor
            </h1>
            <p className="text-gray-600">
              Únete a nuestra comunidad y comienza a vender tus productos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-8">
            <div className="space-y-6">
              {/* Business Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="size-5 text-blue-600" />
                  Información del Negocio
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Negocio *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Mi Tienda Local"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría Principal *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="electronics">Electrónica</option>
                      <option value="fashion">Moda y Accesorios</option>
                      <option value="home">Hogar y Decoración</option>
                      <option value="sports">Deportes</option>
                      <option value="books">Libros</option>
                      <option value="other">Otros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción del Negocio *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Describe brevemente tu negocio y los productos que vendes..."
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="size-5 text-blue-600" />
                  Información Personal
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ownerName}
                      onChange={(e) => updateField('ownerName', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="juan@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Contraseña"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirmar Contraseña"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="pt-6 border-t">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="size-5 text-blue-600" />
                  Ubicación
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Calle Principal 123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ciudad"
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="pt-6 border-t">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto los <a href="#" className="text-blue-600 hover:underline">términos y condiciones</a> y la <a href="#" className="text-blue-600 hover:underline">política de privacidad</a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Crear Cuenta de Vendedor
              </button>

              <p className="text-center text-sm text-gray-600">
                ¿Ya tienes una cuenta? <a href="/seller/login" className="text-blue-600 hover:underline">Inicia sesión</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

