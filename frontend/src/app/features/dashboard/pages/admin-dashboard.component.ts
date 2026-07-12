import { DatePipe, LowerCasePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { BarChartComponent } from '../../../core/components/charts/bar-chart.component';
import { ChartBar, ChartPoint, ChartSlice } from '../../../core/components/charts/chart.types';
import { LineChartComponent } from '../../../core/components/charts/line-chart.component';
import { PieChartComponent } from '../../../core/components/charts/pie-chart.component';
import { extractApiError } from '../../../core/utils/http-error';
import { AuditoriaService } from '../../auditoria/services/auditoria.service';
import { AuditoriaLog } from '../../auditoria/models/auditoria.model';
import { Campus } from '../../campi/models/campus.model';
import { CampusService } from '../../campi/services/campus.service';
import { Crise, NivelCriticidade, StatusCrise } from '../../crises/models/crise.model';
import { CriseService } from '../../crises/services/crise.service';
import { DepartamentoService } from '../../departamentos/services/departamento.service';
import { DashboardResumo } from '../models/dashboard.model';
import { DashboardService } from '../services/dashboard.service';
import { InstituicaoService } from '../../instituicoes/services/instituicao.service';
import { Relatorio } from '../../relatorios/models/relatorio.model';
import { RelatorioService } from '../../relatorios/services/relatorio.service';
import { TipoCriseService } from '../../tipos-crise/services/tipo-crise.service';
import { Usuario } from '../../usuarios/models/usuario.model';
import { UsuarioService } from '../../usuarios/services/usuario.service';

type SortOption = 'recentes' | 'antigas' | 'nivel' | 'titulo';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const PALETTE = ['#2f9e41', '#2563eb', '#ea580c', '#8b5cf6', '#0891b2', '#db2777', '#ca8a04', '#dc2626'];
const STATUS_COLOR: Record<StatusCrise, string> = {
  ABERTA: '#2563eb',
  EM_ANDAMENTO: '#ea580c',
  RESOLVIDA: '#16a34a',
  ENCERRADA: '#64748b',
};

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    DatePipe,
    LowerCasePipe,
    PieChartComponent,
    LineChartComponent,
    BarChartComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly criseService = inject(CriseService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly campusService = inject(CampusService);
  private readonly instituicaoService = inject(InstituicaoService);
  private readonly relatorioService = inject(RelatorioService);
  private readonly auditoriaService = inject(AuditoriaService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  private readonly resumo = signal<DashboardResumo | null>(null);
  readonly crises = signal<Crise[]>([]);
  private readonly usuarios = signal<Usuario[]>([]);
  private readonly tipos = signal<{ id: number; nome: string }[]>([]);
  private readonly departamentos = signal<{ id: number; nome: string }[]>([]);
  private readonly campi = signal<Campus[]>([]);
  private readonly instituicoes = signal<{ id: number; nome: string }[]>([]);
  private readonly relatorios = signal<Relatorio[]>([]);
  readonly atividades = signal<AuditoriaLog[]>([]);

  // ---------- Mapas de resolução de nomes ----------
  private readonly tiposMap = computed(() => new Map(this.tipos().map((t) => [t.id, t.nome])));
  private readonly deptosMap = computed(() => new Map(this.departamentos().map((d) => [d.id, d.nome])));
  private readonly campiMap = computed(() => new Map(this.campi().map((c) => [c.id, c])));
  private readonly instMap = computed(() => new Map(this.instituicoes().map((i) => [i.id, i.nome])));
  private readonly relatorioPorCrise = computed(
    () => new Map(this.relatorios().map((r) => [r.criseId, r])),
  );

  // ---------- KPIs ----------
  readonly total = computed(() => this.crises().length);
  readonly emAndamento = computed(() => this.crises().filter((c) => c.status === 'EM_ANDAMENTO').length);
  readonly abertas = computed(
    () => this.crises().filter((c) => c.status === 'ABERTA' || c.status === 'EM_ANDAMENTO').length,
  );
  readonly criticasAtivas = computed(
    () =>
      this.crises().filter(
        (c) => c.nivel === 'CRITICO' && c.status !== 'RESOLVIDA' && c.status !== 'ENCERRADA',
      ).length,
  );
  readonly resolvidas = computed(
    () => this.crises().filter((c) => c.status === 'RESOLVIDA' || c.status === 'ENCERRADA').length,
  );
  readonly taxaResolucao = computed(() =>
    this.total() === 0 ? 0 : Math.round((this.resolvidas() / this.total()) * 100),
  );

  /** Tempo médio (dias) da abertura da crise até a emissão do relatório final. */
  readonly tempoMedioDias = computed<number | null>(() => {
    const rel = this.relatorioPorCrise();
    const diffs: number[] = [];
    for (const c of this.crises()) {
      const r = rel.get(c.id);
      if (!r) {
        continue;
      }
      const dias = (Date.parse(r.createdAt) - Date.parse(c.createdAt)) / 86_400_000;
      if (dias >= 0) {
        diffs.push(dias);
      }
    }
    if (diffs.length === 0) {
      return null;
    }
    return diffs.reduce((a, b) => a + b, 0) / diffs.length;
  });

  readonly tempoMedioLabel = computed(() => {
    const d = this.tempoMedioDias();
    if (d === null) {
      return '—';
    }
    if (d < 1) {
      return `${Math.round(d * 24)}h`;
    }
    return `${d.toFixed(1)} d`;
  });

  /** Tendência do total: novas crises neste mês vs. mês anterior. */
  readonly trendTotal = computed(() => {
    const keys = this.ultimosMeses(2);
    const porMes = this.contarPorMes();
    const atual = porMes.get(keys[1].key) ?? 0;
    const anterior = porMes.get(keys[0].key) ?? 0;
    const delta = atual - anterior;
    return { atual, delta, dir: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat' };
  });

  // ---------- Gráficos ----------
  readonly evolucaoMensal = computed<ChartPoint[]>(() => {
    const meses = this.ultimosMeses(6);
    const porMes = this.contarPorMes();
    return meses.map((m) => ({ label: m.label, value: porMes.get(m.key) ?? 0 }));
  });

  readonly porCategoria = computed<ChartSlice[]>(() => {
    const contagem = new Map<number, number>();
    for (const c of this.crises()) {
      contagem.set(c.tipoCriseId, (contagem.get(c.tipoCriseId) ?? 0) + 1);
    }
    return [...contagem.entries()]
      .map(([id, value], i) => ({
        label: this.tiposMap().get(id) ?? `Tipo #${id}`,
        value,
        color: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value);
  });

  readonly porDepartamento = computed<ChartBar[]>(() => {
    const contagem = new Map<number, number>();
    for (const c of this.crises()) {
      contagem.set(c.departamentoId, (contagem.get(c.departamentoId) ?? 0) + 1);
    }
    return [...contagem.entries()]
      .map(([id, value], i) => ({
        label: this.deptosMap().get(id) ?? `Depto #${id}`,
        value,
        color: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value);
  });

  readonly porStatus = computed<ChartSlice[]>(() => {
    const ordem: StatusCrise[] = ['ABERTA', 'EM_ANDAMENTO', 'RESOLVIDA', 'ENCERRADA'];
    const rotulo: Record<StatusCrise, string> = {
      ABERTA: 'Aberta',
      EM_ANDAMENTO: 'Em andamento',
      RESOLVIDA: 'Resolvida',
      ENCERRADA: 'Encerrada',
    };
    return ordem
      .map((s) => ({
        label: rotulo[s],
        value: this.crises().filter((c) => c.status === s).length,
        color: STATUS_COLOR[s],
      }))
      .filter((s) => s.value > 0);
  });

  // ---------- Alertas ----------
  readonly semResponsavel = computed(() => this.crises().filter((c) => c.createdBy === null).length);
  readonly usuariosInativos = computed(() => this.usuarios().filter((u) => !u.active).length);
  readonly pendenciasAdmin = computed(() => this.crises().filter((c) => c.status === 'ABERTA').length);
  readonly relatoriosPendentes = computed(() => {
    const comRelatorio = this.relatorioPorCrise();
    return this.crises().filter(
      (c) => (c.status === 'RESOLVIDA' || c.status === 'ENCERRADA') && !comRelatorio.has(c.id),
    ).length;
  });

  // ---------- Tabela: últimas crises (busca / filtro / ordenação / paginação) ----------
  readonly search = signal('');
  readonly statusFilter = signal<StatusCrise | ''>('');
  readonly nivelFilter = signal<NivelCriticidade | ''>('');
  readonly sort = signal<SortOption>('recentes');
  readonly page = signal(0);
  readonly pageSize = 6;

  readonly statusOptions: StatusCrise[] = ['ABERTA', 'EM_ANDAMENTO', 'RESOLVIDA', 'ENCERRADA'];
  readonly nivelOptions: NivelCriticidade[] = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];
  private readonly nivelPeso: Record<NivelCriticidade, number> = { CRITICO: 4, ALTO: 3, MEDIO: 2, BAIXO: 1 };

  readonly filtered = computed<Crise[]>(() => {
    const term = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const nivel = this.nivelFilter();
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
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });
    return list;
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / this.pageSize)));
  readonly safePage = computed(() => Math.min(this.page(), this.totalPages() - 1));
  readonly paged = computed(() => {
    const start = this.safePage() * this.pageSize;
    return this.filtered().slice(start, start + this.pageSize);
  });
  readonly hasActiveFilters = computed(
    () => !!this.search() || !!this.statusFilter() || !!this.nivelFilter(),
  );

  ngOnInit(): void {
    this.loading.set(true);
    this.error.set(null);
    forkJoin({
      resumo: this.dashboardService.resumo().pipe(catchError(() => of(null))),
      crises: this.criseService.listAll().pipe(catchError(() => of([]))),
      usuarios: this.usuarioService.listAll().pipe(catchError(() => of([]))),
      tipos: this.tipoCriseService.listAll().pipe(catchError(() => of([]))),
      departamentos: this.departamentoService.listAll().pipe(catchError(() => of([]))),
      campi: this.campusService.listAll().pipe(catchError(() => of([]))),
      instituicoes: this.instituicaoService.listAll().pipe(catchError(() => of([]))),
      relatorios: this.relatorioService.listAll().pipe(catchError(() => of([]))),
      auditoria: this.auditoriaService.listAll().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (r) => {
        this.resumo.set(r.resumo);
        this.crises.set(r.crises);
        this.usuarios.set(r.usuarios);
        this.tipos.set(r.tipos);
        this.departamentos.set(r.departamentos);
        this.campi.set(r.campi);
        this.instituicoes.set(r.instituicoes);
        this.relatorios.set(r.relatorios);
        this.atividades.set(r.auditoria.slice(0, 7));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível carregar o painel administrativo.'));
        this.loading.set(false);
      },
    });
  }

  resetPage(): void {
    this.page.set(0);
  }

  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.nivelFilter.set('');
    this.resetPage();
  }

  prevPage(): void {
    this.page.set(Math.max(0, this.safePage() - 1));
  }

  nextPage(): void {
    this.page.set(Math.min(this.totalPages() - 1, this.safePage() + 1));
  }

  tipoNome(id: number): string {
    return this.tiposMap().get(id) ?? `#${id}`;
  }

  instituicaoNome(campusId: number): string {
    const campus = this.campiMap().get(campusId);
    if (!campus) {
      return '—';
    }
    return this.instMap().get(campus.instituicaoId) ?? '—';
  }

  atividadeIcone(log: AuditoriaLog): string {
    switch (log.acao) {
      case 'CRIAR':
        return 'plus';
      case 'ATUALIZAR':
        return 'edit';
      case 'EXCLUIR':
        return 'trash';
      default:
        return 'dot';
    }
  }

  // ---------- Helpers de data ----------
  private contarPorMes(): Map<string, number> {
    const mapa = new Map<string, number>();
    for (const c of this.crises()) {
      const key = c.createdAt.slice(0, 7); // yyyy-MM
      mapa.set(key, (mapa.get(key) ?? 0) + 1);
    }
    return mapa;
  }

  private ultimosMeses(qtd: number): { key: string; label: string }[] {
    const hoje = new Date();
    const out: { key: string; label: string }[] = [];
    for (let i = qtd - 1; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      out.push({ key: `${d.getFullYear()}-${mm}`, label: MESES[d.getMonth()] });
    }
    return out;
  }
}
