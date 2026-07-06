import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Crise } from '../../models/crise.model';
import { CriseService } from '../../services/crise.service';

@Component({
  selector: 'app-crise-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './crise-list.component.html',
})
export class CriseListComponent implements OnInit {
  private readonly criseService = inject(CriseService);

  readonly crises = signal<Crise[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.criseService.listAll().subscribe({
      next: (data) => {
        this.crises.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar as crises.');
        this.loading.set(false);
      },
    });
  }
}
