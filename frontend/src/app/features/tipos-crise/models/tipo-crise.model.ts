export interface TipoCrise {
  id: number;
  nome: string;
  descricao: string | null;
  active: boolean;
  createdAt: string;
}

export interface TipoCriseRequest {
  nome: string;
  descricao: string | null;
}
