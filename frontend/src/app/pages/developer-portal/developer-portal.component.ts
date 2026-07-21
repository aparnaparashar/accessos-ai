import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

interface Project {
  id: string;
  name: string;
  description: string;
  environment: string;
  status: string;
  totalRequests: number;
  keyCount: number;
  createdAt: string;
}

interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  environment: string;
  created: string;
  lastUsed: string;
  status: string;
  requestsToday: number;
}

interface RequestLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  status: number;
  latencyMs: number;
  apiKey: string;
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
            Projects
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
            [class.active]="activeTab === 'webhooks'"
            (click)="activeTab = 'webhooks'"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            Webhooks
          </button>

          <button
            class="nav-item"
            [class.active]="activeTab === 'metrics'"
            (click)="activeTab = 'metrics'"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            Metrics
          </button>
        </nav>
      </aside>

      <!-- Main Dash Content -->
      <main class="dash-main">
        <!-- Overview Tab -->
        <section *ngIf="activeTab === 'overview'">
          <div class="page-head">
            <div class="eyebrow">DASHBOARD OVERVIEW</div>
            <h1>Welcome back, {{ auth.user()?.email }}</h1>
            <p class="lede">Monitor API throughput, project health, and operational performance.</p>
          </div>

          <div class="grid-3 mb-8">
            <div class="card">
              <span class="mono muted text-xs">TOTAL REQUESTS (30D)</span>
              <h2 class="mt-1 font-mono">142,850</h2>
              <span class="status-chip live mt-2">+12.4% vs last month</span>
            </div>
            <div class="card">
              <span class="mono muted text-xs">AVERAGE LATENCY</span>
              <h2 class="mt-1 font-mono">42 ms</h2>
              <span class="status-chip live mt-2">Optimal Edge Routing</span>
            </div>
            <div class="card">
              <span class="mono muted text-xs">SUCCESS RATE</span>
              <h2 class="mt-1 font-mono">99.94%</h2>
              <span class="status-chip live mt-2">0 System Errors</span>
            </div>
          </div>

          <!-- Quick Projects View -->
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h3>Active Projects</h3>
              <button class="btn btn-primary btn-sm" (click)="activeTab = 'projects'">+ New Project</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Environment</th>
                  <th>Status</th>
                  <th>Total Requests</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of projects">
                  <td class="font-semibold">{{ p.name }}</td>
                  <td><span class="status-chip live">{{ p.environment }}</span></td>
                  <td><span class="status-chip live">ACTIVE</span></td>
                  <td class="mono">{{ p.totalRequests.toLocaleString() }}</td>
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
            <p class="lede">Projects contain your API keys, webhooks, and request logs.</p>
          </div>

          <div class="card mb-6">
            <div class="grid-2">
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
            <button class="btn btn-primary mt-4" (click)="createProject()">Create Project</button>
          </div>

          <div class="grid-2">
            <div class="card" *ngFor="let p of projects">
              <div class="flex justify-between items-start mb-2">
                <h3>{{ p.name }}</h3>
                <span class="status-chip live">{{ p.environment }}</span>
              </div>
              <p class="muted text-sm mb-4">{{ p.description }}</p>
              <div class="flex justify-between items-center text-xs mono border-top pt-3">
                <span>Keys: {{ p.keyCount }}</span>
                <span>Requests: {{ p.totalRequests.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Keys Tab -->
        <section *ngIf="activeTab === 'keys'">
          <div class="page-head">
            <div class="eyebrow">SECURITY & CREDENTIALS</div>
            <h1>API Keys</h1>
            <p class="lede">Generate secret API keys for your applications. Keep secret keys safe.</p>
          </div>

          <div class="card mb-6" *ngIf="newSecretKey">
            <div class="form-error bg-green-500/10 border-green-500/20 text-green-300">
              <strong>API Key Generated Successfully!</strong>
              <p class="text-xs mt-1">Copy this secret key now. You won't be able to see it again.</p>
              <pre class="mt-2 text-white"><code>{{ newSecretKey }}</code></pre>
              <button class="btn btn-ghost btn-sm mt-2" (click)="newSecretKey = null">Dismiss</button>
            </div>
          </div>

          <div class="card mb-6">
            <div class="grid-2">
              <div class="field">
                <label>Key Name</label>
                <input type="text" [(ngModel)]="newKeyName" placeholder="e.g. Backend Production Key" />
              </div>
              <div class="field">
                <label>Target Project</label>
                <select [(ngModel)]="newKeyProject">
                  <option *ngFor="let p of projects" [value]="p.id">{{ p.name }}</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary mt-4" (click)="generateKey()">Generate Secret API Key</button>
          </div>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Key Masked</th>
                  <th>Env</th>
                  <th>Last Used</th>
                  <th>Requests Today</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let k of keys">
                  <td class="font-semibold">{{ k.name }}</td>
                  <td class="mono"><code>{{ k.keyMasked }}</code></td>
                  <td><span class="status-chip live">{{ k.environment }}</span></td>
                  <td class="mono text-xs">{{ k.lastUsed }}</td>
                  <td class="mono">{{ k.requestsToday }}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" (click)="rotateKey(k.id)">Rotate</button>
                    <button class="btn btn-ghost btn-sm text-red-400" (click)="revokeKey(k.id)">Revoke</button>
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
            <p class="lede">Real-time inspection of API request latency, HTTP status codes, and endpoints.</p>
          </div>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Endpoint</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>API Key</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let l of logs">
                  <td class="mono text-xs muted">{{ l.timestamp }}</td>
                  <td class="mono"><code>{{ l.endpoint }}</code></td>
                  <td><span class="mono font-bold text-xs">{{ l.method }}</span></td>
                  <td><span class="status-chip live">HTTP {{ l.status }}</span></td>
                  <td class="mono text-xs">{{ l.latencyMs }} ms</td>
                  <td class="mono text-xs muted">{{ l.apiKey }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Webhooks Tab -->
        <section *ngIf="activeTab === 'webhooks'">
          <div class="page-head">
            <div class="eyebrow">ASYNC EVENT DISPATCH</div>
            <h1>Webhooks</h1>
            <p class="lede">Receive real-time HTTP callbacks when async processing jobs complete.</p>
          </div>

          <div class="card text-center py-12">
            <h3>No Webhooks Configured</h3>
            <p class="muted max-w-sm mx-auto mb-4">Register an HTTP endpoint URL to receive automated JSON notifications.</p>
            <button class="btn btn-primary">+ Add Webhook Endpoint</button>
          </div>
        </section>

        <!-- Metrics Tab -->
        <section *ngIf="activeTab === 'metrics'">
          <div class="page-head">
            <div class="eyebrow">ANALYTICS</div>
            <h1>System Metrics</h1>
            <p class="lede">Performance and usage metrics across all endpoints.</p>
          </div>

          <div class="grid-2 mb-6">
            <div class="card">
              <h4>Top Endpoints by Usage</h4>
              <ul class="mt-4 space-y-2 font-mono text-xs">
                <li class="flex justify-between"><span>/v1/ocr</span> <span>72,400 calls</span></li>
                <li class="flex justify-between"><span>/v1/accessibility/assist</span> <span>45,120 calls</span></li>
                <li class="flex justify-between"><span>/v1/simplify</span> <span>25,330 calls</span></li>
              </ul>
            </div>
            <div class="card">
              <h4>Global Latency Breakdown</h4>
              <ul class="mt-4 space-y-2 font-mono text-xs">
                <li class="flex justify-between"><span>p50 Latency</span> <span>34 ms</span></li>
                <li class="flex justify-between"><span>p95 Latency</span> <span>78 ms</span></li>
                <li class="flex justify-between"><span>p99 Latency</span> <span>112 ms</span></li>
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

    @media (max-width: 860px) {
      .dashboard-layout { grid-template-columns: 1fr; }
      .dash-sidebar { border-right: none; border-bottom: 1px solid var(--line); }
      .dash-main { padding: 24px; }
    }
  `],
})
export class DeveloperPortalComponent implements OnInit {
  activeTab = 'overview';
  newProjectName = '';
  newProjectEnv = 'production';

  newKeyName = '';
  newKeyProject = 'p1';
  newSecretKey: string | null = null;

  projects: Project[] = [
    {
      id: 'p1',
      name: 'Production Workspace',
      description: 'Primary customer-facing mobile application.',
      environment: 'Production',
      status: 'Active',
      totalRequests: 124500,
      keyCount: 2,
      createdAt: '2026-06-01',
    },
    {
      id: 'p2',
      name: 'Staging Environment',
      description: 'Pre-release deployment testing workspace.',
      environment: 'Staging',
      status: 'Active',
      totalRequests: 18350,
      keyCount: 1,
      createdAt: '2026-06-15',
    },
  ];

  keys: ApiKeyItem[] = [
    {
      id: 'k1',
      name: 'Mobile App API Key',
      keyMasked: 'aos_live_8f3a...91a2',
      environment: 'Production',
      created: '2026-06-02',
      lastUsed: '2 mins ago',
      status: 'Active',
      requestsToday: 4210,
    },
    {
      id: 'k2',
      name: 'Backend Web Server Key',
      keyMasked: 'aos_live_71c2...88f4',
      environment: 'Production',
      created: '2026-06-10',
      lastUsed: 'Just now',
      status: 'Active',
      requestsToday: 8930,
    },
  ];

  logs: RequestLog[] = [
    {
      id: 'l1',
      timestamp: new Date().toLocaleTimeString(),
      endpoint: '/v1/ocr',
      method: 'POST',
      status: 200,
      latencyMs: 38,
      apiKey: 'aos_live_8f3a...',
    },
    {
      id: 'l2',
      timestamp: new Date(Date.now() - 15000).toLocaleTimeString(),
      endpoint: '/v1/accessibility/assist',
      method: 'POST',
      status: 200,
      latencyMs: 44,
      apiKey: 'aos_live_71c2...',
    },
    {
      id: 'l3',
      timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
      endpoint: '/v1/simplify',
      method: 'POST',
      status: 200,
      latencyMs: 32,
      apiKey: 'aos_live_8f3a...',
    },
  ];

  constructor(public auth: AuthService) {}

  ngOnInit() {}

  createProject() {
    if (!this.newProjectName) return;
    this.projects.push({
      id: Math.random().toString(36).substring(2, 8),
      name: this.newProjectName,
      description: 'Newly created developer project.',
      environment: this.newProjectEnv,
      status: 'Active',
      totalRequests: 0,
      keyCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    });
    this.newProjectName = '';
  }

  generateKey() {
    const keyName = this.newKeyName || 'Default Key';
    const secret = 'aos_live_' + Math.random().toString(36).substring(2, 18) + Math.random().toString(36).substring(2, 18);
    this.newSecretKey = secret;

    this.keys.unshift({
      id: Math.random().toString(36).substring(2, 8),
      name: keyName,
      keyMasked: secret.substring(0, 12) + '...' + secret.substring(secret.length - 4),
      environment: 'Production',
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'Active',
      requestsToday: 0,
    });
    this.newKeyName = '';
  }

  rotateKey(id: string) {
    const secret = 'aos_live_rot_' + Math.random().toString(36).substring(2, 18);
    this.newSecretKey = secret;
    const k = this.keys.find((item) => item.id === id);
    if (k) {
      k.keyMasked = secret.substring(0, 12) + '...' + secret.substring(secret.length - 4);
      k.lastUsed = 'Rotated just now';
    }
  }

  revokeKey(id: string) {
    this.keys = this.keys.filter((item) => item.id !== id);
  }
}
