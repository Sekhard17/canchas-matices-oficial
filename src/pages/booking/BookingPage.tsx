import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  faHome, 
  faCalendarPlus, 
  faHistory, 
  faBell 
} from '@fortawesome/free-solid-svg-icons';
import SelectCourt from './steps/SelectCourt';
import SelectDate from './steps/SelectDate';
import SelectTime from './steps/SelectTime';
import BookingSummary from './BookingSummary';
import BookingProgress from './BookingProgress';
import ClientNavbar from './ClientNavbar';
import BottomNavbar from '@/components/navigation/BottomNavbar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';

export interface Court {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  players: string;
  features: string[];
}

export type BookingData = {
  court?: Court;
  date?: Date;
  time?: string;
};

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const { user } = useAuth();

  const navigationItems = [
    { icon: faHome, label: 'Inicio', path: '/client' },
    { icon: faCalendarPlus, label: 'Nueva Reserva', path: '/client/booking' },
    { icon: faHistory, label: 'Mis Reservas', path: '/client/bookings' },
    { icon: faBell, label: 'Notificaciones', path: '/client/notifications' },
  ];

  const steps = [
    { number: 1, title: 'Seleccionar Cancha' },
    { number: 2, title: 'Elegir Fecha' },
    { number: 3, title: 'Elegir Hora' },
  ];

  useEffect(() => {
    if (isMobile) {
      if (bookingData.court && step === 1) {
        setTimeout(() => setStep(2), 500);
      }
      if (bookingData.date && step === 2) {
        setTimeout(() => setStep(3), 500);
      }
    }
  }, [bookingData.court, bookingData.date, isMobile]);

  const handleNext = () => {
    setStep(current => Math.min(current + 1, steps.length));
  };

  const handleBack = () => {
    setStep(current => Math.max(current - 1, 1));
  };

  const handleUpdateBooking = (data: Partial<BookingData>) => {
    setBookingData(prev => {
      const newData = { ...prev, ...data };
      if (data.date) {
        delete newData.time;
      }
      return newData;
    });
  };

  const handleStepClick = (stepNumber: number) => {
    if (stepNumber < step) {
      setStep(stepNumber);
    }
  };

  const toggleMobileSummary = () => {
    setShowMobileSummary(!showMobileSummary);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClientNavbar />
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <BookingProgress 
            currentStep={step} 
            steps={steps}
            onStepClick={handleStepClick}
          />

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="select-court"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <SelectCourt
                      selectedCourt={bookingData.court}
                      onSelect={(court: Court) => handleUpdateBooking({ court })}
                      onNext={handleNext}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="select-date"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <SelectDate
                      selectedDate={bookingData.date}
                      onSelect={(date) => handleUpdateBooking({ date })}
                      onNext={handleNext}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="select-time"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <SelectTime
                      selectedTime={bookingData.time}
                      onSelect={(time) => handleUpdateBooking({ time })}
                      onBack={handleBack}
                      selectedDate={bookingData.date}
                      selectedCourt={bookingData.court}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isMobile && (
              <div className="lg:col-span-1">
                <BookingSummary 
                  bookingData={bookingData}
                  currentStep={step}
                  onStepClick={handleStepClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {isMobile && user?.rol && (
        <BottomNavbar 
          items={navigationItems}
          module="client"
        />
      )}

      {/* Botón de resumen móvil ajustado para no solaparse con BottomNavbar */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            onClick={toggleMobileSummary}
            className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold"
          >
            Ver Resumen de Reserva
          </button>
        </motion.div>
      )}

      {/* Modal de resumen móvil */}
      <AnimatePresence>
        {isMobile && showMobileSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9999]"
            onClick={toggleMobileSummary}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="absolute bottom-16 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <BookingSummary 
                bookingData={bookingData}
                currentStep={step}
                onStepClick={handleStepClick}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;