import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Store, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
//import api from '../../../api/axios'; // ajusta ruta si es necesario
import axios from 'axios';

const apiUrl = import.meta.env.VITE_APP_API_URL;      

const api = axios.create({
    baseURL: apiUrl, // Nuestro backend Nest
});

export function SellerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Validación de email en tiempo real
  const validateEmail = (email: string): string => {
    if (!email) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Formato de email inválido';
    }
    return '';
  };

  // Validación de contraseña en tiempo real
  const validatePassword = (password: string): string => {
    if (!password) return '';
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  // Actualizar campo y validar
  const updateField = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setLoginError('');
    
    // Validar en tiempo real solo si el campo ha sido tocado
    if (touched[field]) {
      const error = field === 'email' ? validateEmail(value) : validatePassword(value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  // Marcar campo como tocado y validar
  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = field === 'email' 
      ? validateEmail(formData[field]) 
      : validatePassword(formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Verificar si el formulario es válido
  const isFormValid = () => {
    return formData.email && 
           formData.password && 
           !validateEmail(formData.email) && 
           !validatePassword(formData.password);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setTouched({ email: true, password: true });

  const emailError = validateEmail(formData.email);
  const passwordError = validatePassword(formData.password);

  if (emailError || passwordError) {
    setErrors({ email: emailError, password: passwordError });
    return;
  }

  try {
    setIsLoading(true);
    setLoginError('');
    
    let apiUrl = import.meta.env.VITE_APP_API_URL;   
    apiUrl = `${apiUrl}/api/login`
    apiUrl = "https://gdl-place-backend.onrender.com/api/login"

    // const response = await axios.post("http://127.0.0.1:3000/api/login", {
    const response = await axios.post(apiUrl, {
      email: formData.email,
      password: formData.password
    });

    console.log(response.data);

    if (response.status != 200) { 
      alert("Credenciales inválidas");
      return 'Credenciales inválidas';      
    } 
    
    const { access_token, user } = response.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    navigate('/seller/dashboard');

  } catch (error: any) {
    alert(error);
    setLoginError(
      error.response?.data?.message || 'Error al iniciar sesión'
    );
  } finally {
    setIsLoading(false);
  }
};      

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header con animación */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
            className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          >
            <Store className="size-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inicia Sesión
          </h1>
          <p className="text-gray-600">
            Accede a tu panel de vendedor
          </p>
        </motion.div>

        {/* Formulario con animación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border shadow-sm p-8 space-y-6">
            {/* Error general de login */}
            <AnimatePresence>
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
                >
                  <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Campo de Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400 transition-colors" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email && touched.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : formData.email && !errors.email && touched.email
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="vendedor@example.com"
                />
                {/* Indicador de validación */}
                <AnimatePresence>
                  {touched.email && formData.email && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {errors.email ? (
                        <AlertCircle className="size-5 text-red-500" />
                      ) : (
                        <CheckCircle2 className="size-5 text-green-500" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Mensaje de error */}
              <AnimatePresence>
                {errors.email && touched.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="size-4" />
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Campo de Contraseña */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Link 
                  to="/seller/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full pl-11 pr-11 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password && touched.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : formData.password && !errors.password && touched.password
                      ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="••••••••"
                />
                {/* Botón para mostrar/ocultar contraseña */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
              {/* Mensaje de error */}
              <AnimatePresence>
                {errors.password && touched.password && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1"
                  >
                    <AlertCircle className="size-4" />
                    {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Recordarme */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
                Recordarme en este dispositivo
              </label>
            </div>

            {/* Botón de submit con animación */}
            <motion.button
              type="submit"
              disabled={!isFormValid() || isLoading}
              whileHover={isFormValid() && !isLoading ? { scale: 1.02 } : {}}
              whileTap={isFormValid() && !isLoading ? { scale: 0.98 } : {}}
              className={`w-full py-3 rounded-lg font-medium text-lg transition-all ${
                isFormValid() && !isLoading
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="size-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">o</span>
              </div>
            </div>

            {/* Link a registro */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                ¿Aún no tienes una cuenta?{' '}
                <Link 
                  to="/seller/register" 
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Regístrate como vendedor
                </Link>
              </p>
            </div>
          </form>

          {/* Info de credenciales de prueba */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg"
          >
            <p className="text-sm text-blue-800 font-medium mb-1">Credenciales de prueba:</p>
            <p className="text-sm text-blue-700">Email: vendedor@example.com</p>
            <p className="text-sm text-blue-700">Contraseña: password</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
