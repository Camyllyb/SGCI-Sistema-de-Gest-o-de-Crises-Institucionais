import { Component, OnInit, inject, signal } from '@angular/core';

import { Departamento } from '../../models/departamento.model';
import { DepartamentoService } from '../../services/departamento.service';

@Component({
  selector: 'app-departamento-list',
  standalone: true,
  imports: [],
  templateUrl: './departamento-list.component.html',
  styleUrl: './departamento-list.component.scss',
})
export class DepartamentoListComponent implements OnInit {
  private readonly departamentoService = inject(DepartamentoService);

  readonly departamentos = signal<Departamento[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.departamentoService.listAll().subscribe({
      next: (data) => {
        this.departamentos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os departamentos.');
        this.loading.set(false);
      },
    });
  }
}
