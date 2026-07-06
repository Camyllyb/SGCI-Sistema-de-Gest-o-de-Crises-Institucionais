export interface Campus {
  id: number;
  nome: string;
  instituicaoId: number;
  active: boolean;
  createdAt: string;
}

export interface CampusRequest {
  nome: string;
  instituicaoId: number;
}
