import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types/api.types';

const ESTADOS_NO_VALIDABLES = ['Realizada', 'Anulada', 'Cancelada'];

export const qrService = {
  async obtenerReservaPorCodigo(input: string): Promise<{ 
    reserva: Booking; 
    mensajeValidacion?: string;
  }> {
    try {
      let codigoReserva: string;

      try {
        const qrData = JSON.parse(input);
        codigoReserva = qrData.code;
      } catch {
        codigoReserva = input;
      }

      const { data: reserva, error } = await supabase
        .from('reservas')
        .select(`
          *,
          cancha:id_cancha (*),
          usuario:rut_usuario (*)
        `)
        .eq('codigo_reserva', codigoReserva)
        .single();

      if (error) throw error;
      if (!reserva) throw new Error('Reserva no encontrada');

      // Validación del estado
      let mensajeValidacion: string | undefined;
      if (ESTADOS_NO_VALIDABLES.includes(reserva.estado)) {
        mensajeValidacion = reserva.estado === 'Realizada'
          ? 'Esta reserva ya fue validada anteriormente'
          : `No se puede validar una reserva en estado: ${reserva.estado}`;
      }

      return { 
        reserva,
        mensajeValidacion 
      };
    } catch (error) {
      console.error('Error obteniendo reserva:', error);
      throw error;
    }
  },

  async validarReserva(idReserva: string): Promise<void> {
    try {
      const { data: reservaActual, error: errorConsulta } = await supabase
        .from('reservas')
        .select('estado')
        .eq('id_reserva', idReserva)
        .single();

      if (errorConsulta) throw errorConsulta;
      if (!reservaActual) throw new Error('Reserva no encontrada');

      // Validación de estados
      if (ESTADOS_NO_VALIDABLES.includes(reservaActual.estado)) {
        if (reservaActual.estado === 'Realizada') {
          throw new Error('Esta reserva ya fue validada anteriormente');
        }
        throw new Error(`No se puede validar una reserva en estado: ${reservaActual.estado}`);
      }

      const { error } = await supabase
        .from('reservas')
        .update({ estado: 'Realizada' })
        .eq('id_reserva', idReserva);

      if (error) throw error;

      // Crear notificación
      const { data: reserva } = await supabase
        .from('reservas')
        .select('*, usuario:rut_usuario (*)')
        .eq('id_reserva', idReserva)
        .single();

      if (reserva) {
        await supabase.from('notificaciones').insert({
          título: 'Reserva Validada',
          mensaje: `Tu reserva con código ${reserva.codigo_reserva} ha sido validada exitosamente.`,
          estado: 'no leído',
          rut_usuario: reserva.rut_usuario
        });
      }
    } catch (error) {
      console.error('Error validando reserva:', error);
      throw error;
    }
  },

  puedeValidarse(estado: string): boolean {
    return !ESTADOS_NO_VALIDABLES.includes(estado);
  }
}; 