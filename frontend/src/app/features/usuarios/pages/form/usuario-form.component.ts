import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Departamento } from '../../../departamentos/models/departamento.model';
import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { Perfil, UsuarioRequest } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './usuario-form.component.html',
})
export class UsuarioFormComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly id = signal<number | null>(null);
  readonly departamentos = signal<Departamento[]>([]);

  readonly perfis: Perfil[] = ['ADMIN', 'COMUM'];

  model: UsuarioRequest = {
    name: '',
    email: '',
    perfil: 'COMUM',
    departamentoId: null,
    active: true,
  };

  ngOnInit(): void {
    this.departamentoService.listAll().subscribe((data) => this.departamentos.set(data));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.loading.set(true);
      this.usuarioService.findById(id).subscribe({
        next: (data) => {
          this.model = {
            name: data.name,
            email: data.email,
            perfil: data.perfil,
            departamentoId: data.departamentoId,
            active: data.active,
          };
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Não foi possível carregar o usuário.');
          this.loading.set(false);
        },
      });
    }
  }

  onSubmit(): void {
    this.saving.set(true);
    this.error.set(null);
    const id = this.id();
    const request$ = id
      ? this.usuarioService.update(id, this.model)
      : this.usuarioService.create(this.model);
    request$.subscribe({
      next: () => this.router.navigate(['/usuarios']),
      error: (err) => {
        this.error.set(
          err?.error?.message ?? 'Não foi possível salvar o usuário. Verifique os campos.',
        );
        this.saving.set(false);
      },
    });
  }
}
