import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  rol: 'Administrador' | 'Encargado' | 'Cliente';
  nombre: string;
  apellido: string;
  correo: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (user: User) => void;
}

// Función auxiliar para decodificar texto con caracteres especiales
const decodeText = (text: string): string => {
  try {
    return decodeURIComponent(escape(text));
  } catch {
    return text;
  }
};

// Función auxiliar para mapear roles
const mapRole = (role: string): 'Administrador' | 'Encargado' | 'Cliente' => {
  const roleMap: { [key: string]: 'Administrador' | 'Encargado' | 'Cliente' } = {
    'administrador': 'Administrador',
    'admin': 'Administrador',
    'encargado': 'Encargado',
    'staff': 'Encargado',
    'cliente': 'Cliente',
    'user': 'Cliente',
    'usuario': 'Cliente'
  };

  const normalizedRole = role.toLowerCase().trim();
  return roleMap[normalizedRole] || 'Cliente';
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: async (token: string) => {
        try {
          // Decodificar el token
          const decoded = JSON.parse(atob(token.split('.')[1]));
          
          // Validar que el token tenga la información necesaria
          if (!decoded.id || !decoded.rol || !decoded.nombre || !decoded.apellido || !decoded.correo) {
            throw new Error('Token inválido');
          }

          // Mapear el rol correctamente y decodificar caracteres especiales
          const mappedRole = mapRole(decoded.rol);
          const nombre = decodeText(decoded.nombre);
          const apellido = decodeText(decoded.apellido);

          // Crear objeto de usuario
          const user: User = {
            id: decoded.id,
            rol: mappedRole,
            nombre,
            apellido,
            correo: decoded.correo
          };

          // Configurar el token en axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Actualizar el estado
          set({ token, user, isAuthenticated: true });
        } catch (error) {
          console.error('Error al decodificar token:', error);
          get().logout();
          throw error;
        }
      },

      logout: () => {
        // Limpiar el token de axios
        delete axios.defaults.headers.common['Authorization'];
        // Limpiar el estado
        set({ token: null, user: null, isAuthenticated: false });
        // Limpiar localStorage
        localStorage.removeItem('auth-storage');
        // Redirigir al login sin usar window.location
        // La redirección se manejará en el componente
      },

      checkAuth: async () => {
        try {
          const storedData = localStorage.getItem('auth-storage');
          if (!storedData) {
            get().logout();
            return;
          }

          const { state } = JSON.parse(storedData);
          if (!state.token) {
            get().logout();
            return;
          }

          // Verificar el token
          try {
            const decoded = JSON.parse(atob(state.token.split('.')[1]));
            
            if (!decoded || !decoded.id || !decoded.rol) {
              throw new Error('Token inválido');
            }

            // Mapear el rol correctamente y decodificar caracteres especiales
            const mappedRole = mapRole(decoded.rol);
            const nombre = decodeText(decoded.nombre);
            const apellido = decodeText(decoded.apellido);

            // Configurar el token en axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;

            // Actualizar el estado con los datos del token
            set({ 
              token: state.token,
              user: {
                id: decoded.id,
                rol: mappedRole,
                nombre,
                apellido,
                correo: decoded.correo
              },
              isAuthenticated: true
            });
          } catch (error) {
            console.error('Error validando token:', error);
            get().logout();
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          get().logout();
        }
      },

      updateProfile: (user: User) => {
        set({ user });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);