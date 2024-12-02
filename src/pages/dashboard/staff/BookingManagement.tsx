import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BookingCalendar } from '@/components/BookingCalendar';
import { adminBookingsService } from '@/services/adminBookings.service';
import type { Booking, Court } from '@/types/api.types';
import { format, startOfDay, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import CreateBookingModal from '@/components/modals/CreateBookingModal';
import VoidBookingModal from '@/components/modals/VoidBookingModal';
import { cashBookingService } from '@/services/cashBooking.service';

// Definir la interfaz para los datos de anulación
interface AnulacionData {
  motivo: string;
  requiere_devolucion: boolean;
}

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVoidModal, setShowVoidModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fechaFormateada = format(selectedDate, 'yyyy-MM-dd');
        
        const [courtsData, bookingsData] = await Promise.all([
          adminBookingsService.getCourts(),
          adminBookingsService.getBookings({ fecha: fechaFormateada })
        ]);
        
        setCourts(courtsData || []);
        setBookings(bookingsData || []);

      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar los datos');
        setCourts([]);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parseISO(e.target.value);
    setSelectedDate(startOfDay(newDate));
  };

  const handleVoidBooking = async (
    bookingId: number, 
    anulacionData: AnulacionData
  ) => {
    try {
      // 1. Anular la reserva con los nuevos datos
      const updatedBooking = await adminBookingsService.voidBooking(bookingId, {
        id_reserva: bookingId,  // Agregamos el id_reserva aquí
        ...anulacionData
      });
      
      // 2. Actualizar el estado local de forma suave
      setBookings(bookings => 
        bookings.map(booking => 
          booking.id_reserva === bookingId ? updatedBooking : booking
        )
      );

      toast.success(
        anulacionData.requiere_devolucion 
          ? 'Reserva anulada y devolución en proceso' 
          : 'Reserva anulada exitosamente'
      );

      setShowVoidModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error al anular la reserva:', error);
      toast.error('Error al anular la reserva');
    }
  };

  const handleUpdateBooking = async (bookingId: number, updateData: any) => {
    try {
      await adminBookingsService.updateBooking(bookingId, updateData);
      const fechaFormateada = format(selectedDate, 'yyyy-MM-dd');
      const bookingsData = await adminBookingsService.getBookings({ fecha: fechaFormateada });
      setBookings(bookingsData || []);
      toast.success('Reserva actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      toast.error('Error al actualizar la reserva');
    }
  };

  const handleCreateBooking = async (bookingData: any) => {
    try {
      // 1. Crear la reserva
      await cashBookingService.createCashBooking(bookingData, bookingData.rutValue);
      
      // 2. Recargar las reservas en segundo plano
      const fechaFormateada = format(selectedDate, 'yyyy-MM-dd');
      const bookingsData = await adminBookingsService.getBookings({ fecha: fechaFormateada });
      
      // 3. Actualizar el estado de forma más suave
      setBookings(bookingsData || []);
      
      setShowCreateModal(false);
      toast.success('Reserva creada correctamente');
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      toast.error('Error al crear la reserva');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Reservas</h2>
        <div className="flex space-x-4">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-white"
          >
            Nueva Reserva
          </Button>
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={handleDateChange}
            className="bg-card border border-border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      {isLoading && bookings.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" />
        </div>
      ) : (
        <BookingCalendar 
          selectedDate={selectedDate}
          courts={courts}
          bookings={bookings}
          onVoidBooking={async (bookingId) => {
            const booking = bookings.find(b => b.id_reserva === bookingId);
            if (booking) {
              setSelectedBooking(booking);
              setShowVoidModal(true);
            }
          }}
          onUpdateBooking={handleUpdateBooking}
          onCreateBooking={handleCreateBooking}
        />
      )}

      {showCreateModal && (
        <CreateBookingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onBookingCreated={handleCreateBooking}
          courts={courts}
          selectedDate={selectedDate}
        />
      )}

      {selectedBooking && (
        <VoidBookingModal
          booking={selectedBooking}
          isOpen={showVoidModal}
          onClose={() => {
            setShowVoidModal(false);
            setSelectedBooking(null);
          }}
          onVoid={handleVoidBooking}
        />
      )}
    </div>
  );
};

export default Bookings;
