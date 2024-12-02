import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faCalendarCheck,
  faMapMarkerAlt,
  faClock,
  faHashtag,
  faQrcode,
  faDownload,
  faUser,
  faEnvelope,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import type { Booking } from '@/types/api.types';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

const BookingDetailsModal = ({ isOpen, onClose, booking }: BookingDetailsModalProps) => {
  if (!isOpen) return null;

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmada':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'pendiente':
        return 'text-amber-500 bg-amber-500/10';
      case 'cancelada':
        return 'text-red-500 bg-red-500/10';
      case 'realizada':
        return 'text-blue-500 bg-blue-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = booking.codigo_qr;
    link.download = `reserva-${booking.codigo_reserva}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-card rounded-xl shadow-xl p-6 w-full max-w-2xl m-4 overflow-y-auto max-h-[90vh]"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>

          <div className="text-center mb-8">
            <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getStatusColor(booking.estado)}`}>
              <FontAwesomeIcon icon={faCalendarCheck} />
              <span className="capitalize">{booking.estado}</span>
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Detalles de la Reserva */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Detalles de la Reserva</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FontAwesomeIcon icon={faCalendarCheck} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.cancha?.nombre}</p>
                      <p className="text-sm text-muted-foreground">Cancha</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.cancha?.ubicacion}</p>
                      <p className="text-sm text-muted-foreground">Ubicación</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FontAwesomeIcon icon={faClock} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatDate(booking.fecha)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(booking.hora_inicio)} - {formatTime(booking.hora_fin)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FontAwesomeIcon icon={faHashtag} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium font-mono">{booking.codigo_reserva}</p>
                      <p className="text-sm text-muted-foreground">Código de Reserva</p>
                    </div>
                  </div>
                </div>
              </div>

              {booking.usuario && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Datos del Cliente</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FontAwesomeIcon icon={faUser} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {booking.usuario.nombre} {booking.usuario.apellido}
                        </p>
                        <p className="text-sm text-muted-foreground">Nombre</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FontAwesomeIcon icon={faEnvelope} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.usuario.correo}</p>
                        <p className="text-sm text-muted-foreground">Email</p>
                      </div>
                    </div>

                    {booking.usuario.telefono && (
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FontAwesomeIcon icon={faPhone} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.usuario.telefono}</p>
                          <p className="text-sm text-muted-foreground">Teléfono</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="text-center">
                <div className="p-3 bg-primary/10 rounded-lg inline-block mb-4">
                  <FontAwesomeIcon icon={faQrcode} className="text-2xl text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Código QR</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Presenta este código al llegar a la cancha
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-lg">
                <img 
                  src={booking.codigo_qr} 
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <button
                onClick={downloadQR}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Descargar QR</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingDetailsModal;