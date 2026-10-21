export type CategoriaReporte = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';

export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export interface UbicacionCoordenadas {
  latitud?: number;
  longitud?: number;
  aproximada: boolean;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  estado: EstadoReporte;
  fotoUri?: string;
  sector?: string;
  ubicacion?: UbicacionCoordenadas;
  creadoEn: string;
  resueltoEn?: string;
}

export interface Aviso {
  id: string;
  reporteId: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export interface BorradorReporte {
  titulo?: string;
  descripcion?: string;
  aula?: string;
  categoria?: CategoriaReporte;
  fotoUri?: string;
  sector?: string;
  ubicacion?: UbicacionCoordenadas;
}

export interface PreferenciaAjustes {
  avisarResolucion: boolean;
}

export type RecursoPermiso = 'camara' | 'ubicacion' | 'notificaciones';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';
