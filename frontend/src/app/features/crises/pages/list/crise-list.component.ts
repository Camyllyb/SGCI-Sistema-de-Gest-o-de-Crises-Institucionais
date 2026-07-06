import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { extractApiError } from '../../../../core/utils/http-error';
import { CampusService } from '../../../campi/services/campus.service';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { TipoCriseService } from '../../../tipos-crise/services/tipo-crise.service';
import { Crise } from '../../models/crise.model';
import { CriseService } from '../../services/crise.service';

@Component({
  selector: 'app-crise-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './crise-list.component.html',
})
export class CriseListComponent implements OnInit {
  private readonly criseService = inject(CriseService);
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly campusService = inject(CampusService);
  private readonly departamentoService = inject(DepartamentoService);

  readonly crises = signal<Crise[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly tipos = signal<Map<number, string>>(new Map());
  private readonly campi = signal<Map<number, string>>(new Map());
  private readonly departamentos = signal<Map<number, string>>(new Map());

  ngOnInit(): void {
    this.tipoCriseService.listAll().subscribe({
      next: (data) => this.tipos.set(new Map(data.map((t) => [t.id, t.nome]))),
      error: () => this.tipos.set(new Map()),
    });
    this.campusService.listAll().subscribe({
      next: (data) => this.campi.set(new Map(data.map((c) => [c.id, c.nome]))),
      error: () => this.campi.set(new Map()),
    });
    this.departamentoService.listAll().subscribe({
      next: (data) => this.departamentos.set(new Map(data.map((d) => [d.id, d.nome]))),
      error: () => this.departamentos.set(new Map()),
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.criseService.listAll().subscribe({
      next: (data) => {
        this.crises.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível carregar as crises.'));
        this.loading.set(false);
      },
    });
  }

  tipoNome(id: number): string {
    return this.tipos().get(id) ?? `#${id}`;
  }

  campusNome(id: number): string {
    return this.campi().get(id) ?? `#${id}`;
  }

  departamentoNome(id: number): string {
    return this.departamentos().get(id) ?? `#${id}`;
  }
}
