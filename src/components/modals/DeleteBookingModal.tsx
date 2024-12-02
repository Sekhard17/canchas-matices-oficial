import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Booking } from "@/types/api.types";

interface DeleteBookingModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (bookingId: number) => Promise<void>;
}

const DeleteBookingModal = ({ booking, isOpen, onClose, onDelete }: DeleteBookingModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(booking.id_reserva);
      onClose();
    } catch (error) {
      console.error('Error al eliminar la reserva:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Reserva</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p>¿Estás seguro que deseas eliminar esta reserva?</p>
          <p className="text-sm text-muted-foreground mt-2">
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBookingModal; 