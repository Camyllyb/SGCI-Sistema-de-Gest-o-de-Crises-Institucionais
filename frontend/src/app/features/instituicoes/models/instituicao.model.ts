export interface Instituicao {
  id: number;
  nome: string;
  sigla: string;
  active: boolean;
  createdAt: string;
}

export interface InstituicaoRequest {
  nome: string;
  sigla: string;
}
