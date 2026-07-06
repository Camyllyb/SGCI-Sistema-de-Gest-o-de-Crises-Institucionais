import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { TipoCriseRequest } from '../../models/tipo-crise.model';
import { TipoCriseService } from '../../services/tipo-crise.service';

@Component({
  selector: 'app-tipo-crise-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './tipo-crise-form.component.html',
})
export class TipoCriseFormComponent implements OnInit {
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly id = signal<number | null>(null);

  model: TipoCriseRequest = { nome: '', descricao: null };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.loading.set(true);
      this.tipoCriseService.findById(id).subscribe({
        next: (data) => {
          this.model = { nome: data.nome, descricao: data.descricao };
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar o tipo de crise.');
          this.loading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.saving.set(true);
    this.error.set(null);
    const id = this.id();
    const request$ = id ? this.tipoCriseService.update(id, this.model) : this.tipoCriseService.create(this.model);
    request$.subscribe({
      next: () => this.router.navigate(['/tipos-crise']),
      error: () => {
        this.error.set('Não foi possível salvar o tipo de crise. Verifique os campos.');
        this.saving.set(false);
      },
    });
  }
}
