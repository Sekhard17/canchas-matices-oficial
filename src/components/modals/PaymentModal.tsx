import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import type { BookingData } from '@/pages/booking/BookingPage';
import PaymentSuccessModal from './PaymentSuccessModal';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { MERCADOPAGO_PUBLIC_KEY } from '@/config/mercadopago';
import { paymentService } from '@/services/payment.service';
import QRCode from 'react-qr-code'; // Importación de react-qr-code

// Inicializar Mercado Pago solo si la clave está disponible
if (MERCADOPAGO_PUBLIC_KEY) {
  initMercadoPago(MERCADOPAGO_PUBLIC_KEY);
} else {
  console.error('Mercado Pago public key is not defined');
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: BookingData;
}

const PaymentModal = ({ isOpen, onClose, bookingData }: PaymentModalProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [showQR, setShowQR] = useState(false); // Estado para mostrar el QR
  const [qrCodeUrl, setQrCodeUrl] = useState(''); // Estado para almacenar la URL del QR

  if (!user?.id) {
    toast.error('Error: No se pudo identificar el usuario');
    return null;
  }

  if (!MERCADOPAGO_PUBLIC_KEY) {
    toast.error('Error: No se pudo inicializar el pago');
    return null;
  }

  // Configuración inicial para el checkout de Mercado Pago
  const initialization = {
    amount: bookingData.court?.price || 0,
    payer: {
      email: user.correo || '',
      identification: {
        type: '', // Deja vacío para evitar problemas de validación
        number: user.id.replace(/[.-]/g, '') // Quita puntos y guiones
      },
      name: user.nombre || '',
      surname: user.apellido || ''
    },
    description: `Reserva ${bookingData.court?.name} - ${bookingData.date?.toLocaleDateString()} ${bookingData.time}`
  };
  

  const onSubmit = async (formData: any) => {
    if (!user?.id) {
      toast.error('Error: No se pudo identificar el usuario');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await paymentService.createPayment(formData, bookingData, user.id);
      setBookingCode(result.bookingCode);
      setQrCodeUrl(result.codigo_qr);
      setShowSuccess(true);
      setShowQR(true); // Muestra el QR después del pago
    } catch (error: any) {
      console.error('Error procesando el pago:', error);
      toast.error('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (error: any) => {
    console.error('Error en el formulario:', error);
    toast.error('Error en el formulario de pago. Por favor, verifica los datos.');
    setIsProcessing(false);
  };

  const onReady = () => {
    console.log('Formulario de pago listo');
  };

  if (showSuccess) {
    return (
      <PaymentSuccessModal
        isOpen={true}
        onClose={onClose}
        bookingData={bookingData}
        bookingCode={bookingCode}
        qrCodeUrl={qrCodeUrl}
      />
    );
  }

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
          className="relative w-full sm:w-auto sm:max-w-md bg-white dark:bg-gray-800 
            rounded-t-2xl sm:rounded-xl shadow-xl 
            max-h-[90vh] sm:max-h-[85vh] overflow-y-auto
            pb-safe"
          onClick={e => e.stopPropagation()}
        >
          {/* Header fijo */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>

            <div className="text-center pr-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Confirmar Pago</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Completa tu reserva realizando el pago
              </p>
            </div>
          </div>

          {/* Contenido scrolleable */}
          <div className="px-4 py-3 space-y-4">
            {/* Detalles de la Reserva */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">
                Detalles de la Reserva
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cancha</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {bookingData.court?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Fecha</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {bookingData.date?.toLocaleDateString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Hora</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {bookingData.time}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="font-medium text-gray-800 dark:text-white">Total</span>
                  <span className="text-lg font-bold text-emerald-500">
                    ${bookingData.court?.price?.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón de pago o formulario */}
            {!showCardForm ? (
              <button
                onClick={() => setShowCardForm(true)}
                disabled={isProcessing}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 px-4 rounded-xl 
                  font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
              >
                Pagar con Tarjeta
              </button>
            ) : (
              <div className="w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700/50">
                <CardPayment
                  initialization={initialization}
                  onSubmit={onSubmit}
                  onError={onError}
                  onReady={onReady}
                  customization={{
                    visual: {
                      style: {
                        theme: 'dark'
                      },
                      hideFormTitle: true,
                      hidePaymentButton: false
                    },
                    paymentMethods: {
                      maxInstallments: 12
                    }
                  }}
                />
              </div>
            )}

            {/* QR Code */}
            {showQR && (
              <div className="text-center bg-white dark:bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-3">
                  Código QR
                </h3>
                <div className="flex justify-center">
                  <QRCode 
                    value={`Reserva ${bookingData.court?.name} - ${bookingData.date?.toLocaleDateString()} ${bookingData.time}`} 
                    size={160}
                    className="max-w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer fijo */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <FontAwesomeIcon icon={faShieldAlt} className="text-emerald-500" />
              <span>Pago seguro procesado por Mercado Pago</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
