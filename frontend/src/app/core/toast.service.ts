import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

/**
 * Minimal in-memory toast/notification service (Section 09 production
 * polish). Consumed by <app-toast-host> in app.component.ts. Every
 * mutating action in Companion/Settings/Developer Portal reports its
 * success/failure here instead of relying on inline text alone or
 * window.alert().
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();
  private nextId = 1;

  private push(kind: ToastKind, message: string, durationMs: number) {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
    return id;
  }

  success(message: string, durationMs = 4000) {
    return this.push('success', message, durationMs);
  }

  error(message: string, durationMs = 6000) {
    return this.push('error', message, durationMs);
  }

  info(message: string, durationMs = 4000) {
    return this.push('info', message, durationMs);
  }

  dismiss(id: number) {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
