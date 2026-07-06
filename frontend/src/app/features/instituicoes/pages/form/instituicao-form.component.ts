import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { InstituicaoRequest } from '../../models/instituicao.model';
import { InstituicaoService } from '../../services/instituicao.service';

@Component({
  selector: 'app-instituicao-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './instituicao-form.component.html',
})
export class InstituicaoFormComponent implements OnInit {
  private readonly instituicaoService = inject(InstituicaoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly id = signal<number | null>(null);

  model: InstituicaoRequest = { nome: '', sigla: '' };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.loading.set(true);
      this.instituicaoService.findById(id).subscribe({
        next: (data) => {
          this.model = { nome: data.nome, sigla: data.sigla };
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar a instituição.');
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
      ? this.instituicaoService.update(id, this.model)
      : this.instituicaoService.create(this.model);
    request$.subscribe({
      next: () => this.router.navigate(['/instituicoes']),
      error: () => {
        this.error.set('Não foi possível salvar a instituição. Verifique os campos.');
        this.saving.set(false);
      },
    });
  }
}
