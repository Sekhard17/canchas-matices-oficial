import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faIdCard,
  faEye,
  faEyeSlash,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';
import type { UpdateUserData } from '@/types/user';

const profileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  correo: z.string().email('Correo electrónico inválido'),
  telefono: z.string().optional(),
  contraseñaActual: z.string().optional(),
  nuevaContraseña: z.string().optional(),
  confirmarContraseña: z.string().optional()
}).refine((data) => {
  if (data.nuevaContraseña && !data.contraseñaActual) {
    return false;
  }
  if (data.nuevaContraseña !== data.confirmarContraseña) {
    return false;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden o falta la contraseña actual",
  path: ["confirmarContraseña"]
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      correo: user?.correo || '',
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      
      const updateData: UpdateUserData = {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
      };

      if (data.nuevaContraseña) {
        updateData.contraseñaActual = data.contraseñaActual;
        updateData.nuevaContraseña = data.nuevaContraseña;
      }

      const updatedUser = await userService.updateProfile(updateData);
      updateProfile(updatedUser);
      toast.success('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-card rounded-xl shadow-md p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mi Perfil</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {isEditing ? 'Cancelar' : 'Editar Perfil'}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('nombre')}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
              <FontAwesomeIcon 
                icon={faUser} 
                className="absolute right-3 top-2.5 text-muted-foreground" 
              />
            </div>
            {errors.nombre && (
              <p className="mt-1 text-sm text-destructive">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Apellido
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('apellido')}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
              <FontAwesomeIcon 
                icon={faUser} 
                className="absolute right-3 top-2.5 text-muted-foreground" 
              />
            </div>
            {errors.apellido && (
              <p className="mt-1 text-sm text-destructive">{errors.apellido.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Correo electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                {...register('correo')}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className="absolute right-3 top-2.5 text-muted-foreground" 
              />
            </div>
            {errors.correo && (
              <p className="mt-1 text-sm text-destructive">{errors.correo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Teléfono
            </label>
            <div className="relative">
              <input
                type="tel"
                {...register('telefono')}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              />
              <FontAwesomeIcon 
                icon={faPhone} 
                className="absolute right-3 top-2.5 text-muted-foreground" 
              />
            </div>
            {errors.telefono && (
              <p className="mt-1 text-sm text-destructive">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              RUT
            </label>
            <div className="relative">
              <input
                type="text"
                value={user?.id || ''}
                disabled
                className="w-full px-4 py-2 bg-background border border-border rounded-lg opacity-50"
              />
              <FontAwesomeIcon 
                icon={faIdCard} 
                className="absolute right-3 top-2.5 text-muted-foreground" 
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('contraseñaActual')}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.contraseñaActual && (
                  <p className="mt-1 text-sm text-destructive">{errors.contraseñaActual.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...register('nuevaContraseña')}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground"
                  >
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
                {errors.nuevaContraseña && (
                  <p className="mt-1 text-sm text-destructive">{errors.nuevaContraseña.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...register('confirmarContraseña')}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {errors.confirmarContraseña && (
                  <p className="mt-1 text-sm text-destructive">{errors.confirmarContraseña.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default ProfileForm;