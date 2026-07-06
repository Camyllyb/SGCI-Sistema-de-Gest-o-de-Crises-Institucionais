import { Component, OnInit, inject, signal } from '@angular/core';

import { Cenario } from '../../models/cenario.model';
import { CenarioService } from '../../services/cenario.service';

@Component({
  selector: 'app-cenario-list',
  standalone: true,
  imports: [],
  templateUrl: './cenario-list.component.html',
})
export class CenarioListComponent implements OnInit {
  private readonly cenarioService = inject(CenarioService);

  readonly cenarios = signal<Cenario[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
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
}
