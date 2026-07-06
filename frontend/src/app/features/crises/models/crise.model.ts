export type NivelCriticidade = 'BAIXO' | 'MEDIO' | 'ALTO' | 'CRITICO';
export type StatusCrise = 'ABERTA' | 'EM_ANDAMENTO' | 'RESOLVIDA' | 'ENCERRADA';

export interface Crise {
  id: number;
  titulo: string;
  descricao: string;
  status: StatusCrise;
  nivel: NivelCriticidade;
  tipoCriseId: number;
  campusId: number;
  cenarioId: number | null;
  departamentoId: number;
  active: boolean;
  createdAt: string;
}

export interface CriseRequest {
  titulo: string;
  descricao: string;
  nivel: NivelCriticidade;
  tipoCriseId: number;
  campusId: number;
  cenarioId: number | null;
  departamentoId: number;
}
