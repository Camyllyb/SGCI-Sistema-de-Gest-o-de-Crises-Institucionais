import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

/**
 * Notificações efêmeras (toasts) exibidas globalmente pelo {@link ToastContainerComponent}.
 * Baseado em signals para integração natural com a detecção de mudanças do Angular.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private sequence = 0;
  readonly toasts = signal<Toast[]>([]);

  success(message: string, timeoutMs = 4000): void {
    this.push('success', message, timeoutMs);
  }

  error(message: string, timeoutMs = 6000): void {
    this.push('error', message, timeoutMs);
  }

  info(message: string, timeoutMs = 4000): void {
    this.push('info', message, timeoutMs);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((toast) => toast.id !== id));
  }

  private push(type: ToastType, message: string, timeoutMs: number): void {
    const id = ++this.sequence;
    this.toasts.update((list) => [...list, { id, type, message }]);
    if (timeoutMs > 0) {
      setTimeout(() => this.dismiss(id), timeoutMs);
    }
  }
}
