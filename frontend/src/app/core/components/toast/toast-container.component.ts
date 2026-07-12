import { Component, inject } from '@angular/core';

import { ToastService } from '../../services/toast.service';

/** Pilha de toasts fixada no canto superior direito. Montada uma única vez no app root. */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  template: `
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" role="status">
          <span class="toast__icon" aria-hidden="true">
            @switch (toast.type) {
              @case ('success') {
                <svg class="icon icon--sm" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
              }
              @case ('error') {
                <svg class="icon icon--sm" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
              }
              @default {
                <svg class="icon icon--sm" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
              }
            }
          </span>
          <span class="toast__message">{{ toast.message }}</span>
          <button
            class="toast__close"
            type="button"
            aria-label="Fechar notificação"
            (click)="toastService.dismiss(toast.id)"
          >
            <svg class="icon icon--sm" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
}
