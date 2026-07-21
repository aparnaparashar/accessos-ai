import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { ApiService, ApiError } from '../../core/api.service';

interface Project {
  _id: string;
  name: string;
  description: string;
  environment: string;
  status: string;
  createdAt: string;
}

interface ApiKeyItem {
  _id: string;
  name: string;
  client_id: string;
  environment: string;
  last_used_at: string | null;
  total_requests: number;
  revoked: boolean;
  createdAt: string;
}

interface RequestLogItem {
  _id: string;
  endpoint: string;
  method: string;
  status_code: number;
  latency_ms: number;
  createdAt: string;
  api_key?: { name: string; client_id: string };
}

interface ProjectMetrics {
  requests_today: number;
  weekly_requests: number;
  monthly_requests: number;
  total_requests: number;
  success_rate: number;
  average_latency_ms: number;
  top_endpoints: Array<{ endpoint: string; requests: number; avg_latency_ms: number }>;
  api_key_count: number;
}

@Component({
  selector: 'app-developer-portal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="dash-sidebar">
        <div class="sidebar-brand mb-6">
          <span class="mono text-xs text-muted">WORKSPACE</span>
          <h3 class="mt-1 font-semibold">AccessOS Dev</h3>
        </div>

        <nav class="sidebar-nav">
          <button
            class="nav-item"
            [class.active]="activeTab === 'overview'"
            (click)="activeTab = 'overview'"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Overview
          </button>

          <button
            class="nav-item"
            [class.active]="activeTab === 'projects'"
            (click)="activeTab = 'projects'"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            Projects ({{ projects().length }})
          </button>

          <button
            class="nav-item"
            [class.active]="activeTab === 'keys'"
            (click)="activeTab = 'keys'"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            API Keys
          </button>

          <button
            class="nav-item"
            [class.active]="activeTab === 'logs'"
            (click)="activeTab = 'logs'"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Request Logs
          </button>

          <button
            class="nav-item"
            [class.active]="activeTab === 'metrics'"
            (click)="activeTab = 'metrics'"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            System Metrics
          </button>
        </nav>
      </aside>

      <!-- Main Dash Content -->
      <main class="dash-main">
        <!-- Project Selector Header -->
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-line" *ngIf="projects().length > 0">
          <div class="flex items-center gap-3">
            <span class="mono text-xs muted">ACTIVE PROJECT:</span>
            <select [(ngModel)]="selectedProjectId" (change)="onProjectSelect()" class="project-select font-semibold">
              <option *ngFor="let p of projects()" [value]="p._id">{{ p.name }} ({{ p.environment }})</option>
            </select>
          </div>
          <button class="btn btn-primary btn-sm" (click)="activeTab = 'projects'">+ New Project</button>
        </div>

        <!-- Overview Tab -->
        <section *ngIf="activeTab === 'overview'">
          <div class="page-head">
            <div class="eyebrow">DASHBOARD OVERVIEW</div>
            <h1>Welcome back, {{ firstName }}!</h1>
            <p class="lede">Live telemetry & project analytics loaded directly from your MongoDB database.</p>
          </div>

          <div class="grid-3 mb-8">
            <div class="card">
              <span class="mono muted text-xs">TOTAL REQUESTS</span>
              <h2 class="mt-1 font-mono">{{ metrics()?.total_requests ?? 0 }}</h2>
              <span class="status-chip live mt-2">MongoDB Log Aggregation</span>
            </div>
            <div class="card">
              <span class="mono muted text-xs">AVG LATENCY</span>
              <h2 class="mt-1 font-mono">{{ metrics()?.average_latency_ms ?? 0 }} ms</h2>
              <span class="status-chip live mt-2">Live Response Pipeline</span>
            </div>
            <div class="card">
              <span class="mono muted text-xs">SUCCESS RATE</span>
              <h2 class="mt-1 font-mono">{{ ((metrics()?.success_rate ?? 1.0) * 100).toFixed(1) }}%</h2>
              <span class="status-chip live mt-2">Real-time HTTP 2xx</span>
            </div>
          </div>

          <!-- Active Projects View -->
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h3>Projects in Database ({{ projects().length }})</h3>
              <button class="btn btn-ghost btn-sm" (click)="loadAllData()">↻ Refresh DB</button>
            </div>

            <div *ngIf="loading()" class="py-8 text-center muted">Loading database records…</div>

            <div *ngIf="!loading() && projects().length === 0" class="py-8 text-center">
              <p class="muted mb-4">No projects stored in MongoDB yet.</p>
              <button class="btn btn-primary" (click)="activeTab = 'projects'">Create Your First Project</button>
            </div>

            <table *ngIf="!loading() && projects().length > 0">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Environment</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of projects()">
                  <td class="font-semibold">{{ p.name }}</td>
                  <td><span class="status-chip live">{{ p.environment }}</span></td>
                  <td><span class="status-chip live">{{ p.status.toUpperCase() }}</span></td>
                  <td class="mono text-xs muted">{{ formatDate(p.createdAt) }}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" (click)="selectProject(p._id)">Select</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Projects Tab -->
        <section *ngIf="activeTab === 'projects'">
          <div class="page-head">
            <div class="eyebrow">WORKSPACE MANAGEMENT</div>
            <h1>Projects</h1>
            <p class="lede">Manage developer workspaces. Projects isolate API keys and request logs in MongoDB.</p>
          </div>

          <div class="card mb-6">
            <h3>Create New Project</h3>
            <div class="grid-2 mt-4">
              <div class="field">
                <label>Project Name</label>
                <input type="text" [(ngModel)]="newProjectName" placeholder="e.g. Production Mobile App" />
              </div>
              <div class="field">
                <label>Environment</label>
                <select [(ngModel)]="newProjectEnv">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary mt-4" (click)="createProject()" [disabled]="creatingProject()">
              {{ creatingProject() ? 'Saving to Database…' : 'Create & Save to DB' }}
            </button>
          </div>

          <div class="grid-2">
            <div class="card" *ngFor="let p of projects()">
              <div class="flex justify-between items-start mb-2">
                <h3>{{ p.name }}</h3>
                <span class="status-chip live">{{ p.environment }}</span>
              </div>
              <p class="muted text-sm mb-4">{{ p.description || 'No description provided.' }}</p>
              <div class="flex justify-between items-center text-xs mono border-top pt-3">
                <span class="muted">ID: {{ p._id }}</span>
                <button class="btn btn-ghost btn-sm text-red-400" (click)="archiveProject(p._id)">Archive</button>
              </div>
            </div>
          </div>
        </section>

        <!-- Keys Tab -->
        <section *ngIf="activeTab === 'keys'">
          <div class="page-head">
            <div class="eyebrow">SECURITY & CREDENTIALS</div>
            <h1>API Keys</h1>
            <p class="lede">Generate secret API keys for your applications. All keys are hashed and stored in MongoDB.</p>
          </div>

          <!-- Secret Key Alert banner -->
          <div class="card mb-6 bg-green-900/20 border-green-500/30" *ngIf="newSecretKey()">
            <div class="flex justify-between items-start">
              <div>
                <strong class="text-green-400">⚡ Secret API Key Generated!</strong>
                <p class="text-xs muted mt-1">Copy this secret key now. It is stored securely as a SHA-256 hash in MongoDB and cannot be displayed again.</p>
              </div>
              <button class="btn btn-ghost btn-sm" (click)="newSecretKey.set(null)">✕ Dismiss</button>
            </div>
            <div class="flex items-center gap-2 mt-3 font-mono text-xs bg-black/40 p-3 rounded border border-line">
              <code class="flex-1 text-green-300 select-all">{{ newSecretKey() }}</code>
              <button class="btn btn-primary btn-sm" (click)="copySecretKey()">
                {{ keyCopied() ? '✓ Copied' : 'Copy Key' }}
              </button>
            </div>
          </div>

          <div class="card mb-6" *ngIf="projects().length > 0">
            <h3>Generate Secret Key</h3>
            <div class="grid-2 mt-4">
              <div class="field">
                <label>Key Description / Name</label>
                <input type="text" [(ngModel)]="newKeyName" placeholder="e.g. Server Backend Production Key" />
              </div>
              <div class="field">
                <label>Environment</label>
                <select [(ngModel)]="newKeyEnv">
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary mt-4" (click)="generateKey()" [disabled]="generatingKey()">
              {{ generatingKey() ? 'Generating Key…' : 'Generate & Save Secret Key' }}
            </button>
          </div>

          <div class="card">
            <h3>Database API Keys ({{ keys().length }})</h3>
            <div *ngIf="keys().length === 0" class="py-6 text-center muted">No API keys generated yet for this project.</div>
            <table *ngIf="keys().length > 0" class="mt-4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Client ID</th>
                  <th>Environment</th>
                  <th>Last Used</th>
                  <th>Total Requests</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let k of keys()">
                  <td class="font-semibold">{{ k.name }}</td>
                  <td class="mono"><code>{{ k.client_id }}</code></td>
                  <td><span class="status-chip live">{{ k.environment }}</span></td>
                  <td class="mono text-xs muted">{{ k.last_used_at ? formatDate(k.last_used_at) : 'Never' }}</td>
                  <td class="mono">{{ k.total_requests }}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" (click)="rotateKey(k._id)" [disabled]="k.revoked">Rotate</button>
                    <button class="btn btn-ghost btn-sm text-red-400" (click)="revokeKey(k._id)" [disabled]="k.revoked">
                      {{ k.revoked ? 'Revoked' : 'Revoke' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Logs Tab -->
        <section *ngIf="activeTab === 'logs'">
          <div class="page-head">
            <div class="eyebrow">OBSERVABILITY</div>
            <h1>Request Logs</h1>
            <p class="lede">Real-time audit log of actual API requests recorded in MongoDB.</p>
          </div>

          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h3>MongoDB Log Records ({{ logs().length }})</h3>
              <button class="btn btn-ghost btn-sm" (click)="loadLogs(selectedProjectId)">↻ Refresh Logs</button>
            </div>

            <div *ngIf="logs().length === 0" class="py-8 text-center muted">
              No API requests logged yet for this project. Execute requests in the Playground to see live logs here.
            </div>

            <table *ngIf="logs().length > 0">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Key Name</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let l of logs()">
                  <td class="mono text-xs muted">{{ formatDate(l.createdAt) }}</td>
                  <td class="mono"><code>{{ l.endpoint }}</code></td>
                  <td><span class="mono font-bold text-xs">{{ l.method }}</span></td>
                  <td>
                    <span class="status-chip live" *ngIf="l.status_code < 400">HTTP {{ l.status_code }}</span>
                    <span class="status-chip planned" *ngIf="l.status_code >= 400">HTTP {{ l.status_code }}</span>
                  </td>
                  <td class="mono text-xs">{{ l.latency_ms }} ms</td>
                  <td class="mono text-xs muted">{{ l.api_key?.name ?? 'Demo / JWT' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Metrics Tab -->
        <section *ngIf="activeTab === 'metrics'">
          <div class="page-head">
            <div class="eyebrow">ANALYTICS</div>
            <h1>System Metrics</h1>
            <p class="lede">Real-time analytics computed dynamically from MongoDB RequestLog collections.</p>
          </div>

          <div class="grid-2 mb-6">
            <div class="card">
              <h4>Top Endpoints by Volume</h4>
              <div *ngIf="!metrics()?.top_endpoints?.length" class="muted text-xs mt-4">No endpoint traffic logged yet.</div>
              <ul class="mt-4 space-y-2 font-mono text-xs" *ngIf="metrics()?.top_endpoints?.length">
                <li class="flex justify-between" *ngFor="let e of metrics()?.top_endpoints">
                  <span>{{ e.endpoint }}</span>
                  <span>{{ e.requests }} calls ({{ e.avg_latency_ms }}ms avg)</span>
                </li>
              </ul>
            </div>
            <div class="card">
              <h4>Project Rate Limits & Quota</h4>
              <ul class="mt-4 space-y-2 font-mono text-xs">
                <li class="flex justify-between"><span>Requests Today</span> <span>{{ metrics()?.requests_today ?? 0 }}</span></li>
                <li class="flex justify-between"><span>Weekly Total</span> <span>{{ metrics()?.weekly_requests ?? 0 }}</span></li>
                <li class="flex justify-between"><span>Monthly Total</span> <span>{{ metrics()?.monthly_requests ?? 0 }}</span></li>
                <li class="flex justify-between"><span>Active API Keys</span> <span>{{ metrics()?.api_key_count ?? 0 }}</span></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      min-height: calc(100vh - 64px);
    }
    .dash-sidebar {
      background: var(--bg-deep);
      border-right: 1px solid var(--line);
      padding: 32px 16px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: transparent;
      color: var(--ink-soft);
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 4px;
      transition: all var(--duration-fast) var(--ease);
    }
    .nav-item:hover { color: #fff; background: rgba(255, 255, 255, 0.04); }
    .nav-item.active { color: #fff; background: var(--accent-soft); font-weight: 600; }

    .dash-main { padding: 40px 48px; max-width: 1200px; }
    .btn-sm { padding: 4px 10px; font-size: 12px; }

    .project-select {
      background: var(--bg-deep); border: 1px solid var(--line); color: #fff;
      padding: 6px 12px; border-radius: var(--radius-sm); font-size: 13px; outline: none;
    }

    @media (max-width: 860px) {
      .dashboard-layout { grid-template-columns: 1fr; }
      .dash-sidebar { border-right: none; border-bottom: 1px solid var(--line); }
      .dash-main { padding: 24px; }
    }
  `],
})
export class DeveloperPortalComponent implements OnInit {
  private apiService = inject(ApiService);
  public auth = inject(AuthService);

  activeTab = 'overview';

  projects = signal<Project[]>([]);
  keys = signal<ApiKeyItem[]>([]);
  logs = signal<RequestLogItem[]>([]);
  metrics = signal<ProjectMetrics | null>(null);

  selectedProjectId = '';
  loading = signal(false);

  newProjectName = '';
  newProjectEnv = 'production';
  creatingProject = signal(false);

  newKeyName = '';
  newKeyEnv = 'production';
  generatingKey = signal(false);
  newSecretKey = signal<string | null>(null);
  keyCopied = signal(false);

  get firstName(): string {
    const user = this.auth.user();
    if (user?.full_name && user.full_name.trim().length > 0) {
      return user.full_name.trim().split(' ')[0];
    }
    if (user?.email && user.email.includes('@')) {
      const prefix = user.email.split('@')[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return 'Developer';
  }

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading.set(true);
    this.apiService.get<{ projects: Project[] }>('/v1/projects').subscribe({
      next: (res) => {
        const list = res.projects || [];
        this.projects.set(list);
        this.loading.set(false);
        if (list.length > 0 && !this.selectedProjectId) {
          this.selectedProjectId = list[0]._id;
          this.onProjectSelect();
        }
      },
      error: () => this.loading.set(false),
    });
  }

  onProjectSelect() {
    if (!this.selectedProjectId) return;
    this.loadKeys(this.selectedProjectId);
    this.loadLogs(this.selectedProjectId);
    this.loadMetrics(this.selectedProjectId);
  }

  selectProject(id: string) {
    this.selectedProjectId = id;
    this.onProjectSelect();
    this.activeTab = 'keys';
  }

  loadKeys(projectId: string) {
    this.apiService.get<{ keys: ApiKeyItem[] }>(`/v1/projects/${projectId}/api-keys`).subscribe({
      next: (res) => this.keys.set(res.keys || []),
      error: () => this.keys.set([]),
    });
  }

  loadLogs(projectId: string) {
    this.apiService.get<{ logs: RequestLogItem[] }>(`/v1/projects/${projectId}/logs`).subscribe({
      next: (res) => this.logs.set(res.logs || []),
      error: () => this.logs.set([]),
    });
  }

  loadMetrics(projectId: string) {
    this.apiService.get<{ metrics: ProjectMetrics }>(`/v1/projects/${projectId}/metrics`).subscribe({
      next: (res) => this.metrics.set(res.metrics),
      error: () => this.metrics.set(null),
    });
  }

  createProject() {
    if (!this.newProjectName.trim()) return;
    this.creatingProject.set(true);

    this.apiService.post<{ project: Project }>('/v1/projects', {
      name: this.newProjectName,
      environment: this.newProjectEnv,
    }).subscribe({
      next: (res) => {
        this.creatingProject.set(false);
        this.newProjectName = '';
        this.projects.update((list) => [res.project, ...list]);
        this.selectedProjectId = res.project._id;
        this.onProjectSelect();
      },
      error: () => this.creatingProject.set(false),
    });
  }

  archiveProject(id: string) {
    if (!confirm('Are you sure you want to archive this project and revoke its keys?')) return;
    this.apiService.delete(`/v1/projects/${id}`).subscribe({
      next: () => {
        this.projects.update((list) => list.filter((p) => p._id !== id));
        if (this.selectedProjectId === id) {
          const remaining = this.projects();
          this.selectedProjectId = remaining.length > 0 ? remaining[0]._id : '';
          this.onProjectSelect();
        }
      },
    });
  }

  generateKey() {
    if (!this.selectedProjectId) return;
    this.generatingKey.set(true);

    this.apiService.post<{ secret_key: string }>(`/v1/projects/${this.selectedProjectId}/api-keys`, {
      name: this.newKeyName || 'Default Key',
      environment: this.newKeyEnv,
    }).subscribe({
      next: (res) => {
        this.generatingKey.set(false);
        this.newKeyName = '';
        this.newSecretKey.set(res.secret_key);
        this.loadKeys(this.selectedProjectId);
      },
      error: () => this.generatingKey.set(false),
    });
  }

  rotateKey(keyId: string) {
    if (!this.selectedProjectId || !confirm('Rotate secret key? Existing secret will stop working immediately.')) return;
    this.apiService.post<{ secret_key: string }>(`/v1/projects/${this.selectedProjectId}/api-keys/${keyId}/rotate`, {}).subscribe({
      next: (res) => {
        this.newSecretKey.set(res.secret_key);
        this.loadKeys(this.selectedProjectId);
      },
    });
  }

  revokeKey(keyId: string) {
    if (!this.selectedProjectId || !confirm('Revoke this key? Access using this key will be permanently blocked.')) return;
    this.apiService.delete(`/v1/projects/${this.selectedProjectId}/api-keys/${keyId}`).subscribe({
      next: () => this.loadKeys(this.selectedProjectId),
    });
  }

  copySecretKey() {
    const key = this.newSecretKey();
    if (key) {
      navigator.clipboard.writeText(key);
      this.keyCopied.set(true);
      setTimeout(() => this.keyCopied.set(false), 2000);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  }
}
