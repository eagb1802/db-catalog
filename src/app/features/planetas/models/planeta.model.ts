import { Personaje } from '../../personajes/models/personaje.model';

export interface Planeta {
  id: number;
  name: string;
  isDestroyed: boolean;
  description: string;
  image: string;
  deletedAt?: string | null;
}

export interface PlanetaDetalle extends Planeta {
  characters?: Personaje[];
}

export type FiltroEstadoPlaneta = 'todos' | 'intactos' | 'destruidos';

export interface FiltroPlaneta {
  pagina: number;
  nombre: string;
  estado: FiltroEstadoPlaneta;
}

export interface OpcionEstadoPlaneta {
  valor: FiltroEstadoPlaneta;
  etiqueta: string;
}

export const ESTADOS_PLANETA: OpcionEstadoPlaneta[] = [
  { valor: 'todos', etiqueta: 'Todos los estados' },
  { valor: 'intactos', etiqueta: 'Intactos' },
  { valor: 'destruidos', etiqueta: 'Destruidos' },
];
