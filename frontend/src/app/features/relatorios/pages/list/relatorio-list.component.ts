import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RoleDirective } from '../../../../core/directives/role.directive';
import { extractApiError } from '../../../../core/utils/http-error';
import { Relatorio } from '../../models/relatorio.model';
import { RelatorioService } from '../../services/relatorio.service';

@Component({
  selector: 'app-relatorio-list',
  standalone: true,
  imports: [RouterLink, RoleDirective],
  templateUrl: './relatorio-list.component.html',
})
export class RelatorioListComponent implements OnInit {
  private readonly relatorioService = inject(RelatorioService);

  readonly relatorios = signal<Relatorio[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.relatorioService.listAll().subscribe({
      next: (data) => {
        this.relatorios.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível carregar os relatórios.'));
        this.loading.set(false);
      },
    });
  }
}
