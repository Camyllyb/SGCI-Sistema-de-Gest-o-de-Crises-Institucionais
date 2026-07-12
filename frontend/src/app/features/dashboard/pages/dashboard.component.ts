import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { extractApiError } from '../../../core/utils/http-error';
import { Crise } from '../../crises/models/crise.model';
import { CriseService } from '../../crises/services/crise.service';
import { AdminDashboardComponent } from './admin-dashboard.component';

/**
 * Página inicial. Atua como um switch por perfil:
 * - ADMIN  → delega ao {@link AdminDashboardComponent} (centro de monitoramento).
 * - COMUM  → mantém a home enxuta (resumo das próprias crises), inalterada.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, AdminDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly criseService = inject(CriseService);
  private readonly auth = inject(AuthService);

  readonly user = this.auth.currentUser;
  readonly isAdmin = computed(() => this.user()?.perfil === 'ADMIN');

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  private readonly crises = signal<Crise[]>([]);

  readonly totalCrises = computed(() => this.crises().length);
  readonly emAberto = computed(
    () => this.crises().filter((c) => c.status === 'ABERTA' || c.status === 'EM_ANDAMENTO').length,
  );
  readonly encerradas = computed(
    () => this.crises().filter((c) => c.status === 'RESOLVIDA' || c.status === 'ENCERRADA').length,
  );
  readonly ultimasCrises = computed(() => this.crises().slice(0, 5));

  ngOnInit(): void {
    // O painel do ADMIN carrega os próprios dados; aqui só tratamos o COMUM.
    if (this.isAdmin()) {
      this.loading.set(false);
      return;
    }
    this.criseService.listAll().subscribe({
      next: (data) => {
        this.crises.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível carregar suas crises.'));
        this.loading.set(false);
      },
    });
  }
}
