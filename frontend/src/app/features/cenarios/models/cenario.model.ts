export interface Cenario {
  id: number;
  descricao: string;
  nivelSugerido: string | null;
  tipoCriseId: number;
  departamentoId: number;
  active: boolean;
  createdAt: string;
}

export interface CenarioRequest {
  descricao: string;
  nivelSugerido: string | null;
  tipoCriseId: number;
  departamentoId: number;
}
