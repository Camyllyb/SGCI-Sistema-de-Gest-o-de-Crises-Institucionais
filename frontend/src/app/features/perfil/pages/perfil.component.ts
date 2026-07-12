import { Component, OnInit, inject, signal } from '@angular/core';

import { ChangePasswordModalComponent } from '../../auth/components/change-password-modal/change-password-modal.component';
import { Profile } from '../../../core/models/profile.model';
import { Perfil } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { extractApiError } from '../../../core/utils/http-error';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ChangePasswordModalComponent],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  private readonly authService = inject(AuthService);

  readonly profile = signal<Profile | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly showPasswordModal = signal(false);

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível carregar o perfil.'));
        this.loading.set(false);
      },
    });
  }

  perfilLabel(perfil: Perfil): string {
    return perfil === 'ADMIN' ? 'Administrador' : 'Usuário';
  }

  openPasswordModal(): void {
    this.showPasswordModal.set(true);
  }

  closePasswordModal(): void {
    this.showPasswordModal.set(false);
  }
}
