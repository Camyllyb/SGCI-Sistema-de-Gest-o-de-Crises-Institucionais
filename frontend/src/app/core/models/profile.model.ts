import { Perfil } from './user.model';

/** Dados cadastrais exibidos em "Meu Perfil" (somente leitura para o usuário). */
export interface Profile {
  id: number;
  name: string;
  email: string;
  perfil: Perfil;
  cargo: string | null;
  departamentoId: number | null;
  departamentoNome: string | null;
  instituicaoId: number | null;
  instituicaoNome: string | null;
}
