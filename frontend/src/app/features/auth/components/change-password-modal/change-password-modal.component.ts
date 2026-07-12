import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalComponent } from '../../../../core/components/modal/modal.component';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { extractApiError } from '../../../../core/utils/http-error';
import { PASSWORD_MIN_LENGTH, validatePasswordPolicy } from '../../../../core/utils/password-policy';

/**
 * Modal de troca de senha reutilizável.
 *
 * - `mandatory=true`: fluxo obrigatório de primeiro acesso — não pode ser fechado
 *   e exibe mensagem explicativa. Usado como bloqueio global no layout.
 * - `mandatory=false`: acionado pelo botão "Alterar senha" em Meu Perfil.
 */
@Component({
  selector: 'app-change-password-modal',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './change-password-modal.component.html',
})
export class ChangePasswordModalComponent {
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly mandatory = input(false);
  readonly changed = output<void>();
  readonly closed = output<void>();

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly errorMessage = signal<string | null>(null);
  readonly loading = signal(false);

  readonly minLength = PASSWORD_MIN_LENGTH;
  readonly title = computed(() => (this.mandatory() ? 'Definição de senha obrigatória' : 'Alterar senha'));

  onClose(): void {
    if (!this.loading()) {
      this.closed.emit();
    }
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (!this.currentPassword()) {
      this.errorMessage.set('Informe a senha atual.');
      return;
    }
    const policyError = validatePasswordPolicy(this.newPassword());
    if (policyError) {
      this.errorMessage.set(policyError);
      return;
    }
    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('A confirmação não corresponde à nova senha.');
      return;
    }

    this.loading.set(true);
    this.authService
      .changePassword({ currentPassword: this.currentPassword(), newPassword: this.newPassword() })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toast.success('Senha alterada com sucesso.');
          this.changed.emit();
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            extractApiError(err, 'Não foi possível alterar a senha. Verifique a senha atual.'),
          );
        },
      });
  }
}
