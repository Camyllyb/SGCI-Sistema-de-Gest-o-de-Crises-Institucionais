import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DashboardResumo } from '../models/dashboard.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly resumo = signal<DashboardResumo | null>(null);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.dashboardService.resumo().subscribe({
      next: (data) => this.resumo.set(data),
      error: () => this.error.set('Não foi possível carregar os indicadores.'),
    });
  }
}
