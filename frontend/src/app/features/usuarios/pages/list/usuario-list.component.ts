import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DepartamentoService } from '../../../departamentos/services/departamento.service';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './usuario-list.component.html',
})
export class UsuarioListComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly departamentoService = inject(DepartamentoService);

  readonly usuarios = signal<Usuario[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly notice = signal<string | null>(null);

  private readonly departamentos = signal<Map<number, string>>(new Map());

  ngOnInit(): void {
    this.departamentoService.listAll().subscribe((data) => {
      this.departamentos.set(new Map(data.map((d) => [d.id, d.nome])));
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usuarioService.listAll().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Não foi possível carregar os usuários.');
        this.loading.set(false);
      },
    });
  }

  departamentoNome(id: number | null): string {
    if (id == null) {
      return '-';
    }
    return this.departamentos().get(id) ?? `#${id}`;
  }

  remove(usuario: Usuario): void {
    if (!confirm(`Desativar o usuário "${usuario.name}"?`)) {
      return;
    }
    this.usuarioService.deactivate(usuario.id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Não foi possível desativar o usuário.'),
    });
  }

  resetSenha(usuario: Usuario): void {
    if (!confirm(`Gerar nova senha temporária e enviar por e-mail para "${usuario.email}"?`)) {
      return;
    }
    this.notice.set(null);
    this.usuarioService.resetSenha(usuario.id).subscribe({
      next: () => {
        this.notice.set(`Nova senha temporária enviada para ${usuario.email}.`);
        this.load();
      },
      error: () => this.error.set('Não foi possível resetar a senha.'),
    });
  }
}
