import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { extractApiError } from '../../../../core/utils/http-error';
import { Departamento } from '../../../departamentos/models/departamento.model';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { TipoCrise } from '../../../tipos-crise/models/tipo-crise.model';
import { TipoCriseService } from '../../../tipos-crise/services/tipo-crise.service';
import { CenarioRequest } from '../../models/cenario.model';
import { CenarioService } from '../../services/cenario.service';

@Component({
  selector: 'app-cenario-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './cenario-form.component.html',
})
export class CenarioFormComponent implements OnInit {
  private readonly cenarioService = inject(CenarioService);
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly id = signal<number | null>(null);
  readonly tipos = signal<TipoCrise[]>([]);
  readonly departamentos = signal<Departamento[]>([]);
  readonly niveis = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];

  model: CenarioRequest = {
    descricao: '',
    nivelSugerido: null,
    tipoCriseId: null as unknown as number,
    departamentoId: null as unknown as number,
  };

  ngOnInit(): void {
    this.tipoCriseService.listAll().subscribe((d) => this.tipos.set(d));
    this.departamentoService.listAll().subscribe((d) => this.departamentos.set(d));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.loading.set(true);
      this.cenarioService.findById(id).subscribe({
        next: (data) => {
          this.model = {
            descricao: data.descricao,
            nivelSugerido: data.nivelSugerido,
            tipoCriseId: data.tipoCriseId,
            departamentoId: data.departamentoId,
          };
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar o cenário.');
          this.loading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.saving.set(true);
    this.error.set(null);
    const id = this.id();
    const request$ = id ? this.cenarioService.update(id, this.model) : this.cenarioService.create(this.model);
    request$.subscribe({
      next: () => this.router.navigate(['/cenarios']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível salvar o cenário. Verifique os campos.'));
        this.saving.set(false);
      },
    });
  }
}
