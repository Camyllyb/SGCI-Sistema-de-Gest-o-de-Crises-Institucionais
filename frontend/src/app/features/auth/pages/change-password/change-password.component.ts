import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentPassword = signal('');
  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly errorMessage = signal<string | null>(null);
  readonly loading = signal(false);

  readonly user = this.authService.currentUser;

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('A confirmação não corresponde à nova senha.');
      return;
    }
    if (this.newPassword().length < 6) {
      this.errorMessage.set('A nova senha deve ter ao menos 6 caracteres.');
      return;
    }

    this.loading.set(true);
    this.authService
      .changePassword({ currentPassword: this.currentPassword(), newPassword: this.newPassword() })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err?.error?.message ?? 'Não foi possível alterar a senha. Verifique a senha atual.',
          );
        },
      });
  }
}
