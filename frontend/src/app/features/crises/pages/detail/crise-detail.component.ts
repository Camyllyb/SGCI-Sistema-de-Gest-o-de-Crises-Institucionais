import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { RoleDirective } from '../../../../core/directives/role.directive';
import { extractApiError } from '../../../../core/utils/http-error';
import { Acao, AcaoRequest, TipoAcao } from '../../models/acao.model';
import { Crise, StatusCrise } from '../../models/crise.model';
import { CriseService } from '../../services/crise.service';

@Component({
  selector: 'app-crise-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, RoleDirective],
  templateUrl: './crise-detail.component.html',
})
export class CriseDetailComponent implements OnInit {
  private readonly criseService = inject(CriseService);
  private readonly route = inject(ActivatedRoute);

  private criseId!: number;

  readonly crise = signal<Crise | null>(null);
  readonly acoes = signal<Acao[]>([]);
  readonly error = signal<string | null>(null);

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

  readonly formVisivel = computed<boolean>(() => {
    const status = this.crise()?.status;
    return status === 'ABERTA' || status === 'EM_ANDAMENTO';
  });

  novaAcao: AcaoRequest = { descricao: '', tipo: 'CONTENCAO' };

  ngOnInit(): void {
    this.criseId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarCrise();
    this.carregarAcoes();
  }

  carregarCrise(): void {
    this.criseService.findById(this.criseId).subscribe({
      next: (data) => this.crise.set(data),
      error: () => this.error.set('Não foi possível carregar a crise.'),
    });
  }

  carregarAcoes(): void {
    this.criseService.listAcoes(this.criseId).subscribe({
      next: (data) => this.acoes.set(data),
      error: () => this.error.set('Não foi possível carregar as ações.'),
    });
  }

  avancarStatus(): void {
    const proximo = this.proximoStatus();
    if (!proximo) {
      return;
    }
    this.criseService.changeStatus(this.criseId, proximo).subscribe({
      next: (data) => this.crise.set(data),
      error: (err) => this.error.set(extractApiError(err, 'Não foi possível alterar o status.')),
    });
  }

  registrarAcao(): void {
    this.criseService.createAcao(this.criseId, this.novaAcao).subscribe({
      next: () => {
        this.novaAcao = { descricao: '', tipo: 'CONTENCAO' };
        this.carregarAcoes();
      },
      error: (err) => this.error.set(extractApiError(err, 'Não foi possível registrar a ação.')),
    });
  }
}
