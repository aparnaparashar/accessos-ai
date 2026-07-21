import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService, ApiError } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

interface HistoryItem {
  id: string;
  endpoint: string;
  status: number;
  latency: number;
  time: string;
  ok: boolean;
}

const ENDPOINT_DEFAULTS: Record<string, string> = {
  '/v1/demo/ocr': JSON.stringify({ image_url: 'https://c8.alamy.com/comp/B4XN1G/street-scenery-new-delhi-india-B4XN1G.jpg' }, null, 2),
  '/v1/demo/vision': JSON.stringify({ image_url: 'https://c8.alamy.com/comp/B4XN1G/street-scenery-new-delhi-india-B4XN1G.jpg', simplified: false }, null, 2),
  '/v1/demo/simplify': JSON.stringify({ text: 'The implementation of the high-throughput asynchronous pipeline utilizes reactive streams for real-time data processing.' }, null, 2),
  '/v1/demo/sign-language': JSON.stringify({ text: 'Where is the nearest train station?' }, null, 2),
  '/v1/demo/accessibility': JSON.stringify({ text: 'Take one tablet by mouth twice daily with food.', reading_level: 'simplified' }, null, 2),
};

const ENDPOINT_LABELS: Record<string, string> = {
  '/v1/demo/ocr': 'POST /v1/demo/ocr  (OCR)',
  '/v1/demo/vision': 'POST /v1/demo/vision  (Scene Description)',
  '/v1/demo/simplify': 'POST /v1/demo/simplify  (Text Simplification)',
  '/v1/demo/sign-language': 'POST /v1/demo/sign-language  (Sign Gloss)',
  '/v1/demo/accessibility': 'POST /v1/demo/accessibility  (Accessibility Orchestrator)',
};

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="playground-layout">
      <div class="container py-8">
        <div class="page-head">
          <div class="eyebrow">INTERACTIVE EXPLORER</div>
          <h1>API Playground</h1>
          <p class="lede">Test AccessOS AI endpoints against the live backend. Every request hits the real AI provider — results change with your input.</p>
        </div>

        <!-- Auth Banner -->
        <div class="auth-banner mb-6" *ngIf="!isLoggedIn()">
          <span>⚡</span>
          <span>You need to be signed in to run live API calls.</span>
          <a routerLink="/login" class="btn btn-primary btn-sm">Sign In</a>
          <a routerLink="/signup" class="btn btn-ghost btn-sm">Create Account</a>
        </div>

        <div class="grid-2 mt-6 align-start">
          <!-- Request Panel -->
          <div class="card req-card">
            <div class="field mb-4">
              <label>Endpoint</label>
              <select [(ngModel)]="selectedEndpoint" (change)="onEndpointChange()">
                <option *ngFor="let e of endpointKeys" [value]="e">{{ endpointLabels[e] }}</option>
              </select>
            </div>

            <div class="field mb-4">
              <div class="flex-between mb-2">
                <label>Request Payload (JSON)</label>
                <span class="json-ok" *ngIf="!jsonError()">✓ Valid JSON</span>
                <span class="json-err" *ngIf="jsonError()">⚠ Invalid JSON</span>
              </div>
              <textarea
                rows="12"
                [(ngModel)]="requestJson"
                class="font-mono text-xs"
                [class.invalid]="jsonError()"
                (input)="onJsonInput()"
              ></textarea>
            </div>

            <button
              class="btn btn-primary w-full"
              (click)="executeRequest()"
              [disabled]="executing() || !isLoggedIn() || !!jsonError()"
            >
              <span *ngIf="!executing()">{{ isLoggedIn() ? 'Execute Request' : 'Sign In to Execute' }}</span>
              <span *ngIf="executing()" class="flex-center gap-2">
                <span class="spinner"></span> Executing…
              </span>
            </button>
          </div>

          <!-- Response Panel -->
          <div class="card res-card">
            <div class="res-header">
              <div class="res-meta">
                <span class="status-chip live" *ngIf="responseStatus() === 200">HTTP 200 OK</span>
                <span class="status-chip planned" *ngIf="responseStatus() && responseStatus() !== 200">HTTP {{ responseStatus() }}</span>
                <span class="latency mono" *ngIf="latencyMs() !== null">{{ latencyMs() }} ms</span>
                <span class="provider-badge" *ngIf="provider()">via {{ provider() }}</span>
              </div>
              <button class="btn btn-ghost copy-btn" (click)="copyResponse()" *ngIf="responseJson()">
                {{ copied() ? '✓ Copied!' : 'Copy Response' }}
              </button>
            </div>

            <div class="response-body font-mono text-xs" *ngIf="responseJson()">
              <pre><code [innerHTML]="highlightJson(responseJson())"></code></pre>
            </div>

            <div class="empty-res" *ngIf="!responseJson() && !executing()">
              <div class="empty-icon">◎</div>
              <p class="muted">Click <strong>Execute Request</strong> to dispatch the API call and view the real AI output here.</p>
            </div>

            <div class="empty-res" *ngIf="executing()">
              <span class="spinner lg"></span>
              <p class="muted mt-2">Calling real AI backend…</p>
            </div>
          </div>
        </div>

        <!-- Execution History -->
        <div class="history-section mt-12 card" *ngIf="history().length > 0">
          <div class="flex-between mb-4">
            <h3>Execution History</h3>
            <button class="btn btn-ghost btn-sm" (click)="clearHistory()">Clear</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of history()">
                <td class="mono muted">{{ item.time }}</td>
                <td class="mono"><code>{{ item.endpoint }}</code></td>
                <td>
                  <span class="status-chip live" *ngIf="item.ok">HTTP {{ item.status }}</span>
                  <span class="status-chip planned" *ngIf="!item.ok">HTTP {{ item.status }}</span>
                </td>
                <td class="mono">{{ item.latency }} ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-banner {
      display: flex; align-items: center; gap: 12px; background: rgba(245,158,11,0.08);
      border: 1px solid rgba(245,158,11,0.3); border-radius: var(--radius-md);
      padding: 12px 18px; font-size: 14px; color: #fbbf24;
    }
    .auth-banner .btn { flex-shrink: 0; }
    .btn-sm { padding: 6px 14px; font-size: 12px; }

    .req-card, .res-card { min-height: 520px; }

    .res-header {
      display: flex; justify-content: space-between; align-items: center;
      padding-bottom: 16px; border-bottom: 1px solid var(--line); margin-bottom: 16px;
    }
    .res-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .latency { color: var(--accent); font-weight: 600; font-size: 13px; }
    .provider-badge { font-size: 11px; background: rgba(255,255,255,0.06); border: 1px solid var(--line); border-radius: 4px; padding: 2px 6px; color: var(--ink-muted); }

    .response-body {
      background: var(--bg-deep); padding: 16px; border-radius: var(--radius-md);
      border: 1px solid var(--line); max-height: 400px; overflow-y: auto;
    }
    .empty-res { height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 8px; }
    .empty-icon { font-size: 32px; opacity: 0.2; }
    .copy-btn { padding: 4px 12px; font-size: 12px; }

    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .flex-center { display: flex; align-items: center; }
    .gap-2 { gap: 8px; }
    .mb-2 { margin-bottom: 8px; }
    .mt-2 { margin-top: 8px; }

    .json-ok { font-size: 11px; color: #4ade80; }
    .json-err { font-size: 11px; color: #ef4444; }
    textarea.invalid { border-color: #ef4444 !important; }

    .spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
    .spinner.lg { width: 28px; height: 28px; border-width: 3px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class PlaygroundComponent {
  private api = inject(ApiService);
  private authService = inject(AuthService);
  private sanitizer = inject(DomSanitizer);

  isLoggedIn = computed(() => this.authService.isLoggedIn());

  endpointKeys = Object.keys(ENDPOINT_DEFAULTS);
  endpointLabels = ENDPOINT_LABELS;

  selectedEndpoint = '/v1/demo/ocr';
  requestJson = ENDPOINT_DEFAULTS['/v1/demo/ocr'];

  responseJson = signal<string | null>(null);
  responseStatus = signal<number | null>(null);
  latencyMs = signal<number | null>(null);
  provider = signal<string | null>(null);
  executing = signal(false);
  copied = signal(false);
  jsonError = signal<string | null>(null);
  history = signal<HistoryItem[]>([]);

  onEndpointChange() {
    this.requestJson = ENDPOINT_DEFAULTS[this.selectedEndpoint] ?? '{}';
    this.responseJson.set(null);
    this.responseStatus.set(null);
    this.latencyMs.set(null);
    this.provider.set(null);
    this.jsonError.set(null);
  }

  onJsonInput() {
    try {
      JSON.parse(this.requestJson);
      this.jsonError.set(null);
    } catch {
      this.jsonError.set('Invalid JSON');
    }
  }

  executeRequest() {
    let payload: unknown;
    try {
      payload = JSON.parse(this.requestJson);
    } catch {
      this.jsonError.set('Fix JSON before executing');
      return;
    }

    this.executing.set(true);
    this.responseJson.set(null);
    const start = performance.now();

    this.api.post<Record<string, unknown>>(this.selectedEndpoint, payload).subscribe({
      next: (res) => {
        const latency = Math.round(performance.now() - start);
        this.latencyMs.set(latency);
        this.responseStatus.set(200);
        this.provider.set(typeof res?.['provider'] === 'string' ? res['provider'] as string : null);
        this.responseJson.set(JSON.stringify(res, null, 2));
        this.executing.set(false);
        this.addHistory(this.selectedEndpoint, 200, latency, true);
      },
      error: (err: ApiError) => {
        const latency = Math.round(performance.now() - start);
        this.latencyMs.set(latency);
        this.responseStatus.set(err.status || 500);
        this.provider.set(null);
        this.responseJson.set(JSON.stringify({ error: err.code, detail: err.detail }, null, 2));
        this.executing.set(false);
        this.addHistory(this.selectedEndpoint, err.status || 500, latency, false);
      },
    });
  }

  private addHistory(endpoint: string, status: number, latency: number, ok: boolean) {
    this.history.update((h) => [
      {
        id: Math.random().toString(36).substring(2, 8),
        endpoint,
        status,
        latency,
        time: new Date().toLocaleTimeString(),
        ok,
      },
      ...h,
    ].slice(0, 20));
  }

  clearHistory() {
    this.history.set([]);
  }

  copyResponse() {
    const text = this.responseJson();
    if (text) {
      navigator.clipboard.writeText(text);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }

  highlightJson(code: string | null): SafeHtml {
    if (!code) return '';
    let html = code
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/("[^"]*")(\s*:)/g, '<span class="token-keyword">$1</span>$2')
      .replace(/:\s*("[^"]*")/g, ': <span class="token-string">$1</span>')
      .replace(/\b(true|false|null|[0-9]+(?:\.[0-9]+)?)\b/g, '<span class="token-property">$1</span>')
      .replace(/([{}[\],])/g, '<span class="token-punctuation">$1</span>');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
