import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { extractApiError } from '../../../../core/utils/http-error';
import { Instituicao } from '../../../instituicoes/models/instituicao.model';
import { InstituicaoService } from '../../../instituicoes/services/instituicao.service';
import { Campus } from '../../models/campus.model';
import { CampusService } from '../../services/campus.service';

@Component({
  selector: 'app-campus-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './campus-list.component.html',
})
export class CampusListComponent implements OnInit {
  private readonly campusService = inject(CampusService);
  private readonly instituicaoService = inject(InstituicaoService);

  readonly campi = signal<Campus[]>([]);
  readonly instituicoes = signal<Map<number, string>>(new Map());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadInstituicoes();
    this.load();
  }

  loadInstituicoes(): void {
    this.instituicaoService.listAll().subscribe({
      next: (data: Instituicao[]) =>
        this.instituicoes.set(new Map(data.map((inst) => [inst.id, inst.nome]))),
      error: () => this.instituicoes.set(new Map()),
    });
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.campusService.listAll().subscribe({
      next: (data) => {
        this.campi.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os campi.');
        this.loading.set(false);
      },
    });
  }

  instituicaoNome(id: number): string {
    return this.instituicoes().get(id) ?? '-';
  }

  remove(item: Campus): void {
    if (!confirm(`Excluir o campus "${item.nome}"?`)) {
      return;
    }
    this.campusService.deactivate(item.id).subscribe({
      next: () => this.load(),
      error: (err) =>
        this.error.set(extractApiError(err, 'Não foi possível excluir o campus. Verifique se ele não está em uso.')),
    });
  }
}
