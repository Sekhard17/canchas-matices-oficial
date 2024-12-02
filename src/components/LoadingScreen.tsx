import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <FontAwesomeIcon
          icon={faSpinner}
          className="text-4xl text-primary animate-spin"
        />
        <p className="mt-4 text-muted-foreground">
          Cargando...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;