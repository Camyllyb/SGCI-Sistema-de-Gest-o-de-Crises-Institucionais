import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * Exige um usuário autenticado. O primeiro acesso (troca de senha obrigatória)
 * não é mais tratado por redirecionamento: o layout autenticado exibe um modal
 * bloqueante enquanto {@code mustChangePassword} for verdadeiro.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.fetchCurrentUser().pipe(
    map(() => true),
    catchError(() => of(router.parseUrl('/login'))),
  );
};
