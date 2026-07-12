import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { extractApiError } from '../../../../core/utils/http-error';
import { PASSWORD_MIN_LENGTH, validatePasswordPolicy } from '../../../../core/utils/password-policy';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  private token = '';

  readonly newPassword = signal('');
  readonly confirmPassword = signal('');
  readonly loading = signal(false);
  readonly done = signal(false);
  readonly tokenMissing = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly minLength = PASSWORD_MIN_LENGTH;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.tokenMissing.set(this.token.length === 0);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

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
    this.authService.resetPassword({ token: this.token, newPassword: this.newPassword() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.done.set(true);
        this.toast.success('Senha redefinida com sucesso.');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          extractApiError(err, 'Não foi possível redefinir a senha. O link pode ter expirado.'),
        );
      },
    });
  }
}
