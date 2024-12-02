import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList,
  faPlus,
  faSpinner,
  faClock,
  faUser,
  faComment
} from '@fortawesome/free-solid-svg-icons';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { solicitudesService } from '@/services/solicitudes.service';
import type { Solicitud } from '@/types/api.types';
import CrearSolicitudForm from '@/components/SolicitudForm';

const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await solicitudesService.obtenerSolicitudes();
      // Asegurarnos de que response.data existe y es un array
      const data = Array.isArray(response.data) ? response.data : [];
      setSolicitudes(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
      setError('Error al cargar las solicitudes');
      toast.error('Error al cargar las solicitudes');
    } finally {
      setCargando(false);
    }
  };

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'outline';
      case 'aprobada':
        return 'secondary';
      case 'rechazada':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-destructive text-center">
          <p>{error}</p>
          <Button 
            onClick={cargarSolicitudes}
            variant="outline"
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FontAwesomeIcon icon={faClipboardList} className="text-xl text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Solicitudes</h2>
              <p className="text-muted-foreground">Gestiona tus solicitudes de cambio de horario</p>
            </div>
          </div>
          <Button onClick={() => setDialogoAbierto(true)} className="gap-2">
            <FontAwesomeIcon icon={faPlus} />
            Nueva Solicitud
          </Button>
        </div>

        {cargando ? (
          <div className="flex justify-center items-center py-8">
            <FontAwesomeIcon icon={faSpinner} className="text-primary text-2xl animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes && solicitudes.length > 0 ? (
              solicitudes.map((solicitud) => (
                <motion.div
                  key={solicitud.id_solicitud}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getEstadoBadgeVariant(solicitud.estado_solicitud)}>
                          {solicitud.estado_solicitud}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatearFecha(solicitud.fecha_solicitud)}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-medium">{solicitud.tipo_solicitud}</h3>
                        <p className="text-sm text-muted-foreground">{solicitud.motivo}</p>
                      </div>

                      <div className="flex gap-4 text-sm text-muted-foreground">
                        {solicitud.nueva_hora_inicio && (
                          <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} className="text-primary" />
                            <span>
                              {solicitud.nueva_hora_inicio} - {solicitud.nueva_hora_fin}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} className="text-primary" />
                          <span>
                            {solicitud.usuarios?.nombre} {solicitud.usuarios?.apellido}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="gap-2">
                      <FontAwesomeIcon icon={faComment} />
                      Ver Detalles
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay solicitudes para mostrar
              </div>
            )}
          </div>
        )}
      </Card>

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Solicitud</DialogTitle>
          </DialogHeader>
          <CrearSolicitudForm 
            onSuccess={() => {
              setDialogoAbierto(false);
              cargarSolicitudes();
              toast.success('Solicitud creada exitosamente');
            }}
            onCancel={() => setDialogoAbierto(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SolicitudesPage;