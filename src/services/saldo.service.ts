import { supabase } from '@/lib/supabase';

export const saldoService = {
  async obtenerTotalGastado(rutUsuario: string): Promise<number> {
    try {
      console.log('Calculando total para usuario:', rutUsuario);
      
      const { data, error } = await supabase
        .from('pagos')
        .select('monto')
        .eq('rut_usuario', rutUsuario)
        .eq('estado', 'procesado');

      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }

      console.log('Pagos encontrados:', data);

      const totalGastado = data.reduce((total, pago) => {
        return total + Number(pago.monto);
      }, 0);

      console.log('Total calculado:', totalGastado);
      return totalGastado;
    } catch (error) {
      console.error('Error obteniendo total gastado:', error);
      return 0;
    }
  }
}; 