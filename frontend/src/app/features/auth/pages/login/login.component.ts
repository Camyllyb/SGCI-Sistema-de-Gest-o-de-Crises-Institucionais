import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { extractApiError } from '../../../../core/utils/http-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly email = signal('');
  readonly password = signal('');
  readonly errorMessage = signal<string | null>(null);
  readonly loading = signal(false);

  onSubmit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.authenticated) {
          // O primeiro acesso é tratado por um modal bloqueante no layout; por
          // isso navegamos sempre para a tela inicial.
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage.set(response.message);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(extractApiError(err, 'E-mail ou senha inválidos.'));
      },
    });
  }
}
