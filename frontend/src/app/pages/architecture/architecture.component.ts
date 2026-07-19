import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface StackRow { layer: string; stack: string; }
interface RouteRow { method: string; path: string; status: 'live' | 'planned'; desc: string; }

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">06–07 · System Architecture &amp; Tech Stack</span>
        <h1>What's actually running today</h1>
        <p class="lede">
          Two services, not a microservices mesh: an Angular 20 single-page app talking to one
          Next.js 14 App Router backend. Every capability below — auth, the accessibility
          Orchestrator, the Developer Platform, billing, and analytics — is real code you can run
          locally with <code>npm install &amp; npm run dev</code> in each folder, no Docker or
          infrastructure required yet. See the <a routerLink="/roadmap">Roadmap</a> for what's
          intentionally still ahead.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Service map</span><h2>Request flow</h2></div>
        <div class="service-map">
          <div class="map-row">Angular 20 SPA (localhost:4200)</div>
          <div class="map-arrow">↓ fetch /v1/*, /health · JWT bearer or API key</div>
          <div class="map-row highlight">Next.js 14 App Router backend (localhost:8000)</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">middleware.ts — CORS + security headers on every /api/* route</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">Auth · Accessibility Orchestrator · Developer Platform · Billing · Analytics · Audit</div>
          <div class="map-arrow">↓</div>
          <div class="map-row">MongoDB (Mongoose) · Redis (ioredis, rate limits + nonces)</div>
        </div>
        <p class="note">
          There is deliberately no separate API gateway, message bus, or per-capability microservice
          yet. Auth, the Orchestrator, the Developer Platform, billing, and analytics are all route
          handlers inside the one Next.js backend, sharing the same Mongo connection and Redis
          client. Splitting any of these into an independently deployed service later is a matter of
          moving files — the request/response shape at each endpoint doesn't change.
        </p>
      </div>
    </section>

    <section class="section stack-section">
      <div class="container grid-2">
        <div>
          <div class="section-head"><span class="eyebrow">Tech stack</span><h2>By layer</h2></div>
          <table>
            <thead><tr><th>Layer</th><th>Stack</th></tr></thead>
            <tbody>
              <tr *ngFor="let s of stack"><td>{{ s.layer }}</td><td>{{ s.stack }}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="section-head"><span class="eyebrow">Capability layer</span><h2>Inside the Orchestrator</h2></div>
          <ul class="ml-list">
            <li *ngFor="let m of capabilityStack">{{ m }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section endpoints-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">08–09 · API Reference</span><h2>Every route in the backend today</h2></div>
        <table>
          <thead><tr><th>Method</th><th>Path</th><th>Status</th><th>What it does</th></tr></thead>
          <tbody>
            <tr *ngFor="let r of routeTable">
              <td class="mono">{{ r.method }}</td>
              <td class="mono">{{ r.path }}</td>
              <td><span class="status-chip" [class]="r.status">{{ r.status.toUpperCase() }}</span></td>
              <td>{{ r.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="section security-section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">11 · Security &amp; Rate Limiting</span><h2>What's enforced today</h2></div>
        <div class="grid-2">
          <div class="card">
            <h4>Authentication <span class="status-chip live">LIVE</span></h4>
            <p>JWT access/refresh tokens (bcrypt-hashed passwords) verified on every protected route. Developer Platform routes additionally require a <code>developer</code>-role token.</p>
          </div>
          <div class="card">
            <h4>Rate limiting <span class="status-chip live">LIVE</span></h4>
            <p>Redis-backed fixed-window-per-day limiter keyed per authenticated subject on /v1/accessibility/assist. Exceeding quota returns 429 with the limit in the response.</p>
          </div>
          <div class="card">
            <h4>API key hashing <span class="status-chip live">LIVE</span></h4>
            <p>Every generated secret is bcrypt-hashed at rest; the plaintext is returned exactly once and never stored or logged again.</p>
          </div>
          <div class="card">
            <h4>CORS <span class="status-chip live">LIVE</span></h4>
            <p>middleware.ts answers preflight OPTIONS and sets Access-Control-Allow-Origin from the ALLOWED_ORIGINS env var (defaults to the Angular dev server), fixing the original cross-origin block.</p>
          </div>
          <div class="card">
            <h4>Fail-closed capabilities <span class="status-chip live">LIVE</span></h4>
            <p>Vision/text AI providers and Stripe billing both return <code>capability_not_configured</code> instead of faking success when their env vars aren't set — never a hardcoded secret, never a silent fallback.</p>
          </div>
          <div class="card">
            <h4>Planned <span class="status-chip planned">PLANNED</span></h4>
            <p>Per-request HMAC signature + nonce replay protection (helpers exist in <code>lib/keys.ts</code> and <code>lib/redis.ts</code> but aren't wired into a route yet), IP allowlists on keys, CSRF protection.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><span class="eyebrow">Run it locally</span><h2>No infrastructure required</h2></div>
        <div class="grid-2">
          <div class="card">
            <h4>Backend</h4>
            <p>Needs a local MongoDB and Redis (e.g. installed natively or via your own docker run — no compose file is provided yet). Copy <code>backend/.env.example</code> to <code>.env</code>, then <code>npm install &amp;&amp; npm run dev</code> — serves on :8000.</p>
          </div>
          <div class="card">
            <h4>Frontend</h4>
            <p><code>npm install &amp;&amp; npm start</code> in <code>frontend/</code> — serves on :4200 with a dev-server proxy for /v1/* and /health to :8000, so CORS doesn't even come into play during <code>ng serve</code>; the middleware fix covers any direct cross-origin call too.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .lede { max-width: 700px; }
    .service-map { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .map-row { width: 100%; max-width: 760px; text-align: center; padding: 14px 18px; border: 1px solid var(--line); border-radius: 10px; background: var(--bg-panel); font-size: 13.8px; }
    .map-row.highlight { border-color: var(--accent); color: var(--accent); font-weight: 600; background: var(--accent-soft); }
    .map-arrow { color: var(--ink-soft); font-size: 12.5px; text-align: center; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
    .ml-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
    .ml-list li { font-size: 14.5px; padding: 10px 14px; background: var(--bg-panel); border: 1px solid var(--line); border-radius: 8px; }
    .stack-section table, .endpoints-section table { font-size: 13.5px; }
    .mono { font-family: var(--font-mono); font-size: 12.5px; }
    .note { margin-top: 20px; font-size: 13.5px; padding: 16px 18px; background: var(--accent-soft); border-radius: 10px; color: var(--ink); }
    .security-section .card h4 { display: flex; align-items: center; gap: 10px; font-size: 15px; }
    .security-section .card p { font-size: 13.8px; margin: 8px 0 0; }
    @media (max-width: 980px) { .grid-2 { grid-template-columns: 1fr; } }
  `],
})
export class ArchitectureComponent {
  stack: StackRow[] = [
    { layer: 'Frontend', stack: 'Angular 20 (standalone components, lazy-loaded routes)' },
    { layer: 'Backend', stack: 'Next.js 14 App Router — one service, all /v1/* and /health routes' },
    { layer: 'Database', stack: 'MongoDB via Mongoose' },
    { layer: 'Cache / rate limiting', stack: 'Redis via ioredis' },
    { layer: 'Auth', stack: 'JWT (jsonwebtoken) + bcrypt password hashing' },
    { layer: 'OCR', stack: 'Tesseract.js — genuinely local, no vendor key needed' },
    { layer: 'Vision / text AI', stack: 'Provider-abstracted (openai/gemini/claude); fails closed when unconfigured' },
    { layer: 'Billing', stack: 'Stripe Checkout; fails closed when unconfigured' },
    { layer: 'Validation', stack: 'Zod schemas on every request body' },
  ];

  capabilityStack = [
    'OCR (Tesseract.js) — real, local',
    'Scene / vision description — routed to configured vendor, or capability_not_configured',
    'Text simplification — routed to configured text LLM, or falls back to original text',
    'Rule-based sign-language gloss (Section 13 roadmap: replace with a trained model)',
    'TTS hint flag only — audio_url is always null until object storage is added',
    'Rule-based policy engine deciding which of the above to invoke per request',
  ];

  routeTable: RouteRow[] = [
    { method: 'POST', path: '/v1/auth/signup', status: 'live', desc: 'Create an account (end_user or developer role).' },
    { method: 'POST', path: '/v1/auth/login', status: 'live', desc: 'Exchange credentials for access + refresh JWTs.' },
    { method: 'POST', path: '/v1/auth/refresh', status: 'live', desc: 'Exchange a refresh token for a new access token.' },
    { method: 'POST', path: '/v1/accessibility/assist', status: 'live', desc: 'The single Orchestrator call site — OCR, vision, simplification, sign-gloss, TTS hints.' },
    { method: 'GET', path: '/v1/accessibility/health', status: 'live', desc: 'Orchestrator liveness check.' },
    { method: 'POST', path: '/v1/ocr', status: 'live', desc: 'Standalone OCR product endpoint, API-key authenticated.' },
    { method: 'POST/GET', path: '/v1/developer/applications', status: 'live', desc: 'Create/list your applications.' },
    { method: 'GET/PATCH', path: '/v1/developer/applications/:id', status: 'live', desc: 'Read or update one application (ownership-checked).' },
    { method: 'POST/GET', path: '/v1/developer/applications/:id/keys', status: 'live', desc: 'Generate a key (secret shown once) or list key metadata.' },
    { method: 'POST', path: '/v1/developer/applications/:id/keys/:keyId/rotate', status: 'live', desc: 'Rotate a key\'s secret, keeping the same client_id.' },
    { method: 'DELETE', path: '/v1/developer/applications/:id/keys/:keyId', status: 'live', desc: 'Revoke a key (soft-deleted, never hard-removed).' },
    { method: 'GET', path: '/v1/analytics', status: 'live', desc: 'Aggregated usage/latency/success-rate across your applications.' },
    { method: 'GET', path: '/v1/billing/usage', status: 'live', desc: 'Estimated usage-based charges for the current billing period.' },
    { method: 'POST', path: '/v1/billing/checkout', status: 'live', desc: 'Real Stripe Checkout session; 501 capability_not_configured if Stripe isn\'t set up.' },
    { method: 'GET', path: '/v1/audit', status: 'live', desc: 'Paginated log of your own application/key mutations.' },
    { method: 'GET', path: '/health, /health/live, /health/ready', status: 'live', desc: 'Liveness/readiness checks, including Mongo/Redis reachability.' },
  ];
}
