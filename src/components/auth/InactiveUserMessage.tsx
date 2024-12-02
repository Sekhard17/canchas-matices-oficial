import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

const InactiveUserMessage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card p-8 rounded-2xl shadow-lg text-center space-y-6"
      >
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <FontAwesomeIcon 
            icon={faUserSlash} 
            className="text-4xl text-destructive"
          />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Usuario Deshabilitado
          </h1>
          
          <p className="text-muted-foreground">
            Por favor, contacte a administración de Canchas Matices para obtener información sobre su cuenta.
          </p>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Contacto: <br />
            <a 
              href="mailto:contacto@canchasmatices.cl" 
              className="text-primary hover:underline"
            >
              contacto@canchasmatices.cl
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default InactiveUserMessage; 