import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faEye,
  faEyeSlash,
  faFutbol
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RutInput } from '@/components/ui/RutInput';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rut: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidRut, setIsValidRut] = useState(false);
  const [isSearchingRut, setIsSearchingRut] = useState(false);

  const handleValidRut = async (rut: string) => {
    setIsSearchingRut(true);
    try {
      // Función para validar el dígito verificador
      const validarDV = (rutSinDV: string, dv: string): boolean => {
        const rutRevertido = rutSinDV.split('').reverse();
        let suma = 0;
        let multiplicador = 2;
        
        for (let digit of rutRevertido) {
          suma += parseInt(digit) * multiplicador;
          multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }
        
        const dvEsperado = 11 - (suma % 11);
        let dvCalculado;
        
        // Manejar casos especiales
        if (dvEsperado === 11) dvCalculado = '0';
        else if (dvEsperado === 10) dvCalculado = 'K';
        else dvCalculado = dvEsperado.toString();
        
        // Comparar ignorando mayúsculas/minúsculas
        return dvCalculado.toUpperCase() === dv.toUpperCase();
      };

      // Limpiar el RUT para validación
      const rutLimpio = rut.replace(/\./g, '').replace('-', '');
      const rutSinDV = rutLimpio.slice(0, -1);
      const dv = rutLimpio.slice(-1);

      // Validar longitud y formato básico
      if (rutSinDV.length < 7 || rutSinDV.length > 8) {
        throw new Error('Longitud de RUT inválida');
      }

      // Validar que el cuerpo solo contenga números
      if (!/^\d+$/.test(rutSinDV)) {
        throw new Error('RUT debe contener solo números');
      }

      // Validar que el DV sea número o 'K'
      if (!/^[0-9K]$/i.test(dv)) {
        throw new Error('Dígito verificador debe ser número o K');
      }

      // Validar dígito verificador
      const isValid = validarDV(rutSinDV, dv);
      
      if (!isValid) {
        throw new Error('Dígito verificador inválido');
      }

      setIsValidRut(true);
      toast.success('RUT válido');
    } catch (error) {
      setIsValidRut(false);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al validar RUT');
      }
      console.error('Error validando RUT:', error);
    } finally {
      setIsSearchingRut(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidRut) {
      toast.error('Por favor, ingresa un RUT válido');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://canchas-matices.fly.dev/api/usuarios', {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rut: formData.rut,
        password: formData.password
      });

      if (response.data) {
        toast.success('¡Registro exitoso! Por favor, inicia sesión.');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Error al registrar. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-emerald-500 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faFutbol} className="text-3xl text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Únete a Matices Fútbol
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Crea tu cuenta y comienza a jugar
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Por favor, proporciona datos reales para garantizar la transparencia y seguridad de todos los usuarios.
                Tu información será tratada con confidencialidad.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nombre
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Juan"
                />
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="absolute right-3 top-3.5 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Apellido
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Pérez"
                />
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="absolute right-3 top-3.5 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Correo electrónico
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="tu@ejemplo.com"
                />
                <FontAwesomeIcon 
                  icon={faEnvelope} 
                  className="absolute right-3 top-3.5 text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                RUT
              </label>
              <div className="mt-1">
                <RutInput
                  value={formData.rut}
                  onChange={(value) => setFormData({ ...formData, rut: value })}
                  onValidRut={handleValidRut}
                  isValid={isValidRut}
                  isSearching={isSearchingRut}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Contraseña
              </label>
              <div className="mt-1 relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-emerald-500 hover:text-emerald-400">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;