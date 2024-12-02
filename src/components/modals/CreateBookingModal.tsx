import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RutInput } from '@/components/ui/RutInput';
import type { Court } from '@/types/api.types';
import type { BookingData } from '@/pages/booking/BookingPage';
import { cashBookingService } from '@/services/cashBooking.service';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import { toast } from 'react-hot-toast';

// Definición de las props que recibe el componente
interface CreateBookingModalProps {
  isOpen: boolean;          // Controla la visibilidad del modal
  onClose: () => void;      // Función para cerrar el modal
  courts: Court[];          // Array de canchas disponibles
  selectedDate: Date;       // Fecha seleccionada para la reserva
  onBookingCreated: (bookingData: any) => Promise<void>;
}

export const CreateBookingModal = ({
  isOpen,
  onClose,
  courts,
  selectedDate,
  onBookingCreated
}: CreateBookingModalProps) => {
  // Estados para el manejo del RUT y búsqueda de cliente
  const [rutValue, setRutValue] = useState('');                   // Almacena el RUT ingresado
  const [isSearching, setIsSearching] = useState(false);          // Estado de búsqueda activa
  const [isValidRut, setIsValidRut] = useState(false);           // Validez del RUT ingresado

  // Estado para almacenar la información del cliente encontrado
  const [userData, setUserData] = useState<{
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string;
  } | null>(null);

  // Estado para los datos de la reserva
  const [bookingData, setBookingData] = useState({
    id_cancha: '',         // ID de la cancha seleccionada
    hora_inicio: '',       // Hora de inicio seleccionada
  });

  // Estado para mantener los datos completos de la cancha seleccionada
  const [selectedCourtData, setSelectedCourtData] = useState<BookingData['court'] | undefined>(undefined);

  // Hook personalizado para obtener los horarios disponibles
  const { timeSlots, isLoading, error } = useTimeSlots({
    selectedDate,
    selectedCourt: selectedCourtData
  });

  // Effect para actualizar los datos de la cancha cuando cambia la selección
  useEffect(() => {
    // Si no hay cancha seleccionada, resetear los datos
    if (!bookingData.id_cancha) {
      setSelectedCourtData(undefined);
      return;
    }

    // Buscar y establecer los datos completos de la cancha seleccionada
    const court = courts.find(court => court.id_cancha.toString() === bookingData.id_cancha);
    if (court) {
      setSelectedCourtData({
        id: court.id_cancha.toString(),
        name: court.nombre,
        type: court.tipo,
        price: court.precio_hora,
        image: '',
        players: '',
        features: []
      });
    }
  }, [bookingData.id_cancha, courts]);

  // Filtrar solo los horarios disponibles
  const availableTimeSlots = timeSlots
    .filter(slot => slot.disponible)
    .map(slot => slot.horaInicio);

  // Función para validar y buscar cliente por RUT
  const handleRutValidation = async (rut: string) => {
    if (rut.length < 8) return;
    
    setIsSearching(true);
    try {
      // Buscar cliente en el sistema
      const user = await cashBookingService.findUserByRut(rut);
      if (user) {
        // Cliente encontrado, actualizar estados
        setIsValidRut(true);
        setUserData({
          nombre: user.nombre,
          apellido: user.apellido,
          correo: user.correo,
          telefono: user.telefono || ''
        });
        toast.success('Cliente encontrado');
      } else {
        // Cliente no encontrado, resetear estados
        setIsValidRut(false);
        setUserData(null);
        toast.error('Cliente no encontrado');
      }
    } catch (error) {
      // Error en la búsqueda
      setIsValidRut(false);
      setUserData(null);
      toast.error('Error al buscar cliente');
    } finally {
      setIsSearching(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!bookingData.id_cancha || !bookingData.hora_inicio) {
        toast.error('Por favor, complete todos los campos');
        return;
      }

      const selectedCourt = courts.find(court => court.id_cancha.toString() === bookingData.id_cancha);
      if (!selectedCourt) {
        toast.error('Cancha no válida');
        return;
      }

      const bookingDataFormatted = {
        date: selectedDate,
        time: bookingData.hora_inicio,
        court: {
          id: selectedCourt.id_cancha.toString(),
          name: selectedCourt.nombre,
          type: selectedCourt.tipo,
          price: selectedCourt.precio_hora,
          image: '',
          players: '',
          features: []
        },
        rutValue
      };

      await onBookingCreated(bookingDataFormatted);
      onClose();
    } catch (error) {
      console.error('Error al crear reserva:', error);
      toast.error('Error al crear la reserva');
    }
  };

  // Renderizado del componente
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Contenedor principal del modal */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>
          
          {/* Formulario de creación de reserva */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo de RUT */}
            <div>
              <label className="block text-sm font-medium mb-1">RUT Cliente</label>
              <RutInput
                value={rutValue}
                onChange={setRutValue}
                onValidRut={handleRutValidation}
                isValid={isValidRut}
                isSearching={isSearching}
              />
              {/* Indicadores de estado de búsqueda */}
              {isSearching && (
                <span className="text-sm text-muted-foreground mt-1">
                  Buscando cliente...
                </span>
              )}
              {isValidRut && userData && (
                <span className="text-sm text-green-500 mt-1">
                  Cliente encontrado
                </span>
              )}
            </div>

            {/* Campos que se muestran solo si se encontró un cliente */}
            {userData && (
              <>
                {/* Datos del cliente */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <Input value={userData.nombre} disabled className="bg-muted" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellido</label>
                    <Input value={userData.apellido} disabled className="bg-muted" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Correo</label>
                  <Input value={userData.correo} disabled className="bg-muted" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <Input value={userData.telefono} disabled className="bg-muted" />
                </div>

                {/* Selección de cancha */}
                <div>
                  <label className="block text-sm font-medium mb-1">Cancha</label>
                  <Select
                    value={bookingData.id_cancha}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, id_cancha: value }))}
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

                {/* Selección de hora */}
                <div>
                  <label className="block text-sm font-medium mb-1">Hora</label>
                  <Select
                    value={bookingData.hora_inicio}
                    onValueChange={(value) => setBookingData(prev => ({ ...prev, hora_inicio: value }))}
                    disabled={isLoading || !bookingData.id_cancha}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        isLoading ? "Cargando horarios..." : 
                        !bookingData.id_cancha ? "Seleccione una cancha primero" :
                        error ? "Error al cargar horarios" :
                        availableTimeSlots.length === 0 ? "No hay horarios disponibles" :
                        "Seleccionar hora"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimeSlots.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Mensaje de error si falla la carga de horarios */}
                  {error && (
                    <span className="text-sm text-red-500 mt-1">
                      Error al cargar horarios disponibles
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={
                  !isValidRut || 
                  !userData || 
                  !bookingData.id_cancha || 
                  !bookingData.hora_inicio ||
                  isLoading
                }
              >
                Crear Reserva
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateBookingModal;