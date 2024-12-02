import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types/api.types';
import type { Court } from '@/types/court';

// Definir los estados posibles exactamente como están en la base de datos
export type EstadoReserva = 'Realizada' | 'Confirmada' | 'Pendiente' | 'Anulada';

interface CreateBookingData {
  rut: string;
  id_cancha: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: EstadoReserva;
}

interface UserResponse {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string | null;
}

interface AnulacionData {
  id_reserva: number;
  motivo: string;
  requiere_devolucion: boolean;
  monto_devolucion?: number;
}

export const adminBookingsService = {
  async getBookings(params?: {
    fecha?: string;
    id_cancha?: number;
    estado?: string;
  }): Promise<Booking[]> {
    try {
      let query = supabase
        .from('reservas')
        .select(`
          *,
          cancha:canchas (*),
          usuario:usuarios (*)
        `)
        .not('estado', 'eq', 'Anulada')
        .order('hora_inicio');

      // Ajustar el formato de fecha para que coincida con el de la base de datos
      if (params?.fecha) {
        // Asegurarnos de que la fecha esté en formato YYYY-MM-DD
        const fecha = new Date(params.fecha);
        const fechaFormateada = fecha.toISOString().split('T')[0]; // Esto dará YYYY-MM-DD
        query = query.eq('fecha', fechaFormateada);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error en getBookings:', error);
        throw error;
      }

      // Transformar los datos si es necesario
      const bookings = data?.map(booking => ({
        ...booking,
        // Asegurarnos de que las horas estén en formato HH:mm:ss
        hora_inicio: booking.hora_inicio.substring(0, 8), // Tomar solo HH:mm:ss
        hora_fin: booking.hora_fin.substring(0, 8), // Tomar solo HH:mm:ss
      })) || [];

      return bookings;
    } catch (error) {
      console.error('Error en getBookings:', error);
      throw error;
    }
  },

  async getCourts(): Promise<Court[]> {
    try {
      const { data, error } = await supabase
        .from('canchas')
        .select('*')
        .order('id_cancha');

      if (error) {
        console.error('Error en getCourts:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error en getCourts:', error);
      throw error;
    }
  },

  async updateBookingStatus(id: number, estado: string) {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .update({ estado })
        .eq('id_reserva', id)
        .select()
        .single();

      if (error) {
        console.error('Error en updateBookingStatus:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error en updateBookingStatus:', error);
      throw error;
    }
  },

  async deleteBooking(bookingId: number) {
    try {
      const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('id_reserva', bookingId);

      if (error) {
        console.error('Error al eliminar la reserva:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
      throw error;
    }
  },

  async updateBooking(bookingId: number, updateData: {
    hora_inicio: string;
    hora_fin: string;
    id_cancha: number;
    estado: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .update(updateData)
        .eq('id_reserva', bookingId)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar la reserva:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      throw error;
    }
  },

  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      // Formatear la fecha a YYYY-MM-DD
      const fecha = new Date(bookingData.fecha);
      const fechaFormateada = fecha.toISOString().split('T')[0];

      // Asegurarnos de que las horas estén en formato HH:mm:ss
      const horaInicio = bookingData.hora_inicio.length === 5 
        ? `${bookingData.hora_inicio}:00`
        : bookingData.hora_inicio;
      
      const horaFin = bookingData.hora_fin.length === 5 
        ? `${bookingData.hora_fin}:00` 
        : bookingData.hora_fin;

      // Primero obtener el rut_usuario basado en el RUT
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('rut')
        .eq('rut', bookingData.rut)
        .maybeSingle();

      if (userError) throw userError;
      if (!userData) throw new Error('Usuario no encontrado');

      // Crear la reserva usando el rut_usuario
      const { data, error } = await supabase
        .from('reservas')
        .insert([{
          rut_usuario: userData.rut,
          id_cancha: parseInt(bookingData.id_cancha),
          fecha: fechaFormateada,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          estado: bookingData.estado
        }])
        .select(`
          *,
          cancha:canchas (
            id_cancha,
            nombre,
            ubicacion,
            tipo,
            precio_hora,
            estado
          ),
          usuario:usuarios (
            rut,
            nombre,
            apellido,
            correo,
            telefono
          )
        `)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Error al crear la reserva');
      
      return data;
    } catch (error) {
      console.error('Error en createBooking:', error);
      throw error;
    }
  },

  async findUserByRut(rut: string): Promise<UserResponse | null> {
    try {
      // Primero intentamos con el RUT exacto
      const { data, error } = await supabase
        .from('usuarios')
        .select('nombre, apellido, correo, telefono')
        .eq('rut', rut)
        .maybeSingle();

      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }

      // Si encontramos el usuario, lo retornamos
      if (data) return data;

      // Si no, intentamos una búsqueda sin formato
      const rutSinFormato = rut.replace(/\./g, '').replace(/-/g, '');
      
      const { data: secondTry } = await supabase
        .from('usuarios')
        .select('nombre, apellido, correo, telefono')
        .eq('rut', rutSinFormato)
        .maybeSingle();

      console.log('RUT a buscar:', rutSinFormato); // Debug
      return secondTry;

    } catch (error) {
      console.error('Error al buscar usuario por RUT:', error);
      return null;
    }
  },

  async voidBooking(bookingId: number, anulacionData: AnulacionData) {
    try {
      // 1. Obtener la información de la reserva y su pago
      const { data: booking, error: bookingError } = await supabase
        .from('reservas')
        .select(`
          *,
          cancha:canchas (
            id_cancha,
            nombre,
            tipo,
            precio_hora
          ),
          pagos (*)
        `)
        .eq('id_reserva', bookingId)
        .single();

      if (bookingError) throw bookingError;

      // 2. Actualizar estado de la reserva a 'Anulada'
      const { data: updatedBooking, error: updateError } = await supabase
        .from('reservas')
        .update({ estado: 'Anulada' })
        .eq('id_reserva', bookingId)
        .select()
        .single();

      if (updateError) throw updateError;

      // 3. Crear registro de anulación
      const { error: anulacionError } = await supabase
        .from('anulaciones')
        .insert({
          id_reserva: bookingId,
          motivo: anulacionData.motivo,
          requiere_devolucion: anulacionData.requiere_devolucion,
          monto_devolucion: anulacionData.requiere_devolucion ? booking.pagos[0].monto : null
        });

      if (anulacionError) throw anulacionError;

      // 4. Crear ajuste en ganancias si hay devolución
      if (anulacionData.requiere_devolucion) {
        const { error: gananciaError } = await supabase
          .from('ganancias')
          .insert({
            numero_reservas: -1,
            periodo: new Date().toISOString().slice(0, 7),
            monto_total: -booking.pagos[0].monto,
            fecha: new Date()
          });

        if (gananciaError) throw gananciaError;
      }

      return updatedBooking;
    } catch (error) {
      console.error('Error en voidBooking:', error);
      throw error;
    }
  }
}; 