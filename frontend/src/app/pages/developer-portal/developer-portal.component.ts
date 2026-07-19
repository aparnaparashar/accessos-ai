import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ApiRow { name: string; desc: string; }

@Component({
  selector: 'app-developer-portal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">04–05 · Developer Portal &amp; API Catalogue</span>
        <h1>Accessibility-as-a-service, one API</h1>
        <p class="lede">Angular 20 standalone-component app at <code>apps/developer-portal</code>.
          Manage applications, generate keys, monitor usage, and pay by consumption — modeled on
          Stripe / Twilio-style developer platforms.</p>
      </div>
    </section>

    <section class="section portal-status">
      <div class="container">
        <div class="feature-row">
          <div class="feature-row-head"><h3>Authentication</h3><span class="status-chip live">LIVE</span></div>
          <p>Same JWT login flow as the End-User App, scoped to the developer role.</p>
        </div>
        <div class="feature-row">
          <div class="feature-row-head"><h3>Dashboard UI</h3><span class="status-chip built">BUILT</span></div>
          <p>Overview layout with metric cards and a recent-activity table for /v1/accessibility/assist
            calls. Currently rendered with representative sample data — wiring to the real Analytics
            Service is a Phase 5 item.</p>
        </div>
        <div class="feature-row">
          <div class="feature-row-head"><h3>API Keys UI</h3><span class="status-chip built">BUILT</span></div>
          <p>Table of sandbox/production keys with rotate/revoke actions. The underlying API Key
            Service (real generation, scopes, IP restrictions, expiration, webhook secrets) is a
            Phase 4 item — today this screen demonstrates the intended UX against sample keys.</p>
        </div>
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

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">10 · API Key System</span>
          <h2>Example application</h2>
          <p>Every developer creates an application, chooses a plan, and picks which APIs it's allowed to call.</p>
        </div>
        <div class="key-card card">
          <div class="key-row"><span>Application Name</span><strong>Hospital ERP</strong></div>
          <div class="key-row"><span>Plan</span><strong>Enterprise</strong></div>
          <div class="key-row"><span>Allowed APIs</span><strong>OCR · Accessibility Scanner · Screen Reader · Speech API</strong></div>
          <div class="key-row mono"><span>Public API Key</span><code>acc_pk_live_xxx...</code></div>
          <div class="key-row mono"><span>Secret API Key</span><code>acc_sk_live_xxx...</code></div>
          <p class="key-note">Note: this is the target design for the API Key System. The
            production-grade version is a Phase 4 item — see Roadmap.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .lede { max-width: 640px; }
    .feature-row { padding: 20px 0; border-bottom: 1px solid var(--line); }
    .feature-row-head { display: flex; align-items: center; gap: 12px; }
    .feature-row-head h3 { margin: 0; font-size: 16.5px; }
    .feature-row p { margin: 8px 0 0; max-width: 720px; }
    table { margin-top: 8px; }
    .chip-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
    .key-card { max-width: 520px; }
    .key-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px dashed var(--line); font-size: 14px; }
    .key-row span { color: var(--ink-soft); }
    .key-row.mono code { font-size: 12.5px; }
    .key-note { margin-top: 16px; font-size: 13px; color: var(--ink-soft); }
  `],
})
export class DeveloperPortalComponent {
  shippedApis: ApiRow[] = [
    { name: 'Accessibility Analysis API', desc: 'Upload a website, mobile app, or dashboard. Returns accessibility score, WCAG violations, AI recommendations, and auto-fixes.' },
    { name: 'Image Description API', desc: 'Input an image, output a detailed contextual description.' },
    { name: 'Smart OCR API', desc: 'Image → structured JSON → translated text → summarized version.' },
    { name: 'Sign Language API', desc: 'Video → speech → text → translation.' },
    { name: 'Speech API', desc: 'Speech → text → emotion → language detection → speaker identification.' },
    { name: 'Adaptive Content API', desc: 'Input a medical report; output a child version, easy-language version, Braille format, audio, or sign language.' },
    { name: 'AI Screen Reader API', desc: 'Give any UI, get back natural narration.' },
    { name: 'Accessibility Chatbot API', desc: 'Drop into any application — automatically becomes an accessibility assistant.' },
    { name: 'Accessibility Testing API', desc: 'Runs accessibility tests on every CI/CD deployment.' },
    { name: 'Accessibility Analytics API', desc: 'Shows most-inaccessible screens, heatmaps, user struggles, and drop-off points.' },
    { name: 'Indoor Navigation API', desc: 'Hospitals, airports, and universities can integrate indoor guidance.' },
    { name: 'Accessibility Recommendation API', desc: 'Given a user profile and app context, returns the best accessibility settings.' },
  ];

  futureApis = [
    'Accessibility Copilot API', 'Braille API', 'Gesture API', 'Emotion Recognition API',
    'Reading Assistant API', 'Document Simplifier API', 'AI Form Filling API',
    'Accessibility Translation API', 'Smart Subtitle API', 'AR Navigation API',
    'Accessibility Compliance API', 'Accessibility QA API',
  ];
}
