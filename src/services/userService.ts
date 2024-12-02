import { api } from './api';
import { User, UpdateUserData } from '@/types/user';

export const userService = {
  getCurrentUser: async () => {
    const response = await api.get<User>('/usuarios/perfil');
    return response.data;
  },

  updateProfile: async (data: UpdateUserData) => {
    const response = await api.put<User>('/usuarios/perfil', data);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get<User[]>('/usuarios');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get<User>(`/usuarios/${id}`);
    return response.data;
  },

  createUser: async (data: Partial<User>) => {
    const response = await api.post<User>('/usuarios', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await api.put<User>(`/usuarios/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    await api.delete(`/usuarios/${id}`);
  }
};