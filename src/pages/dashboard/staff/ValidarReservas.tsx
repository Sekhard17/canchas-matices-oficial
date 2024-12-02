import { useEffect, useState } from 'react';
import { Scanner, type IDetectedBarcode } from '@yudiel/react-qr-scanner';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQrcode, 
  faUser, 
  faMapMarkerAlt,
  faClock,
  faHashtag,
  faCheck,
  faXmark,
  faTicket,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { qrService } from '@/services/qr.service';
import type { Booking } from '@/types/api.types';

const formatearHora = (hora: string) => {
  return hora.split(':').slice(0, 2).join(':');
};

const ValidarReservas = () => {
  const [escaneando, setEscaneando] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [reserva, setReserva] = useState<Booking | null>(null);
  const [codigoManual, setCodigoManual] = useState('');
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [permisosCamara, setPermisosCamara] = useState<boolean>(false);
  const [errorCamara, setErrorCamara] = useState<string>('');
  const [mensajeValidacion, setMensajeValidacion] = useState<string>('');

  useEffect(() => {
    const verificarPermisos = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setPermisosCamara(true);
        setErrorCamara('');
      } catch (error) {
        console.error('Error de permisos de cámara:', error);
        setPermisosCamara(false);
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            setErrorCamara('No se ha dado permiso para usar la cámara. Por favor, permite el acceso a la cámara y recarga la página.');
            toast.error('Se requiere permiso para usar la cámara');
          } else {
            setErrorCamara('No se pudo acceder a la cámara. Por favor, verifica que tu dispositivo tiene una cámara disponible.');
            toast.error('Error al acceder a la cámara');
          }
        }
      }
    };

    verificarPermisos();
  }, []);

  const handleQRScan = async (detectedCodes: IDetectedBarcode[]) => {
    if (!detectedCodes.length) return;

    try {
      const qrCode = detectedCodes[0].rawValue;
      setCargando(true);
      const { reserva: reservaData, mensajeValidacion } = await qrService.obtenerReservaPorCodigo(qrCode);
      setReserva(reservaData);
      setMensajeValidacion(mensajeValidacion || '');
      setDialogoAbierto(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al cargar la reserva');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleBuscarCodigo = async () => {
    if (codigoManual.trim().length < 6) {
      toast.error('El código debe tener al menos 6 caracteres');
      return;
    }

    try {
      setCargando(true);
      const { reserva: reservaData, mensajeValidacion } = await qrService.obtenerReservaPorCodigo(codigoManual.trim());
      setReserva(reservaData);
      setMensajeValidacion(mensajeValidacion || '');
      setDialogoAbierto(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Reserva no encontrada');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleValidarReserva = async () => {
    if (!reserva) return;
    
    try {
      setCargando(true);
      await qrService.validarReserva(reserva.id_reserva.toString());
      toast.success('Reserva validada exitosamente');
      setReserva(null);
      setDialogoAbierto(false);
      setCodigoManual('');
      setEscaneando(true);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al validar la reserva');
      }
    } finally {
      setCargando(false);
    }
  };

  const handleCerrarDialogo = () => {
    setDialogoAbierto(false);
    setReserva(null);
    setCodigoManual('');
    setEscaneando(true);
  };

  const handleScanError = (error: unknown) => {
    console.error('Error del escáner:', error);
    if (error instanceof Error) {
      toast.error(`Error del escáner: ${error.message}`);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card className="p-6">
        <div className="text-center mb-8">
          <div className="p-3 bg-primary/10 rounded-lg inline-block mb-4">
            <FontAwesomeIcon icon={faQrcode} className="text-2xl text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Validar Reservas</h2>
          <p className="text-muted-foreground">
            Escanea el código QR o ingresa el código de reserva manualmente
          </p>
        </div>

        <AnimatePresence mode="wait">
          {escaneando && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="max-w-md mx-auto">
                {errorCamara ? (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center mb-4">
                    <p>{errorCamara}</p>
                    <Button 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => window.location.reload()}
                    >
                      Reintentar
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl">
                    {permisosCamara && (
                      <Scanner
                        onScan={handleQRScan}
                        onError={handleScanError}
                        scanDelay={500}
                        constraints={{
                          facingMode: 'environment'
                        }}
                        styles={{
                          container: { borderRadius: '1rem' }
                        }}
                      />
                    )}
                  </div>
                )}

                <div className="mt-4 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        o ingresa el código manualmente
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      #
                    </span>
                    <Input
                      value={codigoManual}
                      onChange={(e) => setCodigoManual(e.target.value.toUpperCase())}
                      placeholder="Ingresa el código de reserva"
                      className="uppercase pl-8"
                      minLength={6}
                    />
                  </div>
                  <Button 
                    onClick={handleBuscarCodigo}
                    disabled={cargando || codigoManual.trim().length < 6}
                  >
                    {cargando ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background max-h-[98vh] overflow-y-auto">
          {reserva && (
            <div>
              <div className="bg-gradient-to-r from-primary/90 to-primary p-2 sm:p-6 text-white">
                <DialogHeader>
                  <DialogTitle className="text-base sm:text-xl text-white">Validar Reserva</DialogTitle>
                  <p className="text-xs sm:text-sm text-white/90">Confirma los detalles antes de validar</p>
                </DialogHeader>
              </div>

              <div className="p-2 sm:p-6 space-y-2 sm:space-y-6">
                {/* Código de Reserva */}
                <div className="flex items-start gap-2 sm:gap-4 bg-primary/5 p-2 sm:p-4 rounded-lg border border-primary/10">
                  <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                    <FontAwesomeIcon icon={faHashtag} className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Código de Reserva</h4>
                    <p className="font-mono text-base sm:text-lg font-semibold text-primary">
                      #{reserva.codigo_reserva}
                    </p>
                  </div>
                </div>

                {/* Información de la Cancha */}
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground px-2 sm:px-4">Detalles de la Cancha</h4>
                  <div className="bg-muted/30 p-2 sm:p-4 rounded-lg">
                    <div className="flex items-start gap-2 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h5 className="font-medium text-base sm:text-lg">{reserva.cancha?.nombre}</h5>
                        <p className="text-xs sm:text-sm text-muted-foreground">{reserva.cancha?.ubicacion}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fecha y Hora */}
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground px-2 sm:px-4">Fecha y Hora</h4>
                  <div className="bg-muted/30 p-2 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
                          <FontAwesomeIcon icon={faCalendar} className="text-primary w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fecha</p>
                          <p className="text-xs sm:text-sm font-medium">
                            {new Date(reserva.fecha).toLocaleDateString('es-CL', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="bg-primary/10 p-1.5 sm:p-2 rounded-full">
                          <FontAwesomeIcon icon={faClock} className="text-primary w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Horario</p>
                          <p className="text-xs sm:text-sm font-medium">
                            {formatearHora(reserva.hora_inicio)} - {formatearHora(reserva.hora_fin)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cliente */}
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground px-2 sm:px-4">Cliente</h4>
                  <div className="bg-muted/30 p-2 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                        <FontAwesomeIcon icon={faUser} className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-lg">
                          {reserva.usuario?.nombre} {reserva.usuario?.apellido}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {reserva.usuario?.correo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground px-2 sm:px-4">Estado</h4>
                  <div className="bg-muted/30 p-2 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                        <FontAwesomeIcon icon={faTicket} className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <Badge 
                        variant={reserva.estado === 'Pendiente' ? 'outline' : 'default'}
                        className="text-xs uppercase tracking-wider"
                      >
                        {reserva.estado}
                      </Badge>
                    </div>
                  </div>
                </div>

                {mensajeValidacion && (
                  <div className="bg-destructive/10 text-destructive text-xs sm:text-sm p-2 sm:p-3 rounded-lg">
                    <FontAwesomeIcon icon={faXmark} className="mr-2" />
                    {mensajeValidacion}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t p-2 sm:p-6 flex gap-2 sm:gap-4 justify-end bg-muted/10">
                <Button
                  variant="outline"
                  onClick={handleCerrarDialogo}
                  disabled={cargando}
                  className="gap-1 text-xs sm:text-sm py-1.5 h-8 sm:h-10"
                >
                  <FontAwesomeIcon icon={faXmark} />
                  Cancelar
                </Button>
                <Button
                  onClick={handleValidarReserva}
                  disabled={cargando || !qrService.puedeValidarse(reserva.estado)}
                  className={`gap-1 text-xs sm:text-sm py-1.5 h-8 sm:h-10 ${
                    !qrService.puedeValidarse(reserva.estado)
                      ? 'bg-muted cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  {cargando ? 'Validando...' : 'Validar'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ValidarReservas;