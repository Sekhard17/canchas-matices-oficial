import { supabase } from '@/lib/supabase';

// Definición de la estructura de datos para las estadísticas
interface Estadisticas {
  stats: {
    usuariosActivos: number;
    reservasMes: number;
    reservasHoy: number;
    ingresosMensuales: number;
    canchaMasReservada: string;
    porcentajeReservas: string;
  };
  graficos: {
    ingresosPorMes: Array<{ name: string; value: number }>;
    distribucionReservas: Array<{ name: string; value: number }>;
  };
}

// Interfaces auxiliares para tipar los datos de Supabase
interface Cancha {
  id_cancha: number;
  nombre: string;
  tipo: string;
}

interface Reserva {
  id_cancha: number;
}

interface Pago {
  monto: number;
  fecha_pago: string;
}

export const adminService = {
  async obtenerEstadisticas(): Promise<Estadisticas> {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(1); // Primer día del mes actual
      const hoy = new Date().toISOString().split('T')[0];

      // Realizar todas las consultas en paralelo
      const [
        usuariosActivosResult,
        reservasMesResult,
        reservasHoyResult,
        pagosMesResult,
        { data: canchas },
        { data: reservas }
      ] = await Promise.all([
        // Usuarios activos
        supabase.from('usuarios').select('*', { count: 'exact' }).eq('estado', 'Activo'),
        // Reservas del mes
        supabase.from('reservas').select('*', { count: 'exact' }).gte('fecha', fechaInicio.toISOString()).eq('estado', 'Confirmada'),
        // Reservas de hoy
        supabase.from('reservas').select('*', { count: 'exact' }).eq('fecha', hoy).eq('estado', 'Confirmada'),
        // Pagos del mes
        supabase.from('pagos').select('monto, fecha_pago').gte('fecha_pago', fechaInicio.toISOString()).eq('estado', 'procesado'),
        // Todas las canchas
        supabase.from('canchas').select('*'),
        // Todas las reservas del mes para distribución
        supabase.from('reservas').select('id_cancha').gte('fecha', fechaInicio.toISOString()).eq('estado', 'Confirmada')
      ]);

      // Procesar distribución de reservas
      const distribucionReservas = (reservas as Reserva[] || []).reduce((acc: Record<number, number>, reserva) => {
        acc[reserva.id_cancha] = (acc[reserva.id_cancha] || 0) + 1;
        return acc;
      }, {});

      // Encontrar cancha más reservada
      let canchaMasReservada = 'Sin datos';
      let cantidadReservas = 0;
      if (canchas && canchas.length > 0) {
        const [idCanchaMasReservada, cantidad] = Object.entries(distribucionReservas).reduce(
          (max, [id, count]) => count > max[1] ? [Number(id), count] : max,
          [0, 0]
        );
        const cancha = (canchas as Cancha[]).find(c => c.id_cancha === idCanchaMasReservada);
        if (cancha) {
          canchaMasReservada = cancha.nombre;
          cantidadReservas = cantidad;
        }
      }

      // Calcular porcentaje de reservas
      const totalReservas = reservasMesResult.count || 0;
      const porcentaje = totalReservas > 0 ? Math.round((cantidadReservas / totalReservas) * 100) : 0;

      // Procesar ingresos mensuales
      const ingresosPorMes = (pagosMesResult.data as Pago[] || []).reduce((acc: Record<string, number>, pago) => {
        const mes = new Date(pago.fecha_pago).toLocaleString('es-ES', { month: 'long' });
        acc[mes] = (acc[mes] || 0) + Number(pago.monto);
        return acc;
      }, {});

      // Preparar datos para gráficos
      const distribucionReservasData = (canchas as Cancha[] || []).map(cancha => ({
        name: cancha.tipo,
        value: distribucionReservas[cancha.id_cancha] || 0
      }));

      return {
        stats: {
          usuariosActivos: usuariosActivosResult.count || 0,
          reservasMes: reservasMesResult.count || 0,
          reservasHoy: reservasHoyResult.count || 0,
          ingresosMensuales: Object.values(ingresosPorMes).reduce((a, b) => a + b, 0),
          canchaMasReservada,
          porcentajeReservas: `${porcentaje}% del total`
        },
        graficos: {
          ingresosPorMes: Object.entries(ingresosPorMes).map(([name, value]) => ({ name, value })),
          distribucionReservas: distribucionReservasData
        }
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};

