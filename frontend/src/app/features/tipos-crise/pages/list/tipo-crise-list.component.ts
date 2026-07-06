import { Component, OnInit, inject, signal } from '@angular/core';

import { TipoCrise } from '../../models/tipo-crise.model';
import { TipoCriseService } from '../../services/tipo-crise.service';

@Component({
  selector: 'app-tipo-crise-list',
  standalone: true,
  imports: [],
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
}
