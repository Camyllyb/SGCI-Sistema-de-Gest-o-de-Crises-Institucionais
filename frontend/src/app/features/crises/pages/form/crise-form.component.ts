import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Campus } from '../../../campi/models/campus.model';
import { CampusService } from '../../../campi/services/campus.service';
import { Cenario } from '../../../cenarios/models/cenario.model';
import { CenarioService } from '../../../cenarios/services/cenario.service';
import { Departamento } from '../../../departamentos/models/departamento.model';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { TipoCrise } from '../../../tipos-crise/models/tipo-crise.model';
import { TipoCriseService } from '../../../tipos-crise/services/tipo-crise.service';
import { CriseRequest, NivelCriticidade } from '../../models/crise.model';
import { CriseService } from '../../services/crise.service';

@Component({
  selector: 'app-crise-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './crise-form.component.html',
})
export class CriseFormComponent implements OnInit {
  private readonly criseService = inject(CriseService);
  private readonly tipoCriseService = inject(TipoCriseService);
  private readonly campusService = inject(CampusService);
  private readonly cenarioService = inject(CenarioService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly router = inject(Router);

  readonly tipos = signal<TipoCrise[]>([]);
  readonly campi = signal<Campus[]>([]);
  readonly cenarios = signal<Cenario[]>([]);
  readonly departamentos = signal<Departamento[]>([]);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly niveis: NivelCriticidade[] = ['BAIXO', 'MEDIO', 'ALTO', 'CRITICO'];

  model: CriseRequest = {
    titulo: '',
    descricao: '',
    nivel: 'BAIXO',
    tipoCriseId: null as unknown as number,
    campusId: null as unknown as number,
    cenarioId: null,
    departamentoId: null as unknown as number,
  };

  ngOnInit(): void {
    this.tipoCriseService.listAll().subscribe((data) => this.tipos.set(data));
    this.campusService.listAll().subscribe((data) => this.campi.set(data));
    this.cenarioService.listAll().subscribe((data) => this.cenarios.set(data));
    this.departamentoService.listAll().subscribe((data) => this.departamentos.set(data));
  }

  onSubmit(): void {
    this.saving.set(true);
    this.error.set(null);
    this.criseService.create(this.model).subscribe({
      next: () => this.router.navigate(['/crises']),
      error: () => {
        this.error.set('Não foi possível cadastrar a crise. Verifique os campos obrigatórios.');
        this.saving.set(false);
      },
    });
  }
}
