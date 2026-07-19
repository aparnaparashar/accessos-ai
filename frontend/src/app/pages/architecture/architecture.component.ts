import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StackRow { layer: string; stack: string; }
interface ServiceRow { service: string; port: string; status: 'live' | 'planned'; resp: string; }

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">06–07 · System Architecture &amp; Tech Stack</span>
        <h1>Client Layer → API Gateway → Backend Services</h1>
        <p class="lede">The intelligence exists in one place: the AI Engine reasons continuously about
          user profile, disability, surroundings, lighting, noise, device, preferences, previous
          interactions, and current task — then generates the best experience.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Service map</span><h2>High-level flow</h2></div>
        <div class="service-map">
          <div class="map-row">Mobile App · Web Dashboard · Developer Portal</div>
          <div class="map-arrow">↓</div>
          <div class="map-row highlight">API Gateway (Kong / NGINX)</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">Auth Service · User Profile · Billing · API Keys</div>
          <div class="map-arrow">↓</div>
          <div class="map-row highlight">AI Orchestrator / Router</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">Vision · OCR · Speech · LLM · Sign Models · Navigation · Analytics</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">Event Bus (Kafka / RabbitMQ)</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">PostgreSQL · Redis · Vector DB · Object Storage</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">Monitoring &amp; Logging (Prometheus, Grafana, OpenTelemetry)</div>
        </div>
      </div>
    </section>

    <section class="section stack-section">
      <div class="container grid-2">
        <div>
          <div class="section-head"><span class="eyebrow">Application tech stack</span><h2>By layer</h2></div>
          <table>
            <thead><tr><th>Layer</th><th>Stack</th></tr></thead>
            <tbody>
              <tr *ngFor="let s of stack"><td>{{ s.layer }}</td><td>{{ s.stack }}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="section-head"><span class="eyebrow">07 · AI/ML stack</span><h2>Model layer</h2></div>
          <ul class="ml-list">
            <li *ngFor="let m of mlStack">{{ m }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section services-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Service status</span><h2>What's live vs. planned</h2></div>
        <table>
          <thead><tr><th>Service</th><th>Port</th><th>Status</th><th>Responsibility</th></tr></thead>
          <tbody>
            <tr *ngFor="let s of services">
              <td>{{ s.service }}</td>
              <td class="mono">{{ s.port }}</td>
              <td><span class="status-chip" [class]="s.status">{{ s.status.toUpperCase() }}</span></td>
              <td>{{ s.resp }}</td>
            </tr>
          </tbody>
        </table>
        <p class="note">Why capabilities live inside the Orchestrator today: rather than standing up
          seven separate microservices with mocked responses, OCR, vision description, text
          simplification, and sign-language gloss are implemented as real functions inside the
          Orchestrator now — genuine Tesseract OCR locally, genuine calls to whichever LLM vendor is
          configured for vision/text. Splitting these into independently deployed services later is
          mechanical; the interface won't change.</p>
      </div>
    </section>

    <section class="section endpoints-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">08–09 · API Reference</span><h2>Core endpoints</h2></div>
        <div class="endpoint-grid">
          <div class="card"><code>POST /v1/auth/signup</code><p>Creates a new user account (end_user or developer role).</p></div>
          <div class="card"><code>POST /v1/auth/login</code><p>Exchanges credentials for an access + refresh JWT pair.</p></div>
          <div class="card"><code>POST /v1/auth/refresh</code><p>Exchanges a valid refresh token for a new access token.</p></div>
          <div class="card"><code>POST /v1/accessibility/assist</code><p>The single call site — routes to OCR, scene understanding, simplification, STT, sign language, navigation, or TTS based on context.</p></div>
          <div class="card"><code>GET /v1/accessibility/health</code><p>Liveness check for the Orchestrator.</p></div>
          <div class="card"><code>GET /health</code><p>Liveness check, exposed by every service.</p></div>
        </div>
      </div>
    </section>

    <section class="section security-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">11 · Security &amp; Rate Limiting</span><h2>What's enforced today</h2></div>
        <div class="grid-2">
          <div class="card">
            <h4>Authentication <span class="status-chip live">LIVE</span></h4>
            <p>JWT bearer tokens issued by the Auth Service, verified at the Gateway before any request reaches the Orchestrator. Invalid or expired tokens return 401 before touching backend logic.</p>
          </div>
          <div class="card">
            <h4>Rate limiting <span class="status-chip live">LIVE</span></h4>
            <p>Redis-backed fixed-window-per-day limiter, keyed per authenticated subject. Exceeding the daily quota returns 429 with the limit in the response.</p>
          </div>
          <div class="card">
            <h4>Secrets handling <span class="status-chip live">LIVE</span></h4>
            <p>All vendor API keys and JWT signing secrets are read exclusively from environment variables — never hardcoded, never logged. A misconfigured capability fails closed with a config-error message.</p>
          </div>
          <div class="card">
            <h4>Planned <span class="status-chip planned">PLANNED</span></h4>
            <p>Per-request signature + nonce, IP restrictions &amp; key scopes, CSRF protection, full audit-log service, Alembic-managed migrations.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .lede { max-width: 680px; }
    .service-map { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .map-row { width: 100%; max-width: 720px; text-align: center; padding: 14px 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--bg-panel); font-size: 14px; }
    .map-row.highlight { border-color: var(--accent); color: var(--accent); font-weight: 600; background: var(--accent-soft); }
    .map-arrow { color: var(--ink-soft); font-size: 14px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
    .ml-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
    .ml-list li { font-size: 14.5px; padding: 10px 14px; background: var(--bg-panel); border: 1px solid var(--line); border-radius: 8px; }
    .stack-section table, .services-section table { font-size: 13.8px; }
    .mono { font-family: var(--font-mono); }
    .note { margin-top: 20px; font-size: 13.5px; padding: 16px 18px; background: var(--accent-soft); border-radius: 10px; color: var(--ink); }
    .endpoint-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .endpoint-grid .card code { display: block; margin-bottom: 8px; width: fit-content; }
    .endpoint-grid .card p { font-size: 13.5px; margin: 0; }
    .security-section .card h4 { display: flex; align-items: center; gap: 10px; font-size: 15px; }
    .security-section .card p { font-size: 13.8px; margin: 8px 0 0; }
    @media (max-width: 980px) { .grid-2 { grid-template-columns: 1fr; } .endpoint-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 620px) { .endpoint-grid { grid-template-columns: 1fr; } }
  `],
})
export class ArchitectureComponent {
  stack: StackRow[] = [
    { layer: 'Frontend', stack: 'Angular 20/21 (standalone components)' },
    { layer: 'Backend services', stack: 'Node.js / Next.js API layer + Python (Orchestrator, OCR)' },
    { layer: 'Primary database', stack: 'MongoDB (application data) / PostgreSQL (Auth Service, via SQLAlchemy)' },
    { layer: 'Cache / rate limiting', stack: 'Redis' },
    { layer: 'Vector store', stack: 'Vector DB (embeddings for RAG)' },
    { layer: 'Object storage', stack: 'Object storage / MinIO (images, video, audio)' },
    { layer: 'Event bus', stack: 'Kafka / RabbitMQ' },
    { layer: 'Gateway', stack: 'Kong / NGINX' },
    { layer: 'Monitoring & logging', stack: 'Prometheus, Grafana, OpenTelemetry' },
  ];

  mlStack = [
    'Vision-Language Models (scene understanding)',
    'OCR models (printed + handwritten text)',
    'Automatic Speech Recognition',
    'Text-to-Speech',
    'Large Language Models (reasoning and simplification)',
    'Multimodal models (image + text + audio)',
    'Object Detection (YOLO / RT-DETR)',
    'Segmentation (SAM)',
    'Retrieval-Augmented Generation (RAG)',
    'Reinforcement Learning from User Feedback (RLHF)',
  ];

  services: ServiceRow[] = [
    { service: 'Gateway', port: '8000', status: 'live', resp: 'Reverse proxy: JWT verification, Redis-based rate limiting, request routing.' },
    { service: 'Auth Service', port: '8001', status: 'live', resp: 'Signup, login, refresh, JWT issuance (SQLAlchemy + Postgres).' },
    { service: 'Accessibility Orchestrator', port: '8002', status: 'live', resp: 'Policy engine + AI provider abstraction; the single /v1/accessibility/assist endpoint.' },
    { service: 'Developer Service', port: '—', status: 'planned', resp: 'Application registration, org management.' },
    { service: 'Billing Service', port: '—', status: 'planned', resp: 'Stripe integration, invoices, usage-based charges.' },
    { service: 'Analytics Service', port: '—', status: 'planned', resp: 'Aggregated usage/latency/revenue metrics.' },
    { service: 'API Key Service', port: '—', status: 'planned', resp: 'Key generation, scopes, rotation, revocation.' },
    { service: 'Vision / Speech / LLM / Sign / Navigation', port: '—', status: 'planned', resp: 'Currently capability functions inside the Orchestrator, not separate microservices.' },
  ];
}
