import { supabase } from '@/lib/supabase';
import type { PaymentFormData } from '@/types/payment';
import type { BookingData } from '@/pages/booking/BookingPage';
import { generateQR } from '@/utils/qr';

export const paymentService = {
  async createPayment(
    paymentData: PaymentFormData,
    bookingData: BookingData,
    userId: string
  ) {
    try {
      // Verificar que bookingData.date esté definido
      if (!bookingData.date) {
        throw new Error('La fecha de reserva (bookingData.date) es indefinida.');
      }

      // Verificar que bookingData.time esté definido
      if (!bookingData.time) {
        throw new Error('La hora de reserva (bookingData.time) es indefinida.');
      }

      // 1. Generar un código de reserva único
      const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // 2. Generar el QR con los datos de la reserva
      const qrData = {
        code: bookingCode,
        userId,
        courtId: bookingData.court?.id,
        date: bookingData.date.toISOString(),
        time: bookingData.time
      };
      const qrUrl = await generateQR(JSON.stringify(qrData));

      // 3. Calcular hora_fin sumando 1 hora a hora_inicio
      const calcularHoraFin = (horaInicio: string): string => {
        // Convertir la hora a números, tomando solo horas y minutos
        const [horas, minutos] = horaInicio.split(':').map(Number);
        
        // Sumar una hora y manejar el ciclo de 24 horas
        const nuevaHora = (horas + 1) % 24;
        
        // Formatear la hora de vuelta a string con padding de ceros, solo HH:mm
        return `${nuevaHora.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
      };

      // 4. Crear la reserva
      const { data: reserva, error: reservaError } = await supabase
        .from('reservas')
        .insert({
          fecha: bookingData.date,
          hora_inicio: bookingData.time.slice(0, 5), // Solo toma HH:mm
          hora_fin: calcularHoraFin(bookingData.time),
          estado: 'Confirmada', // Asegúrate de que está en minúsculas según tu restricción
          id_cancha: bookingData.court?.id,
          rut_usuario: userId,
          codigo_reserva: bookingCode,
          codigo_qr: qrUrl // Guardamos la URL del QR
        })
        .select()
        .single();

      if (reservaError) throw reservaError;

      // 5. Registrar la ganancia
      const { data: ganancia, error: gananciaError } = await supabase
        .from('ganancias')
        .insert({
          numero_reservas: 1,
          periodo: new Date().toISOString().slice(0, 7), // Formato YYYY-MM
          monto_total: bookingData.court?.price || 0,
          fecha: new Date()
        })
        .select()
        .single();

      if (gananciaError) throw gananciaError;

      // 6. Registrar el pago
      const { data: pago, error: pagoError } = await supabase
        .from('pagos')
        .insert({
          monto: bookingData.court?.price || 0,
          fecha_pago: new Date(),
          metodo_pago: 'mercadopago',
          estado: 'procesado',
          id_reserva: reserva.id_reserva,
          id_ganancia: ganancia.id_ganancia,
          rut_usuario: userId,
          metadata: {
            booking_code: bookingCode,
            payment_data: paymentData,
            qr_url: qrUrl
          }
        })
        .select()
        .single();

      if (pagoError) throw pagoError;

      // 7. Crear notificación para el usuario
      await supabase.from('notificaciones').insert({
        título: '¡Reserva Confirmada!',
        mensaje: `Tu reserva para ${bookingData.court?.name} el día ${bookingData.date.toLocaleDateString()} a las ${bookingData.time} ha sido confirmada. Código: ${bookingCode}`,
        estado: 'no leído',
        rut_usuario: userId
      });

      return {
        success: true,
        bookingCode,
        codigo_qr: qrUrl,
        payment: pago
      };
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      throw error;
    }
  }
};
