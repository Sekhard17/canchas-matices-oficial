import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useCourtsStore } from '@/stores/useCourtsStore';
import type { Court as DBCourt } from '@/types/court';

interface UICourt {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  players: string;
  features: string[];
}

interface SelectCourtProps {
  selectedCourt?: UICourt;
  onSelect: (court: UICourt) => void;
  onNext: () => void;
}

const adaptCourtToUI = (court: DBCourt): UICourt => ({
  id: court.id_cancha.toString(),
  name: court.nombre,
  type: court.tipo,
  price: court.precio_hora * 1000, // Multiplicamos por 1000 para mostrar el precio correcto
  image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80',
  players: court.tipo === 'Fútbol 5' ? '5 VS 5' : '7 VS 7',
  features: [
    'Césped sintético profesional',
    'Iluminación LED',
    'Mallas protectoras',
    'Vestuarios equipados'
  ]
});;

const SelectCourt: React.FC<SelectCourtProps> = ({
  selectedCourt,
  onSelect,
  onNext
}) => {
  const { courts } = useCourtsStore();
  const uiCourts = courts.map(adaptCourtToUI);

  useEffect(() => {
    useCourtsStore.getState().fetchCourts();
  }, []);

  return (
    <div className="space-y-2 md:space-y-4"> {/* Reducido el espaciado vertical en móvil */}
      <div className="text-center mb-1 md:mb-2">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
          Selecciona tu Cancha
        </h2>
        <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-600 dark:text-gray-300">
          Elige la cancha que mejor se adapte a tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6"> {/* Reducido gap en móvil */}
        {uiCourts.map((court) => (
          <motion.div
            key={court.id}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden rounded-lg md:rounded-xl shadow-lg cursor-pointer
              ${selectedCourt?.id === court.id 
                ? 'ring-2 ring-emerald-500' 
                : 'hover:shadow-xl'
              }`}
            onClick={() => onSelect(court)}
          >
            <div className="flex flex-row h-24 md:h-auto md:flex-col"> {/* Altura reducida en móvil */}
              <div className="relative w-1/3 md:w-full md:h-48">
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 md:top-4 md:left-4 bg-black/50 text-white px-1.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-sm">
                  ${court.price.toLocaleString('es-CL')}/hr
                </div>
              </div>

              <div className="w-2/3 md:w-full p-2 md:p-6 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-start mb-1 md:mb-4">
                  <div>
                    <h3 className="text-sm md:text-xl font-semibold text-gray-800 dark:text-white">
                      {court.name}
                    </h3>
                    <p className="text-xs md:text-base text-gray-500 dark:text-gray-400">{court.type}</p>
                  </div>
                  <div className="flex items-center space-x-0.5 md:space-x-1 text-emerald-500">
                    <FontAwesomeIcon icon={faUsers} className="text-xs md:text-base" />
                    <span className="text-xs md:text-base">{court.players}</span>
                  </div>
                </div>

                <ul className="hidden md:block space-y-2">
                  {court.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Version móvil de features */}
                <div className="md:hidden flex flex-wrap gap-1">
                  {court.features.slice(0, 2).map((feature, index) => (
                    <span key={index} className="text-[9px] text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {selectedCourt?.id === court.id && (
              <div className="absolute top-1 right-1 md:top-4 md:right-4 z-10 bg-emerald-500 text-white p-1 md:p-2 rounded-full">
                <FontAwesomeIcon icon={faCheck} className="text-[10px] md:text-base" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="justify-end mt-2 md:mt-8 hidden md:flex"> {/* Oculto en móvil */}
        <button
          onClick={onNext}
          disabled={!selectedCourt}
          className={`w-full md:w-auto px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold text-white
            ${selectedCourt
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SelectCourt;
