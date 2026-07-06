import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

import { AuthService } from '../services/auth.service';

/**
 * Diretiva estrutural de controle de acesso visual.
 *
 * Renderiza o elemento apenas quando o perfil do usuário autenticado estiver
 * na lista informada. Uso: `*appRole="['ADMIN']"` ou `*appRole="'ADMIN'"`.
 * Reage automaticamente a login/logout por observar o signal de usuário.
 */
@Directive({
  selector: '[appRole]',
  standalone: true,
})
export class RoleDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly auth = inject(AuthService);

  readonly appRole = input.required<string[] | string>();

  private rendered = false;

  constructor() {
    effect(() => {
      const roles = this.appRole();
      const allowed = Array.isArray(roles) ? roles : [roles];
      const user = this.auth.currentUser();
      this.toggle(!!user && allowed.includes(user.perfil));
    });
  }

  private toggle(permitted: boolean): void {
    if (permitted && !this.rendered) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.rendered = true;
    } else if (!permitted && this.rendered) {
      this.viewContainer.clear();
      this.rendered = false;
    }
  }
}
