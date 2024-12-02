import { useState, useEffect } from 'react';
import { useCourtsStore } from '@/stores/useCourtsStore';
import type { CreateCourtData, UpdateCourtData } from '@/types/court';

interface CourtFormModalProps {
  courtId: number;
  onClose: () => void;
  onSubmit: (data: CreateCourtData | UpdateCourtData) => Promise<void>;
}

export const CourtFormModal = ({ courtId, onClose, onSubmit }: CourtFormModalProps) => {
  const { courts } = useCourtsStore();
  const [formData, setFormData] = useState<CreateCourtData>({
    nombre: '',
    tipo: '',
    ubicacion: '',
    precio_hora: 0,
    estado: 'Activa'
  });

  useEffect(() => {
    if (courtId > 0) {
      const courtToEdit = courts.find(court => court.id_cancha === courtId);
      if (courtToEdit) {
        setFormData({
          nombre: courtToEdit.nombre || '',
          tipo: courtToEdit.tipo || '',
          ubicacion: courtToEdit.ubicacion || '',
          precio_hora: Number(courtToEdit.precio_hora) || 0,
          estado: courtToEdit.estado || 'Activa'
        });
      }
    }
  }, [courtId, courts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      precio_hora: Number(formData.precio_hora) // Asegurarse de que es número
    });
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio_hora' 
        ? Number(value) / 1000 // Dividimos por 1000 al guardar
        : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">
          {courtId === 0 ? 'Nueva Cancha' : 'Editar Cancha'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="Fútbol 5">Fútbol 5</option>
              <option value="Fútbol 7">Fútbol 7</option>
              <option value="Fútbol 11">Fútbol 11</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Precio por hora</label>
            <input
              type="number"
              name="precio_hora"
              value={formData.precio_hora * 1000} // Multiplicamos por 1000 para mostrar
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              required
              min="0"
              step="1000" // Para que aumente de 1000 en 1000
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {courtId === 0 ? 'Crear' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
