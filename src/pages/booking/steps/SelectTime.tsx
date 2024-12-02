import React, { useEffect} from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useTimeSlots } from '@/hooks/useTimeSlots';
import LoadingScreen from '@/components/LoadingScreen';
import toast from 'react-hot-toast';
import type { BookingData } from '../BookingPage';

interface SelectTimeProps {
  selectedTime?: string;
  onSelect: (time: string) => void;
  onBack: () => void;
  selectedDate?: Date;
  selectedCourt?: BookingData['court'];
}

const SelectTime: React.FC<SelectTimeProps> = ({
  selectedTime,
  onSelect,
  onBack,
  selectedDate,
  selectedCourt
}) => {
  const { timeSlots, isLoading, error } = useTimeSlots({
    selectedDate,
    selectedCourt
  });

  useEffect(() => {
    if (error) {
      toast.error('Error al cargar los horarios disponibles');
    }
  }, [error]);

  if (isLoading) {
    return <LoadingScreen />
  }

  const hasAvailableSlots = timeSlots.some(slot => slot.disponible);

  if (!hasAvailableSlots) {
    return (
      <div className="space-y-3 md:space-y-6">
        <div className="text-center">
          <h2 className="text-xl md:text-3xl font-bold text-white">
            No hay horarios disponibles
          </h2>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-400">
            Selecciona otra fecha para ver la disponibilidad
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-4 md:p-8 text-center"
        >
          <div className="mb-4 md:mb-6">
            <FontAwesomeIcon 
              icon={faCalendarAlt} 
              className="text-3xl md:text-5xl text-emerald-500 mb-2 md:mb-4"
            />
            <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">
              ¡Ups! No hay horarios disponibles
            </h3>
            <p className="text-sm md:text-base text-gray-400">
              {new Date().toDateString() === selectedDate?.toDateString()
                ? "Las reservas para hoy ya no están disponibles."
                : "Todos los horarios para esta fecha están reservados."}
            </p>
          </div>

          <button
            onClick={onBack}
            className="px-4 md:px-6 py-2 md:py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors text-sm md:text-base"
          >
            Seleccionar otra fecha
          </button>
        </motion.div>
      </div>
    );
  }

  const formatTime = (time: string) => {
    return time.substring(0, 5); // "16:00:00" -> "16:00"
  };

  return (
    <div className="space-y-3 md:space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Selecciona una Hora
        </h2>
        <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300">
          Elige el horario que prefieras
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-3 md:p-6">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
          {timeSlots.map((slot) => {
            const isSelected = selectedTime === slot.horaInicio;
            const isDisabled = !slot.disponible;

            return (
              <motion.button
                key={slot.horaInicio}
                whileHover={!isDisabled ? { scale: 1.05 } : undefined}
                whileTap={!isDisabled ? { scale: 0.95 } : undefined}
                onClick={() => !isDisabled && onSelect(slot.horaInicio)}
                disabled={isDisabled}
                className={`
                  relative p-2 md:p-4 rounded-lg md:rounded-xl flex flex-col items-center justify-center
                  transition-all duration-200
                  ${isSelected
                    ? 'bg-emerald-500 text-white ring-2 ring-emerald-500 ring-offset-2'
                    : isDisabled
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-emerald-50 dark:hover:bg-emerald-900 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <FontAwesomeIcon 
                  icon={faClock} 
                  className={`text-base md:text-xl mb-1 md:mb-2 ${isSelected ? 'text-white' : 'text-emerald-500'}`}
                />
                <span className="text-xs md:text-base font-semibold">
                  {formatTime(slot.horaInicio)}
                </span>
                
                {isDisabled && (
                  <span className="absolute top-1 md:top-2 right-1 md:right-2 text-[8px] md:text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-full bg-red-100 text-red-600">
                    No disponible
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 md:mt-8 flex items-center justify-center space-x-4 md:space-x-6">
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-emerald-500 rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Disponible</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <span className="text-xs md:text-sm text-gray-600 dark:text-gray-300">No Disponible</span>
          </div>
        </div>
      </div>

      <div className="justify-start mt-4 md:mt-8 hidden md:flex">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default SelectTime;