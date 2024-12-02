import { supabase } from '@/lib/supabase';
import type { BookingData } from '@/pages/booking/BookingPage';
import { generateQR } from '@/utils/qr';

export const cashBookingService = {
  async createCashBooking(
    bookingData: BookingData,
    userId: string
  ) {
    try {
      // Validación inicial del precio
      if (!bookingData.court?.price) {
        throw new Error('El precio de la cancha es requerido');
      }

      // Validar que el precio sea uno de los valores permitidos
      const preciosPermitidos = [20, 25]; // precios base permitidos
      const precioBase = Number(bookingData.court.price);
      
      if (!preciosPermitidos.includes(precioBase)) {
        throw new Error(`Precio no válido: ${precioBase}. Los precios permitidos son: ${preciosPermitidos.join(', ')}`);
      }

      // Convertir a miles (20 -> 20000, 25 -> 25000)
      const montoFinal = precioBase * 1000;

      // 1. Generar código de reserva único
      const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // 2. Generar QR con los datos de la reserva
      const qrData = {
        code: bookingCode,
        userId,
        courtId: bookingData.court?.id,
        date: bookingData.date?.toISOString(),
        time: bookingData.time
      };
      const qrUrl = await generateQR(JSON.stringify(qrData));

      // 3. Calcular hora_fin sumando 1 hora a hora_inicio
      const calcularHoraFin = (horaInicio: string): string => {
        const [horas, minutos] = horaInicio.split(':').map(Number);
        const nuevaHora = (horas + 1) % 24;
        return `${nuevaHora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      };

      // 4. Crear la reserva (sin monto)
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          fecha: bookingData.date,
          hora_inicio: bookingData.time?.slice(0, 5),
          hora_fin: calcularHoraFin(bookingData.time || ''),
          estado: 'Confirmada',
          id_cancha: bookingData.court?.id,
          rut_usuario: userId,
          codigo_reserva: bookingCode,
          codigo_qr: qrUrl
        })
        .select()
        .single();

      if (reservaError) throw reservaError;

      // 5. Registrar la ganancia
      const { data: ganancia, error: gananciaError } = await supabase
        .from('ganancias')
        .insert({
          numero_reservas: 1,
          periodo: new Date().toISOString().slice(0, 7),
          monto_total: montoFinal,
          fecha: new Date()
        })
        .select()
        .single();

      if (gananciaError) throw gananciaError;

      // 6. Registrar el pago
      const { data: pago, error: pagoError } = await supabase
        .from('pagos')
        .insert({
          monto: montoFinal,
          fecha_pago: new Date(),
          metodo_pago: 'efectivo',
          estado: 'procesado',
          id_reserva: reserva.id_reserva,
          id_ganancia: ganancia.id_ganancia,
          rut_usuario: userId,
          metadata: {
            booking_code: bookingCode,
            qr_url: qrUrl
          }
        })
        .select()
        .single();

      if (pagoError) throw pagoError;

      // 7. Crear notificación para el usuario
      await supabase.from('notificaciones').insert({
        título: '¡Reserva Confirmada!',
        mensaje: `Tu reserva para ${bookingData.court?.name} el día ${bookingData.date?.toLocaleDateString()} a las ${bookingData.time} ha sido confirmada. Código: ${bookingCode}`,
        estado: 'no leído',
        rut_usuario: userId
      });

      return {
        success: true,
        bookingCode,
        qrUrl,
        payment: pago
      };
    } catch (error) {
      console.error('Error en el proceso de reserva en efectivo:', error);
      throw error;
    }
  },
  async findUserByRut(rut: string): Promise<{
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
  } | null> {
    try {
      // Buscar directamente con el RUT formateado
      const { data, error } = await supabase
        .from('usuarios')
        .select('nombre, apellido, correo, telefono')
        .eq('rut', rut)  // Usar el RUT con formato
        .maybeSingle();

      if (error) {
        console.error('Error en la consulta:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error al buscar usuario por RUT:', error);
      return null;
    }
  }
}; 