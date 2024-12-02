import { supabase } from '@/lib/supabase';

export interface Booking {
  id_reserva: number;
  rut_usuario: string;
  id_cancha: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  codigo_reserva: string;
  codigo_qr?: string;
  cancha: {
    id_cancha: number;
    nombre: string;
    ubicacion: string;
    tipo: string;
    precio_hora: number;
    estado: string;
  };
}

export const bookingsService = {
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          cancha:canchas (
            id_cancha,
            nombre,
            ubicacion,
            tipo,
            precio_hora,
            estado
          )
        `)
        .eq('rut_usuario', userId)
        .order('fecha', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      console.log('Bookings data:', data); // Para debug
      return data || [];
    } catch (error) {
      console.error('Error in getUserBookings:', error);
      throw error;
    }
  }
}; 