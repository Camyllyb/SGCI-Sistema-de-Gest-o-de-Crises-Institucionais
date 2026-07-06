import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * Protege a página de troca de senha: exige apenas usuário autenticado. Se já não
 * precisa mais trocar a senha, envia para o painel.
 */
export const changePasswordGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.fetchCurrentUser().pipe(
    map((user) => (user.mustChangePassword ? true : router.parseUrl('/dashboard'))),
    catchError(() => of(router.parseUrl('/login'))),
  );
};
