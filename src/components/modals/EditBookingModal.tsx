import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Booking, Court } from '@/types/api.types';
import type { BookingData } from '@/pages/booking/BookingPage';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { toast } from 'react-hot-toast';

const BOOKING_STATES = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Realizada'
} as const;

type BookingStatus = typeof BOOKING_STATES[keyof typeof BOOKING_STATES];

interface EditBookingModalProps {
  booking: Booking;
  courts: Court[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (bookingId: number, updateData: {
    estado: BookingStatus;
    id_cancha?: number;
    hora_inicio?: string;
    hora_fin?: string;
    fecha?: string;
  }) => Promise<void>;
}

export const EditBookingModal = ({
  booking,
  courts,
  isOpen,
  onClose,
  onUpdate
}: EditBookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(booking.fecha));
  const [isUpdating, setIsUpdating] = useState(false);

  // Estado del formulario
  const [bookingData, setBookingData] = useState({
    id_cancha: booking.id_cancha.toString(),
    hora_inicio: booking.hora_inicio || '',
    hora_fin: booking.hora_fin || '',
    status: booking.estado as BookingStatus
  });

  const [selectedCourtData, setSelectedCourtData] = useState<BookingData['court'] | undefined>(() => {
    const court = courts.find(court => court.id_cancha === booking.id_cancha);
    return court ? {
      id: court.id_cancha.toString(),
      name: court.nombre,
      type: court.tipo,
      price: court.precio_hora,
      image: '',
      players: '',
      features: []
    } : undefined;
  });

  // useTimeSlots con la fecha seleccionada
  const { timeSlots, isLoading: loadingSlots, error } = useTimeSlots({
    selectedDate,
    selectedCourt: selectedCourtData
  });

  // Función para filtrar horarios no válidos
  const filterAvailableTimeSlots = (slots: Array<{ horaInicio: string, disponible: boolean }>) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    
    return slots.filter(slot => {
      // Si es hoy, solo mostrar horas futuras
      if (selectedDateStr === today) {
        const [hours, minutes] = slot.horaInicio.split(':');
        const slotTime = new Date();
        slotTime.setHours(parseInt(hours), parseInt(minutes), 0);
        return slot.disponible && slotTime > now;
      }
      return slot.disponible;
    });
  };

  // Filtrar slots disponibles
  const availableTimeSlots = filterAvailableTimeSlots(timeSlots)
    .map(slot => slot.horaInicio);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      
      const updateData: any = {
        estado: bookingData.status
      };

      // Crear correctamente la fecha seleccionada
      const selectedDateTime = new Date(selectedDate);
      const [hours, minutes] = bookingData.hora_inicio.split(':');
      selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Crear correctamente la fecha actual
      const currentDateTime = new Date();
      currentDateTime.setSeconds(0, 0);

      if (selectedDate.toISOString().split('T')[0] !== booking.fecha) {
        updateData.fecha = selectedDate.toISOString().split('T')[0];
      }

      if (bookingData.id_cancha !== booking.id_cancha.toString()) {
        updateData.id_cancha = parseInt(bookingData.id_cancha);
      }

      if (bookingData.hora_inicio) {
        updateData.hora_inicio = bookingData.hora_inicio;
        updateData.hora_fin = calculateEndTime(bookingData.hora_inicio);
      }

      await onUpdate(booking.id_reserva, updateData);
      toast.success('Reserva actualizada exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al actualizar reserva:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar la reserva');
    } finally {
      setIsUpdating(false);
    }
  };

  // Añadir al inicio del componente, después de los estados
  const currentBookingTime = `${booking.hora_inicio} - ${booking.hora_fin}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Editar Reserva</h2>
          
          <div className="space-y-4">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium mb-1">Fecha</label>
              <input
                type="date"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  setSelectedDate(new Date(e.target.value));
                  setBookingData(prev => ({ ...prev, hora_inicio: '' }));
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <Select
                value={bookingData.status}
                onValueChange={(value: BookingStatus) => 
                  setBookingData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BOOKING_STATES).map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cancha */}
            <div>
              <label className="block text-sm font-medium mb-1">Cancha</label>
              <Select
                value={bookingData.id_cancha}
                onValueChange={(value) => {
                  const court = courts.find(c => c.id_cancha.toString() === value);
                  setSelectedCourtData(court ? {
                    id: court.id_cancha.toString(),
                    name: court.nombre,
                    type: court.tipo,
                    price: court.precio_hora,
                    image: '',
                    players: '',
                    features: []
                  } : undefined);
                  setBookingData(prev => ({ 
                    ...prev, 
                    id_cancha: value,
                    hora_inicio: '' 
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cancha" />
                </SelectTrigger>
                <SelectContent>
                  {courts.map(court => (
                    <SelectItem key={court.id_cancha} value={court.id_cancha.toString()}>
                      {court.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hora Actual */}
            <div>
              <label className="block text-sm font-medium mb-1">Hora Actual</label>
              <div className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {currentBookingTime}
              </div>
            </div>

            {/* Nueva Hora */}
            <div>
              <label className="block text-sm font-medium mb-1">Nueva Hora</label>
              <Select
                value={bookingData.hora_inicio}
                onValueChange={(value) => {
                  // Calcular hora_fin automáticamente (1 hora después)
                  const [hours, minutes] = value.split(':');
                  const endTime = new Date();
                  endTime.setHours(parseInt(hours), parseInt(minutes), 0);
                  endTime.setHours(endTime.getHours() + 1);
                  const hora_fin = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                  
                  setBookingData(prev => ({ 
                    ...prev, 
                    hora_inicio: value,
                    hora_fin: hora_fin
                  }));
                }}
                disabled={loadingSlots}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    loadingSlots ? "Cargando horarios..." : 
                    error ? "Error al cargar horarios" :
                    availableTimeSlots.length === 0 ? "No hay horarios disponibles" :
                    "Seleccionar nueva hora"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map(time => (
                    <SelectItem key={time} value={time}>
                      {`${time} - ${calculateEndTime(time)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {bookingData.hora_inicio && (
                <p className="text-sm text-muted-foreground mt-1">
                  Nueva hora: {bookingData.hora_inicio} - {bookingData.hora_fin}
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdate}
                disabled={
                  isUpdating || 
                  loadingSlots ||
                  (bookingData.status === booking.estado && 
                   !bookingData.hora_inicio &&
                   bookingData.id_cancha === booking.id_cancha.toString() &&
                   selectedDate.toISOString().split('T')[0] === booking.fecha)
                }
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

// Añadir esta función auxiliar
const calculateEndTime = (startTime: string) => {
  const [hours, minutes] = startTime.split(':');
  const endTime = new Date();
  endTime.setHours(parseInt(hours), parseInt(minutes), 0);
  endTime.setHours(endTime.getHours() + 1);
  return `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
};

export default EditBookingModal;