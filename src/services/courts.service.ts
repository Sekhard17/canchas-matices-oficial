import { supabase } from '@/lib/supabase';
import type { Court } from '@/types/court';

export const courtsService = {
    async getAllCourts(): Promise<Court[]> {
      try {
        const { data, error } = await supabase
          .from('canchas')
          .select(`
            id_cancha,
            nombre,
            tipo,
            precio_hora,
            ubicacion,
            estado
          `)
          .eq('estado', 'Activa')
          .order('nombre');
  
        if (error) throw error;
        return (data || []).map(court => ({
          ...court,
          id_cancha: Number(court.id_cancha)
        }));
      } catch (error) {
        console.error('Error fetching courts:', error);
        throw error;
      }
    }
}; 