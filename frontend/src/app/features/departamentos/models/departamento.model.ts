export interface Departamento {
  id: number;
  nome: string;
  sigla: string;
  active: boolean;
  createdAt: string;
}

export interface DepartamentoRequest {
  nome: string;
  sigla: string;
}
