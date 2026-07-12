import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { extractApiError } from '../../../../core/utils/http-error';
import { CampusService } from '../../../campi/services/campus.service';
import { TipoCriseService } from '../../../tipos-crise/services/tipo-crise.service';
import { Crise, NivelCriticidade, StatusCrise } from '../../models/crise.model';
import { CriseService } from '../../services/crise.service';

type SortOption = 'recentes' | 'antigas' | 'nivel' | 'titulo';

@Component({
  selector: 'app-crise-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './crise-list.component.html',
})
export class CriseListComponent implements OnInit {
  private readonly criseService = inject(CriseService);
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly campusService = inject(CampusService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly crises = signal<Crise[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly isAdmin = computed(() => this.auth.currentUser()?.perfil === 'ADMIN');

  // Filtros / ordenação / paginação
  readonly search = signal('');
  readonly statusFilter = signal<StatusCrise | ''>('');
  readonly nivelFilter = signal<NivelCriticidade | ''>('');
  readonly dataDe = signal('');
  readonly dataAte = signal('');
  readonly sort = signal<SortOption>('recentes');
  readonly page = signal(0);
  readonly pageSize = 8;

  readonly statusOptions: StatusCrise[] = ['ABERTA', 'EM_ANDAMENTO', 'RESOLVIDA', 'ENCERRADA'];
  readonly nivelOptions: NivelCriticidade[] = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];

  private readonly nivelPeso: Record<NivelCriticidade, number> = {
    CRITICO: 4,
    ALTO: 3,
    MEDIO: 2,
    BAIXO: 1,
  };

  private readonly tipos = signal<Map<number, string>>(new Map());
  private readonly campi = signal<Map<number, string>>(new Map());

  /** Lista após busca, filtros e ordenação (antes da paginação). */
  readonly filtered = computed<Crise[]>(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const nivel = this.nivelFilter();
    const de = this.dataDe();
    const ate = this.dataAte();

    let list = this.crises().filter((c) => {
      if (term && !c.titulo.toLowerCase().includes(term) && !c.descricao.toLowerCase().includes(term)) {
        return false;
      }
      if (status && c.status !== status) {
        return false;
      }
      if (nivel && c.nivel !== nivel) {
        return false;
      }
      const dia = c.createdAt.slice(0, 10); // yyyy-MM-dd
      if (de && dia < de) {
        return false;
      }
      if (ate && dia > ate) {
        return false;
      }
      return true;
    });

    const sort = this.sort();
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'antigas':
          return a.createdAt.localeCompare(b.createdAt);
        case 'nivel':
          return this.nivelPeso[b.nivel] - this.nivelPeso[a.nivel];
        case 'titulo':
          return a.titulo.localeCompare(b.titulo);
        case 'recentes':
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
    return list;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  readonly safePage = computed(() => Math.min(this.page(), this.totalPages() - 1));
  readonly paged = computed<Crise[]>(() => {
    const start = this.safePage() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });
  readonly hasActiveFilters = computed(
    () =>
      !!this.search() ||
      !!this.statusFilter() ||
      !!this.nivelFilter() ||
      !!this.dataDe() ||
      !!this.dataAte(),
  );

  ngOnInit(): void {
    // Prefill de busca vindo da barra de pesquisa global do header (?q=).
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) {
      this.search.set(q);
    }

    this.tipoCriseService.listAll().subscribe({
      next: (data) => this.tipos.set(new Map(data.map((t) => [t.id, t.nome]))),
      error: () => this.tipos.set(new Map()),
    });
    this.campusService.listAll().subscribe({
      next: (data) => this.campi.set(new Map(data.map((c) => [c.id, c.nome]))),
      error: () => this.campi.set(new Map()),
    });
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
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível carregar as crises.'));
        this.loading.set(false);
      },
    });
  }

  /** Volta à primeira página sempre que um filtro muda. */
  resetPage(): void {
    this.page.set(0);
  }

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.nivelFilter.set('');
    this.dataDe.set('');
    this.dataAte.set('');
    this.resetPage();
  }

  prevPage(): void {
    this.page.set(Math.max(0, this.safePage() - 1));
  }

  nextPage(): void {
    this.page.set(Math.min(this.totalPages() - 1, this.safePage() + 1));
  }

  tipoNome(id: number): string {
    return this.tipos().get(id) ?? `#${id}`;
  }

  campusNome(id: number): string {
    return this.campi().get(id) ?? `#${id}`;
  }
}
