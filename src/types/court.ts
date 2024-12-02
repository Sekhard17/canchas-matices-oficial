export interface Court {
  id_cancha: number;
  nombre: string;
  tipo: string;
  ubicacion: string;
  precio_hora: number;
  estado: string;
}

export interface CreateCourtData {
  nombre: string;
  tipo: string;
  ubicacion: string;
  precio_hora: number;
  estado: string;
}

export type UpdateCourtData = Partial<CreateCourtData>; 