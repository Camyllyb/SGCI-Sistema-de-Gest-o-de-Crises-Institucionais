import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Departamento } from '../../../departamentos/models/departamento.model';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { TipoCrise } from '../../../tipos-crise/models/tipo-crise.model';
import { TipoCriseService } from '../../../tipos-crise/services/tipo-crise.service';
import { Cenario } from '../../models/cenario.model';
import { CenarioService } from '../../services/cenario.service';

@Component({
  selector: 'app-cenario-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cenario-list.component.html',
})
export class CenarioListComponent implements OnInit {
  private readonly cenarioService = inject(CenarioService);
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly departamentoService = inject(DepartamentoService);

  readonly cenarios = signal<Cenario[]>([]);
  readonly tipos = signal<TipoCrise[]>([]);
  readonly departamentos = signal<Departamento[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.tipoCriseService.listAll().subscribe((d) => this.tipos.set(d));
    this.departamentoService.listAll().subscribe((d) => this.departamentos.set(d));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.cenarioService.listAll().subscribe({
      next: (data) => {
        this.cenarios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os cenários de crise.');
        this.loading.set(false);
      },
    });
  }

  tipoNome(id: number): string {
    return this.tipos().find((t) => t.id === id)?.nome ?? '#' + id;
  }

  departamentoNome(id: number): string {
    return this.departamentos().find((d) => d.id === id)?.nome ?? '#' + id;
  }

  remove(item: Cenario): void {
    if (!confirm(`Excluir o cenário "${item.descricao}"?`)) {
      return;
    }
    this.cenarioService.deactivate(item.id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Não foi possível excluir o cenário.'),
    });
  }
}
