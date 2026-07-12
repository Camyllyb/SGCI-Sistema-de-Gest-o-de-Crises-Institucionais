import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * Protege rotas exclusivas do ADMIN. Revalida o usuário no backend e redireciona
 * para a tela de acesso negado (autenticado sem permissão) ou login (não autenticado).
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.fetchCurrentUser().pipe(
    map((user) => (user.perfil === 'ADMIN' ? true : router.parseUrl('/acesso-negado'))),
    catchError(() => of(router.parseUrl('/login'))),
  );
};
