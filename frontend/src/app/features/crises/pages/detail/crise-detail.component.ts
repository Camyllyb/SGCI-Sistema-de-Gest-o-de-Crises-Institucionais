import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RoleDirective } from '../../../../core/directives/role.directive';
import { ToastService } from '../../../../core/services/toast.service';
import { extractApiError } from '../../../../core/utils/http-error';
import { CampusService } from '../../../campi/services/campus.service';
import { CenarioService } from '../../../cenarios/services/cenario.service';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { TipoCriseService } from '../../../tipos-crise/services/tipo-crise.service';
import { Acao, AcaoRequest, TipoAcao } from '../../models/acao.model';
import { Crise, StatusCrise } from '../../models/crise.model';
import { CriseService } from '../../services/crise.service';

@Component({
  selector: 'app-crise-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, RoleDirective, DatePipe],
  templateUrl: './crise-detail.component.html',
})
export class CriseDetailComponent implements OnInit {
  private readonly criseService = inject(CriseService);
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly campusService = inject(CampusService);
  private readonly cenarioService = inject(CenarioService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  private criseId!: number;

  readonly crise = signal<Crise | null>(null);
  readonly acoes = signal<Acao[]>([]);
  readonly error = signal<string | null>(null);
  readonly loading = signal(true);
  readonly savingAcao = signal(false);

  private readonly tipos = signal<Map<number, string>>(new Map());
  private readonly campi = signal<Map<number, string>>(new Map());
  private readonly cenarios = signal<Map<number, string>>(new Map());
  private readonly departamentos = signal<Map<number, string>>(new Map());

  readonly tiposAcao: TipoAcao[] = ['CONTENCAO', 'COMUNICACAO', 'MONITORAMENTO', 'RESOLUCAO'];

  private readonly fluxo: Record<StatusCrise, StatusCrise | null> = {
    ABERTA: 'EM_ANDAMENTO',
    EM_ANDAMENTO: 'RESOLVIDA',
    RESOLVIDA: 'ENCERRADA',
    ENCERRADA: null,
  };

  readonly proximoStatus = computed<StatusCrise | null>(() => {
    const atual = this.crise();
    return atual ? this.fluxo[atual.status] : null;
  });

  /** A crise só aceita novas ações enquanto não estiver resolvida/encerrada. */
  readonly formVisivel = computed<boolean>(() => {
    const status = this.crise()?.status;
    return status === 'ABERTA' || status === 'EM_ANDAMENTO';
  });

  readonly encerrada = computed<boolean>(() => this.crise()?.status === 'ENCERRADA');

  /** Última atualização = ação mais recente ou, na ausência de ações, a criação. */
  readonly ultimaAtualizacao = computed<string | null>(() => {
    const acoes = this.acoes();
    if (acoes.length > 0) {
      return acoes.reduce((max, a) => (a.createdAt > max ? a.createdAt : max), acoes[0].createdAt);
    }
    return this.crise()?.createdAt ?? null;
  });

  novaAcao: AcaoRequest = { descricao: '', tipo: 'CONTENCAO' };

  ngOnInit(): void {
    this.criseId = Number(this.route.snapshot.paramMap.get('id'));

    this.tipoCriseService.listAll().subscribe((d) => this.tipos.set(new Map(d.map((t) => [t.id, t.nome]))));
    this.campusService.listAll().subscribe((d) => this.campi.set(new Map(d.map((c) => [c.id, c.nome]))));
    this.cenarioService
      .listAll()
      .subscribe((d) => this.cenarios.set(new Map(d.map((c) => [c.id, c.descricao]))));
    this.departamentoService
      .listAll()
      .subscribe((d) => this.departamentos.set(new Map(d.map((x) => [x.id, x.nome]))));

    this.carregarCrise();
    this.carregarAcoes();
  }

  carregarCrise(): void {
    this.loading.set(true);
    this.criseService.findById(this.criseId).subscribe({
      next: (data) => {
        this.crise.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractApiError(err, 'Não foi possível carregar a crise.'));
        this.loading.set(false);
      },
    });
  }

  carregarAcoes(): void {
    this.criseService.listAcoes(this.criseId).subscribe({
      next: (data) => this.acoes.set(data),
      error: () => this.acoes.set([]),
    });
  }

  avancarStatus(): void {
    const proximo = this.proximoStatus();
    if (!proximo) {
      return;
    }
    this.criseService.changeStatus(this.criseId, proximo).subscribe({
      next: (data) => {
        this.crise.set(data);
        this.toast.success('Status atualizado com sucesso.');
      },
      error: (err) => {
        const msg = extractApiError(err, 'Não foi possível alterar o status.');
        this.error.set(msg);
        this.toast.error(msg);
      },
    });
  }

  registrarAcao(): void {
    if (this.savingAcao()) {
      return;
    }
    this.savingAcao.set(true);
    this.criseService.createAcao(this.criseId, this.novaAcao).subscribe({
      next: () => {
        this.novaAcao = { descricao: '', tipo: 'CONTENCAO' };
        this.savingAcao.set(false);
        this.toast.success('Ação registrada na linha do tempo.');
        this.carregarAcoes();
      },
      error: (err) => {
        this.savingAcao.set(false);
        const msg = extractApiError(err, 'Não foi possível registrar a ação.');
        this.error.set(msg);
        this.toast.error(msg);
      },
    });
  }

  tipoNome(id: number): string {
    return this.tipos().get(id) ?? `#${id}`;
  }

  campusNome(id: number): string {
    return this.campi().get(id) ?? `#${id}`;
  }

  cenarioNome(id: number | null): string {
    return id == null ? '—' : (this.cenarios().get(id) ?? `#${id}`);
  }

  departamentoNome(id: number): string {
    return this.departamentos().get(id) ?? `#${id}`;
  }
}
