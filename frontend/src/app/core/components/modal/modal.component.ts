import { Component, input, output } from '@angular/core';

/**
 * Modal reutilizável: overlay + cartão centralizado com projeção de conteúdo.
 *
 * - `title`: título exibido no cabeçalho.
 * - `closable` (padrão true): quando false, oculta o botão de fechar e ignora
 *   o clique no backdrop — usado no fluxo obrigatório de primeiro acesso.
 * - `(close)`: emitido ao fechar (botão ou backdrop, quando permitido).
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal-overlay" (click)="onBackdrop()">
      <div
        class="modal-card"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title()"
        (click)="$event.stopPropagation()"
      >
        <header class="modal-card__head">
          <h2 class="modal-card__title">{{ title() }}</h2>
          @if (closable()) {
            <button class="modal-card__close" type="button" aria-label="Fechar" (click)="close.emit()">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          }
        </header>
        <div class="modal-card__body">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class ModalComponent {
  readonly title = input('');
  readonly closable = input(true);
  readonly close = output<void>();

  onBackdrop(): void {
    if (this.closable()) {
      this.close.emit();
    }
  }
}
