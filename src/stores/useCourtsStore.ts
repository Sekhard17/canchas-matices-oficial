// Importaciones necesarias
import { create } from 'zustand'; // Librería para manejo de estado global
import { apiService } from '@/services/api.service';
import type { Court } from '@/types/court';

// Interface que define la estructura de datos necesaria para crear una nueva cancha
interface CreateCourtData {
  nombre: string;     // Nombre de la cancha
  tipo: string;       // Tipo de cancha (ej: fútbol, tenis, etc.)
  ubicacion: string;  // Ubicación física de la cancha
  precio_hora: number; // Precio por hora de uso
  estado: string;     // Estado de la cancha (ej: disponible, en mantenimiento)
}

// Interface para actualizaciones parciales de una cancha
// Permite actualizar solo algunos campos usando Partial<T>
type UpdateCourtData = Partial<CreateCourtData>;

// Interface principal que define la estructura del store
interface CourtsStore {
  courts: Court[];                // Array de canchas
  loading: boolean;               // Estado de carga
  error: string | null;           // Mensaje de error si existe
  fetchCourts: () => Promise<void>; // Función para obtener todas las canchas
  createCourt: (courtData: CreateCourtData) => Promise<void>; // Crear cancha
  updateCourt: (id: number, courtData: UpdateCourtData) => Promise<void>; // Actualizar cancha
  deleteCourt: (id: number) => Promise<void>; // Eliminar cancha
}

// Creación del store usando Zustand
export const useCourtsStore = create<CourtsStore>((set) => ({
  // Estado inicial
  courts: [],
  loading: false,
  error: null,

  // Función para obtener todas las canchas
  fetchCourts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getCourts();
      // Asegura que el precio_hora sea un número y nunca null
      const courts = Array.isArray(response) ? response.map(court => ({
        ...court,
        precio_hora: court.precio_hora === null ? 0 : Number(court.precio_hora)
      })) : [];
      set({ courts, loading: false });
    } catch (error) {
      console.error('Error al cargar canchas:', error);
      set({ error: 'Error al cargar las canchas', loading: false, courts: [] });
    }
  },

  // Función para crear una nueva cancha
  createCourt: async (courtData: CreateCourtData) => {
    set({ loading: true, error: null });
    try {
      // Asegura que precio_hora sea un número
      const dataToSend = {
        ...courtData,
        precio_hora: Number(courtData.precio_hora) || 0
      };
      const newCourt = await apiService.createCourt(dataToSend);
      // Actualiza el estado añadiendo la nueva cancha
      set(state => ({ 
        courts: [...state.courts, newCourt],
        loading: false 
      }));
      return newCourt;
    } catch (error) {
      console.error('Error al crear cancha:', error);
      set({ error: 'Error al crear la cancha', loading: false });
      throw error;
    }
  },

  // Función para actualizar una cancha existente
  updateCourt: async (id: number, courtData: UpdateCourtData) => {
    set({ loading: true, error: null });
    try {
      const dataToSend = {
        ...courtData,
        precio_hora: courtData.precio_hora !== undefined 
          ? Number(courtData.precio_hora) 
          : 0
      };
      const updatedCourt = await apiService.updateCourt(id, dataToSend);
      // Actualiza el estado reemplazando la cancha actualizada
      set(state => ({
        courts: state.courts.map(court => 
          court.id_cancha === id ? updatedCourt : court
        ),
        loading: false
      }));
      return updatedCourt;
    } catch (error) {
      console.error('Error al actualizar cancha:', error);
      set({ error: 'Error al actualizar la cancha', loading: false });
      throw error;
    }
  },

  // Función para eliminar una cancha
  deleteCourt: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await apiService.deleteCourt(id);
      // Actualiza el estado eliminando la cancha
      set(state => ({
        courts: state.courts.filter(court => court.id_cancha !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error al eliminar cancha:', error);
      set({ error: 'Error al eliminar la cancha', loading: false });
      throw error;
    }
  },
}));