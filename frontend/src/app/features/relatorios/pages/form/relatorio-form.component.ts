import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Crise } from '../../../crises/models/crise.model';
import { CriseService } from '../../../crises/services/crise.service';
import { RelatorioRequest } from '../../models/relatorio.model';
import { RelatorioService } from '../../services/relatorio.service';

@Component({
  selector: 'app-relatorio-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './relatorio-form.component.html',
})
export class RelatorioFormComponent implements OnInit {
  private readonly relatorioService = inject(RelatorioService);
  private readonly criseService = inject(CriseService);
  private readonly router = inject(Router);

  readonly crisesElegiveis = signal<Crise[]>([]);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  model: RelatorioRequest = {
    titulo: '',
    resumoOcorrido: '',
    impactosIdentificados: '',
    acoesRealizadas: '',
    resultadoFinal: '',
    recomendacoes: '',
    criseId: null as unknown as number,
  };

  ngOnInit(): void {
    this.criseService.listAll().subscribe((data) => {
      this.crisesElegiveis.set(data.filter((c) => c.status === 'RESOLVIDA' || c.status === 'ENCERRADA'));
    });
  }

  onSubmit(): void {
    this.saving.set(true);
    this.error.set(null);
    this.relatorioService.create(this.model).subscribe({
      next: () => this.router.navigate(['/relatorios']),
      error: () => {
        this.error.set('Não foi possível cadastrar o relatório. Verifique os campos e a crise selecionada.');
        this.saving.set(false);
      },
    });
  }
}
