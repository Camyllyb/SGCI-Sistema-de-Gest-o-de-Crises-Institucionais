import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
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
          this.router.navigate([response.mustChangePassword ? '/trocar-senha' : '/dashboard']);
        } else {
          this.errorMessage.set(response.message);
        }
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Credenciais inválidas');
      },
    });
  }
}
