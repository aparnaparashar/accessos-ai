import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Phase { name: string; items: string[]; }

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">13 · Roadmap</span>
        <h1>What's next</h1>
        <p class="lede">This reflects the codebase as of Phase 1–3 plus target system design for
          later phases — regenerated after each phase lands so it never drifts from what's
          actually running.</p>
      </div>
    </section>

    <section class="section">
      <div class="container timeline">
        <div class="phase" *ngFor="let p of phases; let i = index">
          <div class="phase-marker">
            <span class="phase-num">{{ i + 1 }}</span>
            <span class="phase-line" *ngIf="i < phases.length - 1"></span>
          </div>
          <div class="phase-body">
            <h3>{{ p.name }}</h3>
            <ul>
              <li *ngFor="let item of p.items">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .timeline { display: flex; flex-direction: column; }
    .phase { display: flex; gap: 24px; padding: 12px; border-radius: var(--radius-lg); transition: background var(--duration) var(--ease); }
    .phase:hover { background: var(--bg-panel); }
    .phase-marker { display: flex; flex-direction: column; align-items: center; }
    .phase-num {
      width: 36px; height: 36px; border-radius: var(--radius-full);
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%); color: var(--bg-base);
      display: grid; place-items: center; font-family: var(--font-mono); font-size: 14px; font-weight: 600;
      flex-shrink: 0; box-shadow: var(--shadow-sm);
    }
    .phase-line { flex: 1; width: 2px; background: linear-gradient(180deg, var(--accent) 0%, var(--line) 100%); margin: 8px 0; min-height: 40px; }
    .phase-body { padding-bottom: 48px; padding-top: 4px; flex: 1; }
    .phase-body h3 { margin-bottom: 16px; font-size: 20px; }
    .phase-body ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
    .phase-body li { font-size: 14px; color: var(--ink-soft); padding-left: 20px; position: relative; }
    .phase-body li::before { content: '→'; position: absolute; left: 0; color: var(--accent); font-weight: 600; }
  `],
})
export class RoadmapComponent {
  phases: Phase[] = [
    {
      name: 'Shipped — End-User App, Developer Platform, Production Polish',
      items: [
        'AI Companion (image/text input, emergency flag) wired to the real /v1/accessibility/assist endpoint',
        'Accessibility Settings, persisted locally and actually changing Orchestrator behavior',
        'Developer Portal: real applications CRUD, key generate/rotate/revoke with one-time secret reveal',
        'Real analytics (Mongo aggregation), billing/usage estimates, fail-closed Stripe checkout, paginated audit log',
        'CORS fixed (preflight + Access-Control-Allow-Origin on every /api/* response)',
        'Toast notifications, per-route SEO (title/meta/Open Graph), real 404 page, favicon/robots.txt/sitemap.xml',
      ],
    },
    {
      name: 'Phase 4 — API Platform hardening',
      items: [
        'Wire the existing HMAC-signature + nonce-replay helpers (lib/keys.ts, lib/redis.ts) into an actual signed-request route',
        'Per-key IP allowlists and scopes enforced at request time (schema fields exist; not yet checked on every call)',
        'Client SDKs documenting the request pattern',
        'Object storage (MinIO) so TTS/audio responses get real CDN URLs instead of always-null audio_url',
      ],
    },
    {
      name: 'Phase 5 — Testing, Monitoring, Deployment',
      items: [
        'Backend integration tests (signup/login/refresh, assist with/without a provider, API-key auth, rate limits, Developer Platform CRUD + ownership checks)',
        'Frontend unit tests for auth/dev/settings services and the Companion/Settings components',
        'Docker Compose (mongo, redis, backend, frontend) and a Dockerfile per service',
        'CI/CD pipeline running lint, build, and the tests above',
      ],
    },
    {
      name: 'Ongoing / research-flavored',
      items: [
        'Replace the rule-based sign-language gloss approximation with a trained model',
        'Real indoor navigation (needs sensor/beacon input the API doesn\u2019t currently receive)',
        'Learned/ML-assisted policy-engine routing (current version is rule-based, intentionally, for explainability and zero added model-call latency)',
      ],
    },
  ];
}
