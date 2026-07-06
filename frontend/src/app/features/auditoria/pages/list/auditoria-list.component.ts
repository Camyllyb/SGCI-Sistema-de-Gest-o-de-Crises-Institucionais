import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuditoriaFacets, AuditoriaLog } from '../../models/auditoria.model';
import { AuditoriaService } from '../../services/auditoria.service';

@Component({
  selector: 'app-auditoria-list',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './auditoria-list.component.html',
  styleUrl: './auditoria-list.component.scss',
})
export class AuditoriaListComponent implements OnInit {
  private readonly auditoriaService = inject(AuditoriaService);

  readonly logs = signal<AuditoriaLog[]>([]);
  readonly facets = signal<AuditoriaFacets>({ entidades: [], acoes: [], usuarios: [] });
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly filtroEntidade = signal('');
  readonly filtroAcao = signal('');
  readonly filtroUsuario = signal('');

  readonly hasFiltros = computed(
    () => !!this.filtroEntidade() || !!this.filtroAcao() || !!this.filtroUsuario(),
  );

  ngOnInit(): void {
    this.carregarFacets();
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.error.set(null);
    this.auditoriaService
      .listAll({
        entidade: this.filtroEntidade() || undefined,
        acao: this.filtroAcao() || undefined,
        usuario: this.filtroUsuario() || undefined,
      })
      .subscribe({
        next: (data) => {
          this.logs.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar os registros de auditoria.');
          this.loading.set(false);
        },
      });
  }

  limparFiltros(): void {
    this.filtroEntidade.set('');
    this.filtroAcao.set('');
    this.filtroUsuario.set('');
    this.carregar();
  }

  private carregarFacets(): void {
    this.auditoriaService.facets().subscribe({
      next: (data) => this.facets.set(data),
      error: () => {
        /* filtros seguem operando por texto livre mesmo sem as facetas */
      },
    });
  }

  acaoClass(acao: string): string {
    switch (acao) {
      case 'CRIAR':
        return 'badge badge--success';
      case 'ATUALIZAR':
        return 'badge badge--info';
      case 'EXCLUIR':
        return 'badge badge--danger';
      default:
        return 'badge badge--neutral';
    }
  }

  statusClass(status: number): string {
    if (status >= 500) {
      return 'badge badge--danger';
    }
    if (status >= 400) {
      return 'badge badge--warning';
    }
    if (status >= 200 && status < 300) {
      return 'badge badge--success';
    }
    return 'badge badge--neutral';
  }
}
