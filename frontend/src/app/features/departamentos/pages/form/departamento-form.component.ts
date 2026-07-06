import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { extractApiError } from '../../../../core/utils/http-error';
import { DepartamentoRequest } from '../../models/departamento.model';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './departamento-form.component.html',
})
export class DepartamentoFormComponent implements OnInit {
  private readonly departamentoService = inject(DepartamentoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly id = signal<number | null>(null);

  model: DepartamentoRequest = { nome: '', sigla: '' };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.loading.set(true);
      this.departamentoService.findById(id).subscribe({
        next: (data) => {
          this.model = { nome: data.nome, sigla: data.sigla };
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar o departamento.');
          this.loading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.saving.set(true);
    this.error.set(null);
    const id = this.id();
    const request$ = id
      ? this.departamentoService.update(id, this.model)
      : this.departamentoService.create(this.model);
    request$.subscribe({
      next: () => this.router.navigate(['/departamentos']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível salvar o departamento. Verifique os campos.'));
        this.saving.set(false);
      },
    });
  }
}
