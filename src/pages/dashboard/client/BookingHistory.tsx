import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faCircleCheck, 
  faCircleXmark,
  faSpinner,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { useBookings } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import type { Booking } from '@/types/api.types';
import BookingDetailsModal from '@/components/modals/BookingDetailsModal';
import LoadingScreen from '@/components/LoadingScreen';

const BookingHistory = () => {
  const { user } = useAuth();
  const { getBookings, isLoading, error } = useBookings();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.id) return;
      try {
        const data = await getBookings({ userId: user.id });
        if (data) {
          setBookings(data);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    };

    loadBookings();
  }, [user, getBookings]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'realizada':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'confirmada':
        return 'text-blue-500 bg-blue-500/10';
      case 'cancelada':
        return 'text-red-500 bg-red-500/10';
      case 'pendiente':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'realizada':
        return faCircleCheck;
      case 'confirmada':
        return faCalendarCheck;
      case 'cancelada':
        return faCircleXmark;
      case 'pendiente':
        return faSpinner;
      default:
        return faCalendarCheck;
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
        Error al cargar las reservas: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Historial de Reservas</h2>
        <div className="flex space-x-2">
          <select className="bg-card border border-border rounded-lg px-4 py-2 text-sm">
            <option>Todos los estados</option>
            <option>Realizada</option>
            <option>Confirmada</option>
            <option>Pendiente</option>
            <option>Cancelada</option>
          </select>
          <select className="bg-card border border-border rounded-lg px-4 py-2 text-sm">
            <option>Todas las canchas</option>
            <option>Baby Fútbol</option>
            <option>Futbolito</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Cancha</th>
                <th className="text-left p-4 font-medium">Fecha</th>
                <th className="text-left p-4 font-medium">Hora</th>
                <th className="text-left p-4 font-medium">Estado</th>
                <th className="text-right p-4 font-medium">Precio</th>
                <th className="text-center p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <motion.tr
                  key={booking.id_reserva}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4">{booking.cancha?.nombre}</td>
                  <td className="p-4">
                    {new Date(booking.fecha).toLocaleDateString('es-CL')}
                  </td>
                  <td className="p-4">
                    {booking.hora_inicio.substring(0, 5)} - {booking.hora_fin.substring(0, 5)}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(booking.estado)}`}>
                      <FontAwesomeIcon icon={getStatusIcon(booking.estado)} />
                      <span className="capitalize">{booking.estado}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    ${(booking.cancha?.precio_hora || 0).toLocaleString('es-CL')}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowModal(true);
                        }}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <FontAwesomeIcon icon={faEye} className="text-primary" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};

export default BookingHistory;