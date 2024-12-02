import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import { CourtFormModal } from '@/components/Courts/CourtFormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  faFutbol,
  faPlus,
  faEdit,
  faTrash,
  faLocationDot,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { useCourtsStore } from '@/stores/useCourtsStore';
import type { CreateCourtData, UpdateCourtData } from '@/types/court';

const CourtManagement = () => {
  const { 
    courts, 
    loading, 
    error, 
    fetchCourts, 
    deleteCourt, 
    updateCourt,
    createCourt
  } = useCourtsStore();
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteCourt(id);
      toast.success('Cancha eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la cancha');
    }
  };

  const handleSubmit = async (data: CreateCourtData | UpdateCourtData) => {
    try {
      if (isEditing === 0) {
        if (isCreateCourtData(data)) {
          await createCourt(data);
          toast.success('Cancha creada correctamente');
        }
      } else if (isEditing !== null) {
        await updateCourt(isEditing, data as UpdateCourtData);
        toast.success('Cancha actualizada correctamente');
      }
      setIsEditing(null);
    } catch (error) {
      toast.error('Error al guardar los cambios');
    }
  };

  const isCreateCourtData = (data: any): data is CreateCourtData => {
    return (
      typeof data.nombre === 'string' &&
      typeof data.tipo === 'string' &&
      typeof data.ubicacion === 'string' &&
      typeof data.precio_hora === 'number' &&
      typeof data.estado === 'string'
    );
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-destructive">{error}</div>;
  if (!courts || courts.length === 0) return <div>No hay canchas disponibles</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Canchas</h2>
        <button 
          onClick={() => setIsEditing(0)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Nueva Cancha</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {Array.isArray(courts) && courts.map((court) => {
            if (!court?.id_cancha) return null;

            return (
              <motion.div
                key={court.id_cancha}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-card rounded-xl shadow-lg overflow-hidden border border-border/50 hover:border-border transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <FontAwesomeIcon icon={faFutbol} className="text-xl text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{court.nombre}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <FontAwesomeIcon icon={faLocationDot} className="text-xs" />
                        <span>{court.ubicacion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-y border-border/50">
                    <div className="flex items-center space-x-2">
                      <FontAwesomeIcon icon={faClock} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{court.tipo}</span>
                    </div>
                    <div className="text-lg font-bold text-emerald-600">
                      ${court.precio_hora 
                        ? new Intl.NumberFormat('es-CL').format(court.precio_hora * 1000)
                        : '0'}/hr
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button 
                      onClick={() => setIsEditing(court.id_cancha)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                      <span>Editar</span>
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(court.id_cancha)}
                      className="flex items-center space-x-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            handleDelete(deleteConfirm);
            setDeleteConfirm(null);
          }
        }}
        title="Eliminar Cancha"
        message="¿Estás seguro de que deseas eliminar esta cancha? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {isEditing !== null && (
        <CourtFormModal 
          courtId={isEditing} 
          onClose={() => setIsEditing(null)} 
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default CourtManagement;