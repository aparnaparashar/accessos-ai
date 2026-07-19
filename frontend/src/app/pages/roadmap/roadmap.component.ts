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
    .lede { max-width: 620px; }
    .timeline { display: flex; flex-direction: column; }
    .phase { display: flex; gap: 24px; }
    .phase-marker { display: flex; flex-direction: column; align-items: center; }
    .phase-num {
      width: 34px; height: 34px; border-radius: 50%; background: var(--accent); color: #fff;
      display: grid; place-items: center; font-family: var(--font-mono); font-size: 13px; font-weight: 600;
      flex-shrink: 0;
    }
    .phase-line { flex: 1; width: 2px; background: var(--line); margin: 6px 0; }
    .phase-body { padding-bottom: 40px; }
    .phase-body h3 { margin-bottom: 12px; }
    .phase-body ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
    .phase-body li { font-size: 14.5px; color: var(--ink-soft); padding-left: 18px; position: relative; }
    .phase-body li::before { content: '→'; position: absolute; left: 0; color: var(--accent); }
  `],
})
export class RoadmapComponent {
  phases: Phase[] = [
    {
      name: 'Phase 4 — API Platform, SDKs, Billing',
      items: [
        'Real API Key Service (generation, scopes, rotation, revocation, IP restriction)',
        'Request signing (timestamp + signature + nonce) to prevent replay attacks',
        'Stripe-backed billing and invoicing',
        'Client SDKs',
        'Object storage (MinIO) so TTS/audio responses get real CDN URLs instead of inline data URIs',
      ],
    },
    {
      name: 'Phase 5 — Analytics, Monitoring, Deployment',
      items: [
        'Real usage analytics (latency, success rate, top APIs, revenue) replacing sample dashboard data',
        'Centralized logging & audit trail service',
        'Kubernetes manifests for production deployment',
        'CI/CD pipeline',
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
