// Importaciones necesarias
import { create } from 'zustand';
import { apiService } from '@/services/api.service';
import type { User, CreateUserData, UpdateUserData } from '@/types/user';

// Definición de la interfaz que describe la estructura del store
interface UsersStore {
  users: User[];          // Array que almacena la lista de usuarios
  loading: boolean;       // Estado de carga para operaciones asíncronas
  error: string | null;   // Almacena mensajes de error si algo falla
  fetchUsers: () => Promise<void>;    // Función para obtener usuarios
  createUser: (userData: CreateUserData) => Promise<void>;    // Función para crear usuario
  updateUser: (rut: string, userData: UpdateUserData) => Promise<void>;    // Función para actualizar usuario
  deleteUser: (rut: string) => Promise<void>;    // Función para eliminar usuario
}

// Creación del store usando Zustand
export const useUsersStore = create<UsersStore>((set) => ({
  // Estado inicial
  users: [],
  loading: false,
  error: null,

  // Obtiene todos los usuarios del servidor
  fetchUsers: async () => {
    set({ loading: true, error: null });  // Inicia el estado de carga
    try {
      const users = await apiService.getUsers();
      set({ users, loading: false });     // Actualiza el estado con los usuarios obtenidos
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ error: 'Error al cargar usuarios', loading: false });
    }
  },

  // Crea un nuevo usuario
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      // Crea el usuario y maneja el caso especial del teléfono
      const newUser = await apiService.createUser({
        ...userData,
        telefono: userData.telefono || null
      });
      // Añade el nuevo usuario al array existente
      set(state => ({
        users: [...state.users, newUser],
        loading: false
      }));
    } catch (error) {
      console.error('Error creating user:', error);
      set({ error: 'Error al crear usuario', loading: false });
      throw error;  // Propaga el error para manejarlo en el componente
    }
  },

  // Actualiza un usuario existente
  updateUser: async (rut, userData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await apiService.updateUser(rut, userData);
      // Actualiza el usuario específico en el array
      set(state => ({
        users: state.users.map(user => 
          user.rut === rut ? updatedUser : user
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating user:', error);
      set({ error: 'Error al actualizar usuario', loading: false });
      throw error;
    }
  },

  // Elimina un usuario
  deleteUser: async (rut) => {
    set({ loading: true, error: null });
    try {
      await apiService.deleteUser(rut);
      // Filtra el usuario eliminado del array
      set(state => ({
        users: state.users.filter(user => user.rut !== rut),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting user:', error);
      set({ error: 'Error al eliminar usuario', loading: false });
      throw error;
    }
  }
}));