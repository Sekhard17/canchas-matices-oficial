import { useState, useCallback } from 'react';
import { apiService } from '@/services/api.service';
import { useAuth } from './useAuth';

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();

  const handleRequest = useCallback(async <T>(
    requestFn: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);

      // Si el error es de autenticación, cerrar sesión
      if (errorMessage.includes('401') || errorMessage.includes('no autorizado')) {
        logout();
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  return {
    isLoading,
    error,
    handleRequest
  };
}

// Hooks específicos para cada entidad
export function useBookings() {
  const { handleRequest, isLoading, error } = useApi();

  const getBookings = useCallback(async (params?: {
    status?: string;
    date?: string;
    courtId?: number;
    userId?: string;
  }) => {
    return handleRequest(() => apiService.getBookings(params));
  }, [handleRequest]);

  const updateBookingStatus = useCallback(async (id: number, status: string) => {
    return handleRequest(() => apiService.updateBookingStatus(id, status));
  }, [handleRequest]);

  return {
    getBookings,
    updateBookingStatus,
    isLoading,
    error
  };
}

export function useCourts() {
  const { handleRequest, isLoading, error } = useApi();

  const getCourts = useCallback(async () => {
    return handleRequest(() => apiService.getCourts());
  }, [handleRequest]);

  const getCourtById = useCallback(async (id: number) => {
    return handleRequest(() => apiService.getCourtById(id));
  }, [handleRequest]);

  return {
    getCourts,
    getCourtById,
    isLoading,
    error
  };
}

export function useNotifications() {
  const { handleRequest, isLoading, error } = useApi();
  const { user } = useAuth();

  const getNotifications = useCallback(async () => {
    if (!user?.id) return null;
    return handleRequest(() => apiService.getNotifications(user.id));
  }, [handleRequest, user]);

  const markAsRead = useCallback(async (id: number) => {
    return handleRequest(() => apiService.markNotificationAsRead(id));
  }, [handleRequest]);

  return {
    getNotifications,
    markAsRead,
    isLoading,
    error
  };
}

export function useStats() {
  const { handleRequest, isLoading, error } = useApi();

  const getDashboardStats = useCallback(async () => {
    return handleRequest(() => apiService.getDashboardStats());
  }, [handleRequest]);

  const getBookingSummary = useCallback(async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    return handleRequest(() => apiService.getBookingSummary(params));
  }, [handleRequest]);

  const getRevenueSummary = useCallback(async () => {
    return handleRequest(() => apiService.getRevenueSummary());
  }, [handleRequest]);

  return {
    getDashboardStats,
    getBookingSummary,
    getRevenueSummary,
    isLoading,
    error
  };
}