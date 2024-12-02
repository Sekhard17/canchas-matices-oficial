import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import type { Booking } from '@/types/api.types';
import { toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface VoidBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onVoid: (bookingId: number, anulacionData: {
    motivo: string;
    requiere_devolucion: boolean;
  }) => Promise<void>;
}

export const VoidBookingModal = ({ 
  booking, 
  isOpen, 
  onClose, 
  onVoid 
}: VoidBookingModalProps) => {
  // Estados para manejar el formulario y el proceso
  const [motivo, setMotivo] = useState('');
  const [withRefund, setWithRefund] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // Ref para controlar intentos de envío y prevenir doble submit
  const submitAttempted = useRef(false);

  // Efecto para limpiar el formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setMotivo('');
        setWithRefund(false);
        setIsProcessing(false);
        submitAttempted.current = false;
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Función para manejar la anulación
  const handleVoid = async () => {
    // Marcamos que se intentó enviar el formulario
    submitAttempted.current = true;
    
    // Validación del motivo
    if (!motivo.trim()) {
      toast.error('Por favor, ingrese un motivo para la anulación');
      submitAttempted.current = false; // Reseteamos si hay error de validación
      return;
    }

    try {
      setIsProcessing(true);
      
      // Llamada a la función de anulación
      await onVoid(booking.id_reserva, {
        motivo: motivo.trim(),
        requiere_devolucion: withRefund
      });

      // Si todo sale bien, cerramos el modal
      onClose();
    } catch (error) {
      console.error('Error en anulación:', error);
      toast.error('Error al procesar la anulación');
      setIsProcessing(false);
      submitAttempted.current = false;
    }
  };

  // Función auxiliar para formatear fechas
  const formatLocalDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        // Solo permitimos cerrar si no está procesando y no se ha intentado enviar
        if (!open) {
          if (!isProcessing && !submitAttempted.current) {
            onClose();
          }
        }
      }}
    >
      <DialogContent 
        className="sm:max-w-md"
        // Prevenimos cierre al hacer clic fuera si está procesando
        onPointerDownOutside={(e) => {
          if (isProcessing || submitAttempted.current) {
            e.preventDefault();
          }
        }}
        // Prevenimos cierre con ESC si está procesando
        onEscapeKeyDown={(e) => {
          if (isProcessing || submitAttempted.current) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5" />
            Anular Reserva
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la reserva */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-primary h-4 w-4" />
              <span>{formatLocalDate(booking.fecha)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faClock} className="text-primary h-4 w-4" />
              <span>{booking.hora_inicio} - {booking.hora_fin}</span>
            </div>
          </div>

          {/* Campo de motivo */}
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo de anulación</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo de la anulación"
              className="resize-none"
              rows={3}
              disabled={isProcessing}
            />
          </div>

          {/* Checkbox de devolución */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="withRefund"
              checked={withRefund}
              onCheckedChange={(checked) => setWithRefund(checked as boolean)}
              disabled={isProcessing}
            />
            <Label htmlFor="withRefund" className="text-sm font-normal">
              Requiere devolución
            </Label>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => !isProcessing && !submitAttempted.current && onClose()}
              disabled={isProcessing || submitAttempted.current}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleVoid}
              disabled={isProcessing || submitAttempted.current || !motivo.trim()}
            >
              {isProcessing ? 'Anulando...' : 'Anular Reserva'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoidBookingModal;