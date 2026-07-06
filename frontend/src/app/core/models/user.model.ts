export type Perfil = 'ADMIN' | 'COMUM';

export interface User {
  id: number;
  name: string;
  email: string;
  perfil: Perfil;
  mustChangePassword: boolean;
}
