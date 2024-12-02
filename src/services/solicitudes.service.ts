import { supabase } from '@/lib/supabase';
import type { Solicitud } from '@/types/api.types';

export const solicitudesService = {
  // Obtener todas las solicitudes
  async obtenerSolicitudes() {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select(`
          *,
          usuarios (
            nombre,
            apellido
          ),
          reservas (
            fecha,
            hora_inicio,
            hora_fin,
            cancha:canchas (
              nombre
            )
          )
        `)
        .order('fecha_solicitud', { ascending: false });

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      throw error;
    }
  },

  // Obtener solicitudes por usuario
  async obtenerSolicitudesPorUsuario(rutUsuario: string) {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select(`
          *,
          reservas (
            fecha,
            hora_inicio,
            hora_fin,
            cancha:canchas (
              nombre
            )
          )
        `)
        .eq('rut_usuario', rutUsuario)
        .order('fecha_solicitud', { ascending: false });

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error al obtener solicitudes del usuario:', error);
      throw error;
    }
  },

  // Crear solicitud
  async crearSolicitud(solicitudData: Partial<Solicitud>) {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .insert([{
          fecha_solicitud: new Date().toISOString(),
          estado_solicitud: 'Pendiente',
          ...solicitudData
        }])
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      throw error;
    }
  },

  // Actualizar estado de solicitud
  async actualizarEstadoSolicitud(idSolicitud: number, estado: string) {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .update({ estado_solicitud: estado })
        .eq('id_solicitud', idSolicitud)
        .select()
        .single();

      if (error) throw error;
      return { data };
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  }
}; 