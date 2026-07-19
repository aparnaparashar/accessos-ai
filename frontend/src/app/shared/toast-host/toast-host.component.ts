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
      position: fixed; bottom: 20px; right: 20px; z-index: 200;
      display: flex; flex-direction: column; gap: 10px; max-width: 360px;
    }
    .toast {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 13px 14px; border-radius: 10px; font-size: 13.8px;
      background: var(--ink); color: #fff; box-shadow: var(--shadow-soft);
      animation: toast-in 0.18s ease;
    }
    .toast.success { background: #0F5F55; }
    .toast.error { background: #7A2A15; }
    .toast.info { background: var(--ink); }
    .toast-msg { flex: 1; }
    .toast-dismiss {
      background: transparent; border: none; color: inherit; opacity: 0.7;
      cursor: pointer; font-size: 16px; line-height: 1; padding: 0;
    }
    .toast-dismiss:hover { opacity: 1; }
    @keyframes toast-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) { .toast { animation: none; } }
    @media (max-width: 500px) { .toast-region { left: 16px; right: 16px; max-width: none; } }
  `],
})
export class ToastHostComponent {
  constructor(public toast: ToastService) {}
}
