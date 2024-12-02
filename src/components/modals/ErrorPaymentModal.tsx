import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import type { BookingData } from '@/pages/booking/BookingPage';

interface ErrorPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData;
}

const ErrorPaymentModal = ({ isOpen, onClose, bookingData }: ErrorPaymentModalProps) => {
  if (!isOpen) return null;

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
          className="relative bg-card rounded-xl shadow-xl p-6 w-full max-w-md m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTimesCircle} className="text-3xl text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-red-600">¡Error en el Pago!</h2>
            <p className="text-muted-foreground mt-2">
              No se pudo completar tu reserva debido a un error en el pago.
            </p>
          </div>

          <div className="bg-accent/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Detalles de la Reserva</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Cancha:</span>{' '}
                {bookingData.court?.name}
              </p>
              <p>
                <span className="text-muted-foreground">Fecha:</span>{' '}
                {bookingData.date?.toLocaleDateString('es-CL')}
              </p>
              <p>
                <span className="text-muted-foreground">Hora:</span>{' '}
                {bookingData.time}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Cerrar
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Intenta realizar el pago nuevamente.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ErrorPaymentModal;
