export type TipoAcao = 'CONTENCAO' | 'COMUNICACAO' | 'MONITORAMENTO' | 'RESOLUCAO';

export interface Acao {
  id: number;
  descricao: string;
  tipo: TipoAcao;
  criseId: number;
  usuarioId: number;
  createdAt: string;
}

export interface AcaoRequest {
  descricao: string;
  tipo: TipoAcao;
}
