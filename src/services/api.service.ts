import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import type { User, UpdateUserData } from '@/types/user';
import type { Booking } from '@/types/api.types';

const API_URL = 'http://localhost:3001/api';

// Configurar interceptor para añadir el token desde Zustand
axios.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuth.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Función auxiliar para transformar los datos
const transformBookingData = (booking: any): Booking => {
  return {
    ...booking,
    cancha: booking.cancha ? {
      ...booking.cancha,
      precio_hora: Number(booking.cancha.precio_hora) * 1000 // Convertir a miles
    } : null
  };
};

export const apiService = {
  // Usuarios
  async getUsers() {
    const response = await axios.get(`${API_URL}/usuarios`);
    return response.data;
  },

  async getUserProfile(rut: string) {
    const response = await axios.get(`${API_URL}/usuarios/${rut}`);
    return response.data;
  },

  async createUser(userData: Omit<User, 'id' | 'fecha_registro'>) {
    const response = await axios.post(`${API_URL}/usuarios`, userData);
    return response.data;
  },

  async updateUser(rut: string, userData: UpdateUserData) {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${rut}`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error en updateUser:', error.response?.data);
      }
      throw error;
    }
  },

  async deleteUser(rut: string) {
    try {
      const response = await axios.delete(`${API_URL}/usuarios/${rut}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error en deleteUser:', error.response?.data);
      }
      throw error;
    }
  },

  // Canchas
  async getCourts() {
    const response = await axios.get(`${API_URL}/canchas`);
    return response.data;
  },

  async getCourt(id: number) {
    const response = await axios.get(`${API_URL}/canchas/${id}`);
    return response.data;
  },

  async createCourt(courtData: {
    nombre: string;
    tipo: string;
    ubicacion: string;
    precio_hora: number;
    estado: string;
  }) {
    const response = await axios.post(`${API_URL}/canchas`, courtData);
    return response.data;
  },

  async updateCourt(id: number, courtData: {
    nombre?: string;
    tipo?: string;
    ubicacion?: string;
    precio_hora?: number;
    estado?: string;
  }) {
    const response = await axios.put(`${API_URL}/canchas/${id}`, courtData);
    return response.data;
  },

  async deleteCourt(id: number) {
    const response = await axios.delete(`${API_URL}/canchas/${id}`);
    return response.data;
  },

  // Reservas
  async getBookings(params?: {
    status?: string;
    date?: string;
    courtId?: number;
    userId?: string;
  }) {
    try {
      const response = await axios.get(`${API_URL}/reservas`, { params });
      // Transformar los datos antes de devolverlos
      return Array.isArray(response.data) 
        ? response.data.map(transformBookingData)
        : [];
    } catch (error) {
      console.error('Error en getBookings:', error);
      throw error;
    }
  },

  async createBooking(data: any) {
    const response = await axios.post(`${API_URL}/reservas`, data);
    return response.data;
  },

  // Pagos
  async getPayments(params?: any) {
    const response = await axios.get(`${API_URL}/pagos`, { params });
    return response.data;
  },

  // Estadísticas
  async getDashboardStats() {
    const response = await axios.get(`${API_URL}/estadisticas/dashboard`);
    return response.data;
  },

  // Notificaciones
  async getNotifications() {
    const response = await axios.get(`${API_URL}/notificaciones`);
    return response.data;
  },

  // Manejo de errores genérico
  handleError(error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error en la solicitud');
    }
    throw error;
  }
};