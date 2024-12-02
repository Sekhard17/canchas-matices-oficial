import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode,
  faCircleCheck,
  faCamera,
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { QrScanner } from '@yudiel/react-qr-scanner';

interface BookingValidationData {
  code: string;
  court: string;
  date: string;
  time: string;
  user?: {
    name: string;
    email: string;
  };
}

const ValidateBooking = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [bookingData, setBookingData] = useState<BookingValidationData | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleScan = async (data: string) => {
    try {
      const parsedData = JSON.parse(data);
      setBookingData(parsedData);
      setIsScanning(false);

      // Aquí iríamos a buscar los datos adicionales de la reserva a la API
      // Por ahora simulamos una llamada
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookingData(prev => ({
        ...prev!,
        user: {
          name: 'Juan Pérez',
          email: 'juan@example.com'
        }
      }));
    } catch (error) {
      console.error('Error al procesar el código QR:', error);
    }
  };

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      // Aquí iría la llamada a la API para validar la reserva
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simular éxito
      setBookingData(null);
    } catch (error) {
      console.error('Error al validar la reserva:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Validar Reserva</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scanner Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FontAwesomeIcon icon={faQrcode} className="text-xl text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Escanear Código QR</h3>
                <p className="text-sm text-muted-foreground">
                  Escanea el código QR de la reserva
                </p>
              </div>
            </div>

            {isScanning ? (
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <QrScanner
                  onDecode={handleScan}
                  onError={(error) => console.error(error)}
                />
                <button
                  onClick={() => setIsScanning(false)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsScanning(true)}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground p-4 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FontAwesomeIcon icon={faCamera} />
                <span>Iniciar Escáner</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Booking Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl shadow-md overflow-hidden"
        >
          {bookingData ? (
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-xl text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Detalles de la Reserva</h3>
                  <p className="text-sm text-emerald-500">
                    Código: #{bookingData.code}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cancha</p>
                    <p className="font-medium">{bookingData.court}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hora</p>
                    <p className="font-medium">{bookingData.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha</p>
                    <p className="font-medium">
                      {new Date(bookingData.date).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <p className="font-medium text-emerald-500">Confirmada</p>
                  </div>
                </div>

                {bookingData.user && (
                  <div className="border-t border-border pt-4">
                    <h4 className="font-medium mb-2">Datos del Cliente</h4>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Nombre:</span>{' '}
                        {bookingData.user.name}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span>{' '}
                        {bookingData.user.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="w-full flex items-center justify-center space-x-2 bg-emerald-500 text-white p-4 rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {isValidating ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>Validando...</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      <span>Validar Reserva</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 bg-accent rounded-full mb-4">
                <FontAwesomeIcon 
                  icon={faQrcode} 
                  className="text-4xl text-muted-foreground" 
                />
              </div>
              <h3 className="text-lg font-medium">Sin Reserva Escaneada</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Escanea un código QR para ver los detalles de la reserva
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ValidateBooking;