import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { extractApiError } from '../../../../core/utils/http-error';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);

  readonly email = signal('');
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit(): void {
    this.errorMessage.set(null);
    const email = this.email().trim();
    if (!email) {
      this.errorMessage.set('Informe o e-mail cadastrado.');
      return;
    }

    this.loading.set(true);
    this.authService.forgotPassword(email).subscribe({
      // Resposta sempre neutra: não revelamos se o e-mail existe.
      next: () => {
        this.loading.set(false);
        this.submitted.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        // Erro de validação (e-mail malformado) volta para o formulário; falhas
        // de servidor também não devem vazar existência de conta.
        if (err?.status === 400) {
          this.errorMessage.set(extractApiError(err, 'E-mail inválido.'));
        } else {
          this.submitted.set(true);
        }
      },
    });
  }
}
