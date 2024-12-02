import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RutInput } from '@/components/ui/RutInput';
import type { User, UpdateUserData, CreateUserData } from '@/types/user';
import { useUsersStore } from '@/stores/useUsersStore';
import { toast } from 'react-hot-toast';

interface UserFormModalProps {
  userId: string | null; // null para nuevo usuario
  onClose: () => void;
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>;
}

export const UserFormModal = ({ userId, onClose, onSubmit }: UserFormModalProps) => {
  const { users } = useUsersStore();
  const [isSearching, setIsSearching] = useState(false);
  const [isValidRut, setIsValidRut] = useState(false);
  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    rol: 'Cliente' as User['rol'],
    estado: 'Activo' as User['estado'],
    contraseña: ''
  });

  useEffect(() => {
    if (userId) {
      const userToEdit = users.find(user => user.rut === userId);
      if (userToEdit) {
        setFormData({
          rut: userToEdit.rut,
          nombre: userToEdit.nombre,
          apellido: userToEdit.apellido,
          correo: userToEdit.correo,
          telefono: userToEdit.telefono || '',
          rol: userToEdit.rol,
          estado: userToEdit.estado,
          contraseña: ''
        });
        setIsValidRut(true); // El RUT es válido si estamos editando
      }
    }
  }, [userId, users]);

  const handleRutValidation = async (rut: string) => {
    if (!userId) { // Solo validar RUT para nuevos usuarios
      setIsSearching(true);
      try {
        // Verificar si el RUT ya existe
        const existingUser = users.find(user => user.rut === rut);
        if (existingUser) {
          setIsValidRut(false);
          toast.error('Este RUT ya está registrado');
        } else {
          setIsValidRut(true);
          toast.success('RUT válido');
        }
      } catch (error) {
        setIsValidRut(false);
        toast.error('Error al validar RUT');
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId && !isValidRut) {
      toast.error('Por favor, ingrese un RUT válido');
      return;
    }
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error en el formulario:', error);
      toast.error('Error al guardar los cambios');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card p-6 rounded-xl shadow-lg max-w-md w-full mx-4"
      >
        <h3 className="text-xl font-bold mb-4">
          {userId ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">RUT</label>
            <RutInput
              value={formData.rut}
              onChange={(value) => setFormData(prev => ({ ...prev, rut: value }))}
              onValidRut={handleRutValidation}
              isValid={isValidRut}
              isSearching={isSearching}
              disabled={!!userId}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full p-2 rounded-lg border border-border bg-background"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData(prev => ({ ...prev, apellido: e.target.value }))}
                className="w-full p-2 rounded-lg border border-border bg-background"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Correo</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
              className="w-full p-2 rounded-lg border border-border bg-background"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
              className="w-full p-2 rounded-lg border border-border bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData(prev => ({ ...prev, rol: e.target.value as User['rol'] }))}
                className="w-full p-2 rounded-lg border border-border bg-background"
                required
              >
                <option value="Cliente">Cliente</option>
                <option value="Encargado">Encargado</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as User['estado'] }))}
                className="w-full p-2 rounded-lg border border-border bg-background"
                required
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {!userId && (
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                value={formData.contraseña}
                onChange={(e) => setFormData(prev => ({ ...prev, contraseña: e.target.value }))}
                className="w-full p-2 rounded-lg border border-border bg-background"
                required={!userId}
                minLength={6}
              />
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              {userId ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}; 