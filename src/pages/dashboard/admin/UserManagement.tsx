import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast from 'react-hot-toast';
import { UserFormModal } from '@/components/Users/UserFormModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  faUser,
  faUserPlus,
  faEdit,
  faTrash,
  faUserShield,
  faUserCog,
  faUserCheck,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useUsersStore } from '@/stores/useUsersStore';
import type { CreateUserData, UpdateUserData } from '@/types/user';

const UserManagement = () => {
  const { users, loading, error, fetchUsers, deleteUser } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Administrador':
        return faUserShield;
      case 'Encargado':
        return faUserCog;
      case 'Cliente':
        return faUserCheck;
      default:
        return faUser;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'Encargado':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Cliente':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'activo'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-gray-500 dark:text-gray-400';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.rol === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="text-destructive">{error}</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <FontAwesomeIcon icon={faSearch} className="text-muted-foreground" />
            </span>
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-border bg-background"
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              <FontAwesomeIcon icon={faFilter} className="text-muted-foreground" />
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background appearance-none"
            >
              <option value="all">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Encargado">Encargado</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>
          <button
            onClick={() => setIsEditing('new')}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">RUT</th>
                <th className="text-left p-4 font-medium">Usuario</th>
                <th className="text-left p-4 font-medium">Correo</th>
                <th className="text-left p-4 font-medium">Teléfono</th>
                <th className="text-left p-4 font-medium">Rol</th>
                <th className="text-left p-4 font-medium">Estado</th>
                <th className="text-left p-4 font-medium">Registro</th>
                <th className="text-center p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.rut}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4 font-mono text-sm">
                    {user.rut}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{`${user.nombre} ${user.apellido}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {user.correo}
                  </td>
                  <td className="p-4 text-sm">
                    {user.telefono || '-'}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${getRoleColor(user.rol)}`}>
                      <FontAwesomeIcon icon={getRoleIcon(user.rol)} />
                      <span>{user.rol}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={getStatusColor(user.estado)}>
                      {user.estado === 'Activo' ? '● Activo' : '● Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(user.fecha_registro).toLocaleDateString('es-CL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => setIsEditing(user.rut)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Editar usuario"
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-primary" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.rut)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Eliminar usuario"
                      >
                        <FontAwesomeIcon icon={faTrash} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {isEditing !== null && (
        <UserFormModal
          userId={isEditing === 'new' ? null : isEditing}
          onClose={() => setIsEditing(null)}
          onSubmit={async (data) => {
            try {
              if (isEditing === 'new') {
                await useUsersStore.getState().createUser(data as CreateUserData);
                toast.success('Usuario creado correctamente');
              } else {
                await useUsersStore.getState().updateUser(isEditing, data as UpdateUserData);
                toast.success('Usuario actualizado correctamente');
              }
              setIsEditing(null);
            } catch (error) {
              toast.error('Error al guardar los cambios');
            }
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;