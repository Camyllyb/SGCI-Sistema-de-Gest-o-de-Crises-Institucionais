import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { extractApiError } from '../../../../core/utils/http-error';
import { Instituicao } from '../../../instituicoes/models/instituicao.model';
import { InstituicaoService } from '../../../instituicoes/services/instituicao.service';
import { CampusRequest } from '../../models/campus.model';
import { CampusService } from '../../services/campus.service';

@Component({
  selector: 'app-campus-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './campus-form.component.html',
})
export class CampusFormComponent implements OnInit {
  private readonly campusService = inject(CampusService);
  private readonly instituicaoService = inject(InstituicaoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly id = signal<number | null>(null);
  readonly instituicoes = signal<Instituicao[]>([]);

  model: CampusRequest = { nome: '', instituicaoId: null as unknown as number };

  ngOnInit(): void {
    this.instituicaoService.listAll().subscribe((data) => this.instituicoes.set(data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.loading.set(true);
      this.campusService.findById(id).subscribe({
        next: (data) => {
          this.model = { nome: data.nome, instituicaoId: data.instituicaoId };
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar o campus.');
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
      ? this.campusService.update(id, this.model)
      : this.campusService.create(this.model);
    request$.subscribe({
      next: () => this.router.navigate(['/campi']),
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível salvar o campus. Verifique os campos.'));
        this.saving.set(false);
      },
    });
  }
}
