import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AnalyticsResponse,
  ApiKeyMeta,
  Application,
  AuditEntry,
  BillingUsageResponse,
  DevService,
  GeneratedKey,
  PlanName,
} from '../../core/dev.service';
import { ToastService } from '../../core/toast.service';

interface ApiRow {
  name: string;
  desc: string;
}

const ALL_ALLOWED_APIS = ['ocr', 'accessibility.assist'] as const;

@Component({
  selector: 'app-developer-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">04–05 · Developer Portal &amp; API Catalogue</span>
        <h1>Accessibility-as-a-service, one API</h1>
        <p class="lede">
          Manage applications, generate keys, monitor usage, and see estimated billing — every panel
          below is wired to a real backend endpoint, not sample data.
        </p>
      </div>
    </section>

    <section class="section portal-status">
      <div class="container">
        <div class="feature-row">
          <div class="feature-row-head"><h3>Authentication</h3><span class="status-chip live">LIVE</span></div>
          <p>Same JWT login flow as the End-User App, scoped to the developer role.</p>
        </div>
        <div class="feature-row">
          <div class="feature-row-head"><h3>Applications &amp; API Keys</h3><span class="status-chip live">LIVE</span></div>
          <p>Real create/list/rotate/revoke against MongoDB — the plaintext secret is shown exactly once, at generation or rotation.</p>
        </div>
        <div class="feature-row">
          <div class="feature-row-head"><h3>Analytics &amp; Billing</h3><span class="status-chip live">LIVE</span></div>
          <p>Aggregated from real UsageLog rows written by every /v1/accessibility/assist and /v1/ocr call. Billing figures are labeled as estimates, matching the backend's own disclaimer.</p>
        </div>
        <div class="feature-row">
          <div class="feature-row-head"><h3>Audit Log</h3><span class="status-chip live">LIVE</span></div>
          <p>Paginated history of every application/key mutation you've performed.</p>
        </div>
      </div>
    </section>

    <!-- Applications -->
    <section class="section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Applications</span><h2>Your applications</h2></div>

        @if (loadingApps()) {
          <p class="muted">Loading applications…</p>
        } @else if (!applications().length) {
          <p class="muted">You haven't created an application yet — create one below to get an API key.</p>
        } @else {
          <div class="app-list">
            @for (app of applications(); track app._id) {
              <button
                type="button"
                class="app-row"
                [class.selected]="selectedApp()?._id === app._id"
                (click)="selectApp(app)"
              >
                <div class="app-row-main">
                  <strong>{{ app.name }}</strong>
                  <span class="status-chip built">{{ app.plan.toUpperCase() }}</span>
                </div>
                <span class="app-row-apis">{{ app.allowed_apis.join(', ') }}</span>
              </button>
            }
          </div>
        }

        <form class="card create-app-form" (ngSubmit)="createApplication()">
          <h3>Create application</h3>
          <div class="field">
            <label for="app-name">Name</label>
            <input id="app-name" name="appName" type="text" [(ngModel)]="newAppName" placeholder="e.g. Hospital ERP" required />
          </div>
          <div class="field">
            <label for="app-plan">Plan</label>
            <select id="app-plan" name="appPlan" [(ngModel)]="newAppPlan">
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <fieldset class="field">
            <legend>Allowed APIs</legend>
            @for (api of allowedApiChoices; track api) {
              <label class="checkbox-row">
                <input type="checkbox" [checked]="newAppApis.includes(api)" (change)="toggleNewAppApi(api)" />
                {{ api }}
              </label>
            }
          </fieldset>
          <button type="submit" class="btn btn-primary" [disabled]="creatingApp()">
            {{ creatingApp() ? 'Creating…' : 'Create application' }}
          </button>
        </form>
      </div>
    </section>

    <!-- Keys -->
    @if (selectedApp()) {
      <section class="section keys-section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">API Keys</span>
            <h2>Keys for {{ selectedApp()!.name }}</h2>
          </div>

          @if (generatedKey()) {
            <div class="card generated-key-panel" role="alert">
              <h4>Copy this secret now — it will not be shown again</h4>
              <div class="key-row mono"><span>Client ID</span><code>{{ generatedKey()!.client_id }}</code></div>
              <div class="key-row mono"><span>Secret key</span><code>{{ generatedKey()!.secret_key }}</code></div>
              <button type="button" class="btn btn-ghost" (click)="dismissGeneratedKey()">I've copied it, dismiss</button>
            </div>
          }

          @if (loadingKeys()) {
            <p class="muted">Loading keys…</p>
          } @else if (!keys().length) {
            <p class="muted">No keys yet for this application.</p>
          } @else {
            <table>
              <thead><tr><th>Client ID</th><th>Status</th><th>Last used</th><th>Actions</th></tr></thead>
              <tbody>
                @for (k of keys(); track k._id) {
                  <tr>
                    <td class="mono">{{ k.client_id }}</td>
                    <td><span class="status-chip" [class]="k.revoked ? 'planned' : 'live'">{{ k.revoked ? 'REVOKED' : 'ACTIVE' }}</span></td>
                    <td>{{ k.last_used_at ? (k.last_used_at | date:'short') : 'Never' }}</td>
                    <td class="key-actions">
                      @if (!k.revoked) {
                        <button type="button" class="btn btn-ghost small" (click)="rotateKey(k)">Rotate</button>
                        @if (confirmingRevoke() === k._id) {
                          <button type="button" class="btn btn-primary small danger" (click)="revokeKey(k)">Confirm revoke</button>
                          <button type="button" class="btn btn-ghost small" (click)="confirmingRevoke.set(null)">Cancel</button>
                        } @else {
                          <button type="button" class="btn btn-ghost small" (click)="confirmingRevoke.set(k._id)">Revoke</button>
                        }
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }

          <button type="button" class="btn btn-primary" (click)="generateKey()" [disabled]="generatingKey()">
            {{ generatingKey() ? 'Generating…' : 'Generate new key' }}
          </button>
        </div>
      </section>
    }

    <!-- Analytics -->
    <section class="section analytics-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Analytics</span><h2>Usage across all applications</h2></div>

        @if (loadingAnalytics()) {
          <p class="muted">Loading analytics…</p>
        } @else if (analytics()) {
          <div class="analytics-cards">
            <div class="card metric-card"><span class="metric-label">Total calls</span><span class="metric-value">{{ analytics()!.total_calls }}</span></div>
            <div class="card metric-card"><span class="metric-label">Avg latency</span><span class="metric-value">{{ analytics()!.average_latency_ms }}ms</span></div>
            <div class="card metric-card">
              <span class="metric-label">Success rate</span>
              <span class="metric-value">{{ analytics()!.success_rate !== null ? (analytics()!.success_rate! * 100).toFixed(1) + '%' : '—' }}</span>
            </div>
          </div>

          @if (analytics()!.calls_by_api.length) {
            <div class="card svg-bars-card">
              <h4>Calls by API</h4>
              <svg [attr.viewBox]="'0 0 400 ' + (analytics()!.calls_by_api.length * 40 + 10)" class="bars-svg" role="img" aria-label="Bar chart of calls by API">
                @for (row of analytics()!.calls_by_api; track row.api; let i = $index) {
                  <text [attr.x]="0" [attr.y]="i * 40 + 14" class="bar-label">{{ row.api }}</text>
                  <rect [attr.x]="0" [attr.y]="i * 40 + 20" [attr.width]="barWidth(row.calls)" height="14" rx="4" class="bar-rect"></rect>
                  <text [attr.x]="barWidth(row.calls) + 6" [attr.y]="i * 40 + 31" class="bar-value">{{ row.calls }}</text>
                }
              </svg>
            </div>
          }

          @if (!analytics()!.total_calls) {
            <p class="muted">No usage yet — calls to /v1/accessibility/assist or /v1/ocr will show up here.</p>
          }
        }
      </div>
    </section>

    <!-- Billing -->
    <section class="section billing-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Billing</span><h2>Usage-based estimate</h2></div>

        @if (loadingBilling()) {
          <p class="muted">Loading billing…</p>
        } @else if (billing()) {
          <div class="card billing-card">
            <p class="billing-total">Estimated total this period: <strong>\${{ billing()!.estimated_total_usd }}</strong></p>
            @if (billing()!.line_items.length) {
              <table>
                <thead><tr><th>API</th><th>Calls</th><th>Est. charge</th><th>Note</th></tr></thead>
                <tbody>
                  @for (item of billing()!.line_items; track item.api) {
                    <tr>
                      <td>{{ item.api }}</td>
                      <td>{{ item.calls }}</td>
                      <td>\${{ item.estimated_charge_usd }}</td>
                      <td class="note-cell">{{ item.note }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            } @else {
              <p class="muted">No billable usage this period yet.</p>
            }
            <p class="disclaimer">{{ billing()!.disclaimer }}</p>
          </div>

          @if (checkoutError()) {
            <div class="response-error" role="alert">
              <strong>Billing not configured</strong>
              <p>{{ checkoutError() }}</p>
            </div>
          }

          <button type="button" class="btn btn-primary" (click)="setUpBilling()" [disabled]="checkingOut()">
            {{ checkingOut() ? 'Contacting Stripe…' : 'Set up billing' }}
          </button>
        }
      </div>
    </section>

    <!-- Audit log -->
    <section class="section audit-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Audit Log</span><h2>Recent activity</h2></div>

        @if (loadingAudit()) {
          <p class="muted">Loading audit log…</p>
        } @else if (audit() && audit()!.entries.length) {
          <table>
            <thead><tr><th>When</th><th>Action</th><th>Detail</th></tr></thead>
            <tbody>
              @for (e of audit()!.entries; track e._id) {
                <tr>
                  <td>{{ e.createdAt | date:'short' }}</td>
                  <td>{{ e.action }}</td>
                  <td><pre class="audit-detail">{{ e.detail | json }}</pre></td>
                </tr>
              }
            </tbody>
          </table>
          <div class="pagination">
            <button type="button" class="btn btn-ghost small" [disabled]="auditPage() <= 1" (click)="changeAuditPage(auditPage() - 1)">Previous</button>
            <span>Page {{ auditPage() }} of {{ audit()!.total_pages }}</span>
            <button type="button" class="btn btn-ghost small" [disabled]="auditPage() >= audit()!.total_pages" (click)="changeAuditPage(auditPage() + 1)">Next</button>
          </div>
        } @else {
          <p class="muted">No audit entries yet.</p>
        }
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">05 · Developer APIs Catalogue</span>
          <h2>Shipped in the catalogue</h2>
          <p>Companies subscribe to these capabilities directly — the commercial layer of the platform.</p>
        </div>
        <table>
          <thead><tr><th>API</th><th>What it does</th></tr></thead>
          <tbody>
            <tr *ngFor="let a of shippedApis"><td><strong>{{ a.name }}</strong></td><td>{{ a.desc }}</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section future-apis">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Future APIs</span>
          <h2>Planned catalogue additions</h2>
        </div>
        <div class="chip-cloud">
          <span class="status-chip planned" *ngFor="let f of futureApis">{{ f }}</span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .chip-cloud { display: flex; flex-wrap: wrap; gap: 8px; }

    .app-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
    .app-row {
      text-align: left; padding: 16px 20px; border-radius: var(--radius-md); border: 1px solid var(--line);
      background: var(--bg-panel); cursor: pointer; display: flex; flex-direction: column; gap: 4px;
      transition: all var(--duration) var(--ease);
    }
    .app-row:hover { border-color: var(--accent-soft); background: var(--accent-soft); }
    .app-row.selected { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft); background: var(--accent-soft); }
    .app-row-main { display: flex; align-items: center; gap: 12px; }
    .app-row-apis { font-size: 12px; color: var(--ink-soft); }

    .create-app-form { max-width: 500px; display: flex; flex-direction: column; gap: 20px; }
    .create-app-form h3 { font-size: 18px; margin-bottom: 4px; margin-top: 0; }

    .keys-section { background: var(--bg-panel); box-shadow: var(--shadow-xs); padding: 32px 0; margin: 32px 0; }
    .generated-key-panel { border: 1px solid var(--accent); background: var(--accent-soft); box-shadow: var(--shadow-md); margin-bottom: 24px; }
    .generated-key-panel h4 { margin-top: 0; margin-bottom: 16px; font-size: 14px; }
    .key-row { display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px dashed var(--line); font-size: 13px; align-items: center; }
    .key-row span { color: var(--ink-soft); flex-shrink: 0; }
    .key-row code { word-break: break-all; text-align: right; }
    .key-actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .btn.small { padding: 6px 14px; font-size: 12px; border-radius: var(--radius-sm); }
    .btn.danger { background: var(--error); box-shadow: none; color: #fff; }

    .analytics-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .metric-card { display: flex; flex-direction: column; gap: 8px; border-left: 3px solid var(--accent); padding: 16px; background: var(--bg-panel); border-radius: var(--radius-md); border-top: 1px solid var(--line); border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); transition: all var(--duration) var(--ease); }
    .metric-card:hover { box-shadow: var(--shadow-md); }
    .metric-label { font-size: 11px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.06em; }
    .metric-value { font-family: var(--font-display); font-size: 28px; color: var(--ink); line-height: 1; }
    .svg-bars-card h4 { margin-top: 0; font-size: 14px; }
    .bars-svg { width: 100%; height: auto; }
    .bar-label { font-size: 11px; fill: var(--ink-soft); font-family: var(--font-mono); }
    .bar-rect { fill: var(--accent); }
    .bar-value { font-size: 11px; fill: var(--ink); }

    .billing-card { max-width: 720px; transition: all var(--duration) var(--ease); }
    .billing-card:hover { box-shadow: var(--shadow-md); }
    .billing-total { font-size: 16px; margin-bottom: 16px; }
    .note-cell { font-size: 12px; color: var(--ink-soft); }
    .disclaimer { font-size: 12px; color: var(--ink-soft); margin-top: 16px; margin-bottom: 0; }

    .audit-detail { font-size: 11px; margin: 0; white-space: pre-wrap; word-break: break-word; background: var(--bg-deep); padding: 8px; border-radius: var(--radius-sm); }
    .pagination { display: flex; align-items: center; gap: 16px; margin-top: 16px; font-size: 13px; }

    .future-apis { background: var(--bg-deep); padding: 32px 0; border-radius: var(--radius-lg); margin-top: 32px; }
  `],
})
export class DeveloperPortalComponent implements OnInit {
  allowedApiChoices = ALL_ALLOWED_APIS;

  applications = signal<Application[]>([]);
  loadingApps = signal(true);
  creatingApp = signal(false);
  newAppName = '';
  newAppPlan: PlanName = 'free';
  newAppApis: string[] = ['ocr', 'accessibility.assist'];

  selectedApp = signal<Application | null>(null);
  keys = signal<ApiKeyMeta[]>([]);
  loadingKeys = signal(false);
  generatingKey = signal(false);
  generatedKey = signal<GeneratedKey | null>(null);
  confirmingRevoke = signal<string | null>(null);

  analytics = signal<AnalyticsResponse | null>(null);
  loadingAnalytics = signal(true);

  billing = signal<BillingUsageResponse | null>(null);
  loadingBilling = signal(true);
  checkingOut = signal(false);
  checkoutError = signal<string | null>(null);

  audit = signal<{ entries: AuditEntry[]; page: number; total_pages: number } | null>(null);
  loadingAudit = signal(true);
  auditPage = signal(1);

  shippedApis: ApiRow[] = [
    { name: 'Accessibility Assist API', desc: 'Single endpoint fusing OCR, scene understanding, text simplification, sign-gloss, and TTS hints based on user context.' },
    { name: 'Smart OCR API', desc: 'Image → text via genuinely local Tesseract OCR.' },
  ];

  futureApis = [
    'Accessibility Analysis API', 'Sign Language Video API', 'Speech API', 'Adaptive Content API',
    'AI Screen Reader API', 'Accessibility Chatbot API', 'Accessibility Testing API',
    'Indoor Navigation API', 'Accessibility Recommendation API', 'Braille API', 'Gesture API',
    'Emotion Recognition API',
  ];

  constructor(private dev: DevService, private toast: ToastService) {}

  ngOnInit(): void {
    this.loadApplications();
    this.loadAnalytics();
    this.loadBilling();
    this.loadAudit(1);
  }

  loadApplications() {
    this.loadingApps.set(true);
    this.dev.listApplications().subscribe({
      next: (res) => {
        this.applications.set(res.applications);
        this.loadingApps.set(false);
        if (res.applications.length && !this.selectedApp()) {
          this.selectApp(res.applications[0]);
        }
      },
      error: () => {
        this.loadingApps.set(false);
        this.toast.error('Could not load applications.');
      },
    });
  }

  createApplication() {
    if (!this.newAppName.trim()) {
      this.toast.error('Application name is required.');
      return;
    }
    this.creatingApp.set(true);
    this.dev.createApplication({ name: this.newAppName.trim(), plan: this.newAppPlan, allowed_apis: this.newAppApis }).subscribe({
      next: (res) => {
        this.creatingApp.set(false);
        this.newAppName = '';
        this.applications.update((list) => [res.application, ...list]);
        this.selectApp(res.application);
        this.toast.success('Application created.');
      },
      error: (err) => {
        this.creatingApp.set(false);
        this.toast.error(err?.error?.detail || 'Could not create application.');
      },
    });
  }

  toggleNewAppApi(api: string) {
    const set = new Set(this.newAppApis);
    if (set.has(api)) set.delete(api);
    else set.add(api);
    this.newAppApis = Array.from(set);
  }

  selectApp(app: Application) {
    this.selectedApp.set(app);
    this.generatedKey.set(null);
    this.confirmingRevoke.set(null);
    this.loadKeys(app._id);
  }

  loadKeys(appId: string) {
    this.loadingKeys.set(true);
    this.dev.listKeys(appId).subscribe({
      next: (res) => {
        this.keys.set(res.keys);
        this.loadingKeys.set(false);
      },
      error: () => {
        this.loadingKeys.set(false);
        this.toast.error('Could not load keys.');
      },
    });
  }

  generateKey() {
    const app = this.selectedApp();
    if (!app) return;
    this.generatingKey.set(true);
    this.dev.generateKey(app._id).subscribe({
      next: (res) => {
        this.generatingKey.set(false);
        this.generatedKey.set(res);
        this.loadKeys(app._id);
        this.toast.success('Key generated — copy the secret now.');
      },
      error: (err) => {
        this.generatingKey.set(false);
        this.toast.error(err?.error?.detail || 'Could not generate key.');
      },
    });
  }

  rotateKey(key: ApiKeyMeta) {
    const app = this.selectedApp();
    if (!app) return;
    this.dev.rotateKey(app._id, key._id).subscribe({
      next: (res) => {
        this.generatedKey.set(res);
        this.loadKeys(app._id);
        this.toast.success('Key rotated — copy the new secret now.');
      },
      error: (err) => this.toast.error(err?.error?.detail || 'Could not rotate key.'),
    });
  }

  revokeKey(key: ApiKeyMeta) {
    const app = this.selectedApp();
    if (!app) return;
    this.dev.revokeKey(app._id, key._id).subscribe({
      next: () => {
        this.confirmingRevoke.set(null);
        this.loadKeys(app._id);
        this.toast.success('Key revoked.');
      },
      error: (err) => this.toast.error(err?.error?.detail || 'Could not revoke key.'),
    });
  }

  dismissGeneratedKey() {
    this.generatedKey.set(null);
  }

  loadAnalytics() {
    this.loadingAnalytics.set(true);
    this.dev.getAnalytics().subscribe({
      next: (res) => {
        this.analytics.set(res);
        this.loadingAnalytics.set(false);
      },
      error: () => this.loadingAnalytics.set(false),
    });
  }

  barWidth(calls: number): number {
    const max = Math.max(1, ...(this.analytics()?.calls_by_api.map((r) => r.calls) || [1]));
    return Math.max(4, Math.round((calls / max) * 340));
  }

  loadBilling() {
    this.loadingBilling.set(true);
    this.dev.getBillingUsage().subscribe({
      next: (res) => {
        this.billing.set(res);
        this.loadingBilling.set(false);
      },
      error: () => this.loadingBilling.set(false),
    });
  }

  setUpBilling() {
    this.checkingOut.set(true);
    this.checkoutError.set(null);
    this.dev.createCheckout('starter').subscribe({
      next: (res) => {
        this.checkingOut.set(false);
        window.location.href = res.checkout_url;
      },
      error: (err) => {
        this.checkingOut.set(false);
        if (err?.status === 501) {
          this.checkoutError.set(err?.error?.detail || 'Stripe is not configured on this backend.');
        } else {
          this.toast.error(err?.error?.detail || 'Could not start checkout.');
        }
      },
    });
  }

  loadAudit(page: number) {
    this.loadingAudit.set(true);
    this.dev.getAudit(page).subscribe({
      next: (res) => {
        this.audit.set(res);
        this.auditPage.set(res.page);
        this.loadingAudit.set(false);
      },
      error: () => this.loadingAudit.set(false),
    });
  }

  changeAuditPage(page: number) {
    this.loadAudit(page);
  }
}
