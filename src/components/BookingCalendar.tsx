import { motion } from 'framer-motion';
import { format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Court, Booking } from '@/types/api.types';
import BookingDetailsModal from '@/components/modals/BookingDetailsModal';
import EditBookingModal from '@/components/modals/EditBookingModal';
import CreateBookingModal from '@/components/modals/CreateBookingModal';

// Agregar esta función de utilidad al inicio del archivo
const formatTime = (time: string) => {
  return time.split(':').slice(0, 2).join(':');
};

// Interfaces
interface BookingCalendarProps {
  selectedDate: Date;
  courts: Court[];
  bookings: Booking[];
  onVoidBooking: (bookingId: number) => void;
  onUpdateBooking: (bookingId: number, updateData: any) => Promise<void>;
  onCreateBooking: (bookingData: any) => Promise<void>;
}

export const BookingCalendar = ({ 
  selectedDate, 
  courts, 
  bookings,
  onVoidBooking,
  onUpdateBooking,
  onCreateBooking 
}: BookingCalendarProps) => {
  // Estados para modales
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formato de fecha seleccionada
  const selectedDateStr = format(startOfDay(selectedDate), 'yyyy-MM-dd', { locale: es });

  // Generación de slots de tiempo (15:00 a 00:00)
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = i + 16;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Función para obtener reserva en un slot específico
  const getBookingForSlot = (courtId: number, time: string) => {
    return bookings.find(b => {
      const matchCourt = Number(b.id_cancha) === courtId;
      const bookingHour = b.hora_inicio.split(':')[0] + ':00';
      const matchTime = bookingHour === time;
      const bookingDate = b.fecha.split('T')[0];
      const matchDate = bookingDate === selectedDateStr;
      
      return matchCourt && matchTime && matchDate;
    });
  };

  // Filtrar reservas para la fecha seleccionada
  const bookingsForSelectedDate = bookings.filter(booking => 
    booking.fecha.split('T')[0] === selectedDateStr
  );

  // Renderizado condicional si no hay canchas
  if (!courts?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">
          No hay canchas disponibles
        </p>
      </div>
    );
  }

  // Renderizado condicional si no hay reservas
  if (bookingsForSelectedDate.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-muted-foreground">
          No hay reservas para el día {format(selectedDate, 'dd/MM/yyyy', { locale: es })}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm">
      {/* Cabecera del calendario */}
      <div className="grid auto-cols-fr grid-flow-col" style={{ gridTemplateColumns: '100px repeat(auto-fit, minmax(200px, 1fr))' }}>
        {/* Columna de hora */}
        <div className="bg-gradient-to-br from-card/95 to-card/90 p-4 text-center border-b border-border">
          <span className="text-sm font-medium text-muted-foreground">
            Hora
          </span>
        </div>
        
        {/* Columnas de canchas */}
        {courts.map(court => (
          <div 
            key={court.id_cancha}
            className="border-l border-b border-border bg-gradient-to-br from-card/95 to-card/90 p-4 text-center"
          >
            <span className="text-sm font-semibold text-primary">
              {court.nombre}
            </span>
          </div>
        ))}
      </div>

      {/* Grilla de horarios */}
      <div className="divide-y divide-border">
        {timeSlots.map((time) => (
          <div 
            key={time}
            className="grid auto-cols-fr grid-flow-col hover:bg-muted/5 transition-colors duration-200"
            style={{ gridTemplateColumns: '100px repeat(auto-fit, minmax(200px, 1fr))' }}
          >
                {/* Columna de hora */}
              <div className="flex items-center justify-center border-r border-b border-border bg-card/20 p-4">
              <span className="text-sm font-medium text-muted-foreground">
                {time}
              </span>
            </div>

            {/* Celdas de reservas */}
            {courts.map(court => {
              const booking = getBookingForSlot(court.id_cancha, time);
              return (
                <div 
                  key={`${court.id_cancha}-${time}`}
                  className="relative border-l border-border p-2 min-h-[100px]"
                >
                  {booking && (
                    <motion.div
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group h-full rounded-lg ${getBookingColor(booking.estado)}
                        hover:ring-2 hover:ring-offset-2 hover:ring-offset-background/5 hover:ring-primary/30 
                        hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out
                        p-4`}
                    >
                      {/* Contenido de la reserva */}
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="font-semibold truncate">
                            {booking.usuario?.nombre} {booking.usuario?.apellido}
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-2 opacity-80">
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                            </svg>
                            <span>{formatTime(booking.hora_inicio)} - {formatTime(booking.hora_fin)}</span>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2 justify-end mt-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsModal(true);
                            }}
                            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowEditModal(true);
                            }}
                            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              onVoidBooking(booking.id_reserva);
                            }}
                            className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Portales para modales */}
      {createPortal(
        selectedBooking && showEditModal && (
          <EditBookingModal
            booking={selectedBooking}
            courts={courts}
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedBooking(null);
            }}
            onUpdate={onUpdateBooking}
          />
        ),
        document.body
      )}

      {createPortal(
        selectedBooking && showDetailsModal && (
          <BookingDetailsModal
            booking={selectedBooking}
            isOpen={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedBooking(null);
            }}
          />
        ),
        document.body
      )}

      {createPortal(
        showCreateModal && (
          <CreateBookingModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            courts={courts}
            selectedDate={selectedDate}
            onBookingCreated={onCreateBooking}
          />
        ),
        document.body
      )}
    </div>
  );
};

// Actualizar los estilos de los estados para que sean más atractivos
const getBookingColor = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case 'confirmada':
      return 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 dark:from-emerald-500/30 dark:to-emerald-600/30 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300';
    case 'pendiente':
      return 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 dark:from-amber-500/30 dark:to-amber-600/30 border border-amber-500/30 text-amber-700 dark:text-amber-300';
    case 'cancelada':
      return 'bg-gradient-to-br from-red-500/20 to-red-600/20 dark:from-red-500/30 dark:to-red-600/30 border border-red-500/30 text-red-700 dark:text-red-300';
    case 'realizada':
      return 'bg-gradient-to-br from-blue-500/20 to-blue-600/20 dark:from-blue-500/30 dark:to-blue-600/30 border border-blue-500/30 text-blue-700 dark:text-blue-300';
    default:
      return 'bg-gradient-to-br from-gray-500/20 to-gray-600/20 dark:from-gray-500/30 dark:to-gray-600/30 border border-gray-500/30';
  }
};

export default BookingCalendar;