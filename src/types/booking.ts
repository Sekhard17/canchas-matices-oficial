export interface TimeSlot {
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export interface Booking {
  id_reserva?: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  id_cancha: number;
  rut_usuario: string;
}