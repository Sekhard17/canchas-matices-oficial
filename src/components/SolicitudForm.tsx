import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faExclamationCircle,
  faClock,
  faCalendar,
  faUser,
  faMapMarkerAlt,
  faCommentAlt
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { solicitudesService } from '@/services/solicitudes.service';
import { bookingsService } from '@/services/bookings.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Booking } from '@/services/bookings.service';
import { formatTimeSlot } from '@/utils/timeSlots';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import type { Court } from '@/pages/booking/BookingPage';

const TIPOS_SOLICITUD = [
  { value: 'Cambio de Horario', label: 'Cambio de Horario' },
  { value: 'Cancelación', label: 'Cancelación' },
  { value: 'Otro', label: 'Otro' }
] as const;

interface CrearSolicitudFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearSolicitudForm = ({ onSuccess, onCancel }: CrearSolicitudFormProps) => {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [cargandoReservas, setCargandoReservas] = useState(true);
  const [reservas, setReservas] = useState<Booking[]>([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    id_reserva: '',
    tipo_solicitud: '',
    motivo: '',
    nueva_hora_inicio: '',
    nueva_hora_fin: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // Mapeamos la cancha al formato correcto según la interfaz Court
  const selectedCourtMapped: Court | undefined = reservaSeleccionada?.cancha ? {
    id: reservaSeleccionada.cancha.id_cancha.toString(),
    name: reservaSeleccionada.cancha.nombre,
    type: reservaSeleccionada.cancha.tipo,
    price: reservaSeleccionada.cancha.precio_hora,
    image: '',
    players: '2-4',
    features: []
  } : undefined;

  // Hook para los time slots con tipos corregidos
  const { timeSlots, isLoading: loadingSlots } = useTimeSlots({
    selectedDate: selectedDate,
    selectedCourt: selectedCourtMapped
  });

  useEffect(() => {
    if (user?.id) {
      cargarReservasConfirmadas();
    }
  }, [user?.id]);

  useEffect(() => {
    if (reservaSeleccionada) {
      setSelectedDate(new Date(reservaSeleccionada.fecha));
    } else {
      setSelectedDate(undefined);
    }
  }, [reservaSeleccionada]);

  const cargarReservasConfirmadas = async () => {
    try {
      setCargandoReservas(true);
      const reservasUsuario = await bookingsService.getUserBookings(user!.id);
      console.log('Reservas sin filtrar:', reservasUsuario);
      setReservas(reservasUsuario);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
      toast.error('Error al cargar tus reservas');
    } finally {
      setCargandoReservas(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Debes iniciar sesión para crear una solicitud');
      return;
    }

    if (!formData.id_reserva || !formData.tipo_solicitud || !formData.motivo) {
      toast.error('Por favor, completa todos los campos requeridos');
      return;
    }

    try {
      setCargando(true);
      await solicitudesService.crearSolicitud({
        ...formData,
        rut_usuario: user.id,
        estado_solicitud: 'Pendiente',
        fecha_solicitud: new Date().toISOString()
      });
      toast.success('Solicitud creada exitosamente');
      onSuccess();
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      toast.error('Error al crear la solicitud');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (cargandoReservas) {
    return (
      <div className="flex justify-center items-center py-8">
        <FontAwesomeIcon icon={faSpinner} className="text-primary text-2xl animate-spin" />
        <span className="ml-2">Cargando tus reservas...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Debes iniciar sesión para crear una solicitud
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-muted-foreground mb-2">
          No tienes reservas confirmadas para crear una solicitud
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cerrar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Usuario */}
      <div className="bg-muted/10 p-4 rounded-lg border border-border/50">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUser} className="text-primary" />
          <p className="text-sm font-medium">
            Solicitante: <span className="text-muted-foreground">{user.nombre} {user.apellido}</span>
          </p>
        </div>
      </div>

      {/* Selección de Reserva */}
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendar} className="text-primary" />
          Selecciona la Reserva
        </label>
        <Select
          value={formData.id_reserva}
          onValueChange={(value) => {
            const reserva = reservas.find(r => r.id_reserva.toString() === value);
            setReservaSeleccionada(reserva || null);
            setFormData(prev => ({
              ...prev,
              id_reserva: value
            }));
          }}
        >
          <SelectTrigger className="w-full bg-muted/5 border border-border/50 hover:bg-muted/10 transition-colors">
            <SelectValue placeholder="Selecciona una reserva" />
          </SelectTrigger>
          <SelectContent>
            {reservas.map(reserva => (
              <SelectItem 
                key={reserva.id_reserva} 
                value={reserva.id_reserva.toString()}
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                    {reserva.cancha?.nombre}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} />
                    {formatearFecha(reserva.fecha)} - {formatTimeSlot(reserva.hora_inicio)}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Detalles de la Reserva Seleccionada */}
      {reservaSeleccionada && reservaSeleccionada.cancha && (
        <div className="bg-muted/30 p-3 rounded-lg space-y-2">
          <h4 className="text-sm font-medium">Detalles de la Reserva</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
              <span>{reservaSeleccionada.cancha.nombre}</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-primary" />
              <span>
                {formatTimeSlot(reservaSeleccionada.hora_inicio)} - {formatTimeSlot(reservaSeleccionada.hora_fin)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tipo de Solicitud */}
      {formData.id_reserva && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-primary" />
            Tipo de Solicitud
          </label>
          <Select
            value={formData.tipo_solicitud}
            onValueChange={(value) => {
              setFormData(prev => ({
                ...prev,
                tipo_solicitud: value,
                nueva_hora_inicio: '',
                nueva_hora_fin: ''
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo de solicitud" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_SOLICITUD.map(tipo => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Motivo */}
      {formData.tipo_solicitud && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCommentAlt} className="text-primary" />
            Motivo de la Solicitud
          </label>
          <Textarea
            value={formData.motivo}
            onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
            placeholder="Describe el motivo de tu solicitud"
            className="min-h-[100px]"
          />
        </div>
      )}

      {/* Campos de Hora para Cambio de Horario */}
      {formData.tipo_solicitud === 'Cambio de Horario' && reservaSeleccionada && (
        <div className="space-y-4">
          {/* Hora Actual (readonly) */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-primary" />
              Hora Actual
            </label>
            <input
              type="text"
              value={`${formatTimeSlot(reservaSeleccionada.hora_inicio)} - ${formatTimeSlot(reservaSeleccionada.hora_fin)}`}
              className="w-full p-2 rounded-md bg-muted/50"
              disabled
            />
          </div>

          {/* Nueva Hora */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faClock} className="text-primary" />
              Nueva Hora
            </label>
            {loadingSlots ? (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Cargando horarios disponibles...</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.horaInicio}
                    type="button"
                    className={`p-2 rounded-md text-sm ${
                      formData.nueva_hora_inicio === slot.horaInicio
                        ? 'bg-primary text-white'
                        : slot.disponible
                        ? 'bg-muted hover:bg-muted/80'
                        : 'bg-muted/30 text-muted-foreground cursor-not-allowed'
                    }`}
                    disabled={!slot.disponible}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        nueva_hora_inicio: slot.horaInicio,
                        nueva_hora_fin: slot.horaFin
                      }));
                    }}
                  >
                    {formatTimeSlot(slot.horaInicio)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={cargando}
        >
          Cancelar
        </Button>
        <Button 
          type="submit"
          disabled={cargando || !formData.id_reserva || !formData.tipo_solicitud || !formData.motivo || 
            (formData.tipo_solicitud === 'Cambio de Horario' && !formData.nueva_hora_inicio)}
        >
          {cargando ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              Enviando...
            </>
          ) : (
            'Enviar Solicitud'
          )}
        </Button>
      </div>
    </form>
  );
};

export default CrearSolicitudForm;