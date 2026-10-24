export type Genero = 'Male' | 'Female' | 'Unknown';

export type FiltroGenero = 'todos' | Genero;

export interface OpcionGenero {
  valor: Genero;
  etiqueta: string;
}

export const GENEROS: OpcionGenero[] = [
  { valor: 'Male', etiqueta: 'Masculino' },
  { valor: 'Female', etiqueta: 'Femenino' },
  { valor: 'Unknown', etiqueta: 'Desconocido' },
];
