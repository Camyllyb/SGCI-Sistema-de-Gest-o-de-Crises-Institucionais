export interface AuditoriaLog {
  id: number;
  usuarioId: number;
  usuarioNome: string;
  acao: string;
  metodoHttp: string;
  entidadeAfetada: string;
  recurso: string;
  statusResposta: number;
  dataHora: string;
}

export interface AuditoriaFacets {
  entidades: string[];
  acoes: string[];
  usuarios: string[];
}

export interface AuditoriaFiltro {
  entidade?: string;
  acao?: string;
  usuario?: string;
}
