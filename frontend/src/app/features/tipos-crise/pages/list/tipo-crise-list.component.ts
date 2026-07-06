import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { extractApiError } from '../../../../core/utils/http-error';
import { TipoCrise } from '../../models/tipo-crise.model';
import { TipoCriseService } from '../../services/tipo-crise.service';

@Component({
  selector: 'app-tipo-crise-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tipo-crise-list.component.html',
  styleUrl: './tipo-crise-list.component.scss',
})
export class TipoCriseListComponent implements OnInit {
  private readonly tipoCriseService = inject(TipoCriseService);

  readonly tipos = signal<TipoCrise[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.tipoCriseService.listAll().subscribe({
      next: (data) => {
        this.tipos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os tipos de crise.');
        this.loading.set(false);
      },
    });
  }

  remove(tipo: TipoCrise): void {
    if (!confirm(`Excluir o tipo de crise "${tipo.nome}"?`)) {
      return;
    }
    this.tipoCriseService.deactivate(tipo.id).subscribe({
      next: () => this.load(),
      error: (err) =>
        this.error.set(
          extractApiError(err, 'Não foi possível excluir o tipo de crise. Verifique se ele não está em uso.'),
        ),
    });
  }
}
