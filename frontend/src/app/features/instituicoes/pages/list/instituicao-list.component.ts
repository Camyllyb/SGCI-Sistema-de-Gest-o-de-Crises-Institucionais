import { Component, OnInit, inject, signal } from '@angular/core';

import { Instituicao } from '../../models/instituicao.model';
import { InstituicaoService } from '../../services/instituicao.service';

@Component({
  selector: 'app-instituicao-list',
  standalone: true,
  imports: [],
  templateUrl: './instituicao-list.component.html',
})
export class InstituicaoListComponent implements OnInit {
  private readonly instituicaoService = inject(InstituicaoService);

  readonly instituicoes = signal<Instituicao[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.instituicaoService.listAll().subscribe({
      next: (data) => {
        this.instituicoes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as instituições.');
        this.loading.set(false);
      },
    });
  }
}
