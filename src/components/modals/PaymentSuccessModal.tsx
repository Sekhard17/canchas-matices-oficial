import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import type { BookingData } from '@/pages/booking/BookingPage';

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData;
  bookingCode: string;
  qrCodeUrl: string;
}

const PaymentSuccessModal = ({ isOpen, onClose, bookingData, bookingCode, qrCodeUrl }: PaymentSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="relative bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-xl shadow-xl 
            w-full sm:max-w-sm sm:m-4 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="text-center pt-6 pb-4">
            <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-lg text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">¡Pago Exitoso!</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Tu reserva ha sido confirmada
            </p>
          </div>

          <div className="px-4 space-y-3 mb-4">
            <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <img 
                src={qrCodeUrl}
                alt="QR Code"
                className="w-24 h-24 mb-2"
              />
              <div className="text-sm font-mono font-bold text-emerald-500">
                #{bookingCode}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
              <h3 className="font-medium text-gray-800 dark:text-white text-xs mb-2">
                Detalles de la Reserva
              </h3>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Cancha</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-white">
                    {bookingData.court?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Fecha</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-white">
                    {bookingData.date?.toLocaleDateString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Hora</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-white">
                    {bookingData.time}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={onClose}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg 
                font-medium text-xs transition-colors"
            >
              Cerrar
            </button>

            <p className="text-center text-[10px] text-gray-500 dark:text-gray-400 mt-2">
              Presenta este código al llegar a la cancha
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentSuccessModal;