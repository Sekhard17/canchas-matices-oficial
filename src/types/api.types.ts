// Importa el tipo Court desde otro archivo
import type { Court } from './court';

// Interface User: Define la estructura de un usuario en el sistema
export interface User {
  rut: string;           // Identificador único del usuario (RUT chileno)
  nombre: string;        // Nombre del usuario
  apellido: string;      // Apellido del usuario
  correo: string;        // Correo electrónico
  telefono?: string;     // Teléfono (opcional, por eso el ?)
  fecha_registro: string; // Fecha cuando se registró el usuario
  estado: 'activo' | 'inactivo'; // Estado del usuario (solo puede ser 'activo' o 'inactivo')
  rol: string;           // Rol del usuario en el sistema
}

// Re-exporta el tipo Court
export type { Court };

// Interface Booking: Define la estructura de una reserva
export interface Booking {
  id_reserva: number;    // ID único de la reserva
  fecha: string;         // Fecha de la reserva
  hora_inicio: string;   // Hora de inicio
  hora_fin: string;      // Hora de finalización
  estado: 'Pendiente' | 'Confirmada' | 'Cancelada' | 'Realizada' | 'Anulada'; // Estados posibles de la reserva
  id_cancha: number;     // ID de la cancha reservada
  rut_usuario: string;   // RUT del usuario que hizo la reserva
  precio_reserva: number; // Precio de la reserva
  codigo_reserva: string; // Código único de la reserva
  codigo_qr: string;     // Código QR para la reserva
  cancha?: Court;        // Objeto de la cancha (opcional)
  usuario?: User;        // Objeto del usuario (opcional)
}

// Interface Payment: Define la estructura de un pago
export interface Payment {
  id_pago: number;       // ID único del pago
  monto: number;         // Monto del pago
  fecha_pago: string;    // Fecha cuando se realizó el pago
  metodo_pago: string;   // Método utilizado para el pago
  estado: 'procesado' | 'fallido' | 'pendiente'; // Estados posibles del pago
  id_reserva: number;    // ID de la reserva asociada
  id_ganancia: number;   // ID de la ganancia asociada
  rut_usuario: string;   // RUT del usuario que realizó el pago
}

// Interface Revenue: Define la estructura de las ganancias
export interface Revenue {
  id_ganancia: number;   // ID único de la ganancia
  numero_reservas: number; // Número de reservas en el período
  periodo: string;       // Período de tiempo
  monto_total: number;   // Monto total de ganancias
  fecha: string;         // Fecha del registro
}

// Interface Notification: Define la estructura de las notificaciones
export interface Notification {
  id_notificacion: number; // ID único de la notificación
  titulo: string;        // Título de la notificación
  mensaje: string;       // Mensaje de la notificación
  estado: 'leído' | 'no leído'; // Estado de la notificación
  rut_usuario: string;   // RUT del usuario destinatario
}

// Interfaces para estadísticas y resúmenes del dashboard
export interface DashboardStats {
  totalBookings: number;  // Total de reservas
  totalRevenue: number;   // Total de ingresos
  activeUsers: number;    // Usuarios activos
  occupancyRate: number;  // Tasa de ocupación
}

export interface BookingSummary {
  total: number;         // Total de reservas
  confirmed: number;     // Reservas confirmadas
  pending: number;       // Reservas pendientes
  cancelled: number;     // Reservas canceladas
}

export interface RevenueSummary {
  daily: number;         // Ingresos diarios
  weekly: number;        // Ingresos semanales
  monthly: number;       // Ingresos mensuales
  yearly: number;        // Ingresos anuales
}

// Agregar estos tipos a tu archivo de tipos existente

export interface Solicitud {
  id_solicitud: number;
  fecha_solicitud: string;
  motivo: string;
  nueva_hora_inicio?: string;
  nueva_hora_fin?: string;
  tipo_solicitud: string;
  estado_solicitud: string;
  rut_usuario: string;
  usuarios?: {
    nombre: string;
    apellido: string;
  };
}

export interface RespuestaSolicitud {
  id_respuesta: number;
  fecha_respuesta: string;
  respuesta: string;
  estado: string;
  id_solicitud: number;
}