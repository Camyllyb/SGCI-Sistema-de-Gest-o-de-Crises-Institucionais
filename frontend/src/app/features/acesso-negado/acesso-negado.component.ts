import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acesso-negado',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page">
      <div class="card-panel card--pad denied">
        <span class="denied__icon" aria-hidden="true">
          <svg class="icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="m4.9 4.9 14.2 14.2" />
          </svg>
        </span>
        <h1>Acesso negado</h1>
        <p class="muted">
          Você não tem permissão para acessar esta área. Esta seção é restrita a administradores.
        </p>
        <a class="btn-primary" routerLink="/dashboard">Voltar ao início</a>
      </div>
    </section>
  `,
  styles: [
    `
      .denied {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--space-3);
        padding: var(--space-8) var(--space-5);
      }
      .denied__icon {
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        border-radius: var(--radius-full);
        background: var(--danger-soft);
        color: var(--danger);
      }
      .denied__icon .icon {
        width: 2rem;
        height: 2rem;
      }
      .denied p {
        max-width: 420px;
        margin-bottom: var(--space-3);
      }
    `,
  ],
})
export class AcessoNegadoComponent {}
