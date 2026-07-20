import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-region" role="status" aria-live="polite" aria-atomic="false">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="t.kind">
          <span class="toast-msg">{{ t.message }}</span>
          <button type="button" class="toast-dismiss" (click)="toast.dismiss(t.id)" aria-label="Dismiss notification">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-region {
      position: fixed; bottom: 24px; right: 24px; z-index: 200;
      display: flex; flex-direction: column; gap: 12px; max-width: 380px;
    }
    .toast {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 16px; border-radius: var(--radius-md); font-size: 14px;
      background: var(--ink); color: var(--bg-base); box-shadow: var(--shadow-lg);
      animation: toast-in var(--duration) var(--ease-out);
    }
    .toast.success { background: #065f46; }
    .toast.error { background: #991b1b; }
    .toast.info { background: var(--ink); }
    .toast-msg { flex: 1; }
    .toast-dismiss {
      background: transparent; border: none; color: inherit; opacity: 0.6;
      cursor: pointer; font-size: 16px; line-height: 1; padding: 4px;
      transition: opacity var(--duration) var(--ease);
    }
    .toast-dismiss:hover { opacity: 1; }
    @media (prefers-reduced-motion: reduce) { .toast { animation: none; } }
    @media (max-width: 500px) { .toast-region { left: 16px; right: 16px; max-width: none; } }
  `],
})
export class ToastHostComponent {
  constructor(public toast: ToastService) {}
}
