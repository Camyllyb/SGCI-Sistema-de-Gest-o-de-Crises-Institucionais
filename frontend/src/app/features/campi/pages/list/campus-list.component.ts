import { Component, OnInit, inject, signal } from '@angular/core';

import { Campus } from '../../models/campus.model';
import { CampusService } from '../../services/campus.service';

@Component({
  selector: 'app-campus-list',
  standalone: true,
  imports: [],
  templateUrl: './campus-list.component.html',
})
export class CampusListComponent implements OnInit {
  private readonly campusService = inject(CampusService);

  readonly campi = signal<Campus[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.campusService.listAll().subscribe({
      next: (data) => {
        this.campi.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os campi.');
        this.loading.set(false);
      },
    });
  }
}
