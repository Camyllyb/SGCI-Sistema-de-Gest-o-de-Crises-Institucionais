import { Perfil } from '../../../core/models/user.model';

export type { Perfil };

export interface Usuario {
  id: number;
  name: string;
  email: string;
  perfil: Perfil;
  departamentoId: number | null;
  active: boolean;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface UsuarioRequest {
  name: string;
  email: string;
  password?: string | null;
  perfil: Perfil;
  departamentoId: number | null;
  active?: boolean;
}
