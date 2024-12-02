export interface User {
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string | null;
  contraseña: string;
  fecha_registro: string;
  estado: 'Activo' | 'Inactivo';
  rol: 'Usuario' | 'Encargado' | 'Administrador';
}

export interface CreateUserData {
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  contraseña: string;
  rol: User['rol'];
  estado: User['estado'];
}

export interface UpdateUserData {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  rol?: User['rol'];
  estado?: User['estado'];
  contraseña?: string;
}