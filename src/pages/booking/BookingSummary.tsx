import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFutbol,
  faCalendarAlt,
  faClock,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons';
import { BookingData } from './BookingPage';
import PaymentModal from '@/components/modals/PaymentModal';

interface BookingSummaryProps {
  bookingData: BookingData;
  onStepClick: (step: number) => void;
  currentStep: number;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({
  bookingData,
  onStepClick
}) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const allSelected = bookingData.court && bookingData.date && bookingData.time;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleConfirm = () => {
    if (!allSelected) return;
    setIsPaymentModalOpen(true);
  };

  if (allSelected && window.innerWidth < 1024) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-t-2xl shadow-lg border-t border-gray-200 dark:border-gray-700"
        >
          {/* Detalles de la reserva */}
          <div className="space-y-3 mb-4">
            {/* Cancha */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faFutbol} className="text-lg text-emerald-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {bookingData.court?.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {bookingData.court?.type}
                    </p>
                  </div>
                  <button
                    onClick={() => onStepClick(1)}
                    className="text-emerald-500 p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Fecha y Hora */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-lg text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {bookingData.date && formatDate(bookingData.date)}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {bookingData.time}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onStepClick(2)}
                      className="text-emerald-500 p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faPencilAlt} className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onStepClick(3)}
                      className="text-emerald-500 p-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total y botón de confirmación */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Total a pagar
              </span>
              <span className="text-lg font-bold text-emerald-500">
                {bookingData.court && formatPrice(bookingData.court.price)}
              </span>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <span>Confirmar Reserva</span>
            </button>
          </div>
        </motion.div>

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingData={bookingData}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card text-card-foreground rounded-2xl shadow-lg p-6 sticky top-24"
      >
        <h3 className="text-xl font-bold mb-6">
          Resumen de Reserva
        </h3>

        <div className="space-y-6">
          {/* Cancha seleccionada */}
          {bookingData.court && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faFutbol} className="text-xl text-primary" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      {bookingData.court.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.court.type}
                    </p>
                  </div>
                  <button
                    onClick={() => onStepClick(1)}
                    className="text-primary hover:text-primary/80"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-lg font-semibold text-primary">
                  {formatPrice(bookingData.court.price)}
                </p>
              </div>
            </div>
          )}

          {/* Fecha seleccionada */}
          {bookingData.date && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-xl text-blue-500" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      Fecha
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(bookingData.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => onStepClick(2)}
                    className="text-primary hover:text-primary/80"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hora seleccionada */}
          {bookingData.time && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} className="text-xl text-purple-500" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">
                      Hora
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {bookingData.time}
                    </p>
                  </div>
                  <button
                    onClick={() => onStepClick(3)}
                    className="text-primary hover:text-primary/80"
                  >
                    <FontAwesomeIcon icon={faPencilAlt} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Total y botón de confirmación */}
        {bookingData.court && bookingData.date && bookingData.time && (
          <div className="mt-8 space-y-4">
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Total
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(bookingData.court.price)}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Confirmar Reserva
            </button>
          </div>
        )}
      </motion.div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingData={bookingData}
      />
    </>
  );
};

export default BookingSummary;