import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface Step {
  number: number;
  title: string;
}

interface BookingProgressProps {
  currentStep: number;
  steps: Step[];
  onStepClick: (step: number) => void;
}

const BookingProgress: React.FC<BookingProgressProps> = ({ 
  currentStep, 
  steps,
  onStepClick
}) => {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 w-full h-0.5 md:h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
      
      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div 
              key={step.number}
              className="flex flex-col items-center"
              onClick={() => onStepClick(step.number)}
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? '#10B981' : '#E5E7EB',
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={`relative z-10 flex items-center justify-center w-7 h-7 md:w-10 md:h-10 rounded-full 
                  ${isCompleted || isCurrent ? 'cursor-pointer' : 'cursor-not-allowed'}
                  transition-all duration-200`}
              >
                {isCompleted ? (
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 md:w-5 md:h-5 text-white" />
                ) : (
                  <span className={`text-xs md:text-sm font-semibold ${isCurrent ? 'text-white' : 'text-gray-600'}`}>
                    {step.number}
                  </span>
                )}
              </motion.div>
              
              <div className="mt-1 md:mt-2 text-[10px] md:text-sm font-medium text-gray-600 dark:text-gray-300">
                {step.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingProgress;
