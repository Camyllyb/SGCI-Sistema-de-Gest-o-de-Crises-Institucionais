export interface Relatorio {
  id: number;
  titulo: string;
  resumoOcorrido: string;
  impactosIdentificados: string | null;
  acoesRealizadas: string | null;
  resultadoFinal: string | null;
  recomendacoes: string | null;
  criseId: number;
  usuarioId: number;
  createdAt: string;
}

export interface RelatorioRequest {
  titulo: string;
  resumoOcorrido: string;
  impactosIdentificados: string | null;
  acoesRealizadas: string | null;
  resultadoFinal: string | null;
  recomendacoes: string | null;
  criseId: number;
}
