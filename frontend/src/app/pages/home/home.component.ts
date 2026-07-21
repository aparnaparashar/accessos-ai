import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-inner">
          <div class="hero-text">
            <div class="eyebrow">
              <span class="status-chip built">ANNOUNCING VERSION 2.0</span>
              DEVELOPER-FIRST INTELLIGENCE
            </div>
            <h1 class="hero-title">Architecting the Future of AI Accessibility.</h1>
            <p class="hero-desc">
              The most reliable, high-throughput API for integrating vision, OCR, text simplification, and real-time accessibility intelligence into production apps.
            </p>
            <div class="hero-actions">
              <a routerLink="/signup" class="btn btn-primary btn-lg">Get API Key</a>
              <a routerLink="/docs" class="btn btn-ghost btn-lg">Documentation</a>
            </div>
          </div>

          <!-- Code Window -->
          <div class="hero-code-window card">
            <div class="code-window-header">
              <div class="window-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <div class="code-lang-selector">
                <button
                  *ngFor="let lang of codeLangs"
                  [class.active]="selectedLang === lang"
                  (click)="selectedLang = lang"
                >
                  {{ lang }}
                </button>
              </div>
            </div>
            <div class="code-body">
              <pre><code>{{ heroCode[selectedLang] }}</code></pre>
            </div>
            <div class="code-footer">
              <span class="mono muted">Latency: 38ms</span>
              <button class="copy-btn" (click)="copyCode()">{{ copied ? 'Copied!' : 'Copy Code' }}</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Grid -->
      <section class="trust-section">
        <div class="container">
          <p class="trust-label">TRUSTED BY HIGH-GROWTH ENGINEERING TEAMS</p>
          <div class="trust-logos">
            <span class="trust-brand">NEXUS AI</span>
            <span class="trust-brand">SYNAPSE</span>
            <span class="trust-brand">DEVFLOW</span>
            <span class="trust-brand">AETHER DATA</span>
            <span class="trust-brand">OMNI VISION</span>
          </div>
        </div>
      </section>

      <!-- API Showcase -->
      <section class="showcase-section section">
        <div class="container">
          <div class="section-head">
            <div class="eyebrow">HIGH-PERFORMANCE APIs</div>
            <h2>Built for Scale, Precision & Developer Experience</h2>
            <p class="lede">Unified endpoints designed for enterprise applications, edge apps, and high-concurrency environments.</p>
          </div>

          <div class="grid-3">
            <div class="card feature-card">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 12h10M7 17h6"/></svg>
              </div>
              <h3>Optical Character Recognition</h3>
              <p>High-accuracy text extraction with position bounding boxes and document hierarchy parsing.</p>
              <a routerLink="/features" class="card-link">Explore OCR API →</a>
            </div>

            <div class="card feature-card">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </div>
              <h3>Vision & Scene Description</h3>
              <p>Generates rich, contextual image descriptions and accessibility alt-text optimized for screen readers.</p>
              <a routerLink="/features" class="card-link">Explore Vision API →</a>
            </div>

            <div class="card feature-card">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
              </div>
              <h3>Text Simplification</h3>
              <p>Transform dense technical jargon into clear, accessible prose adjusted for cognitive reading levels.</p>
              <a routerLink="/features" class="card-link">Explore Simplify API →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="cta-section">
        <div class="container text-center">
          <div class="card cta-card vibrant-border">
            <h2>Start Building in Minutes</h2>
            <p class="max-w-lg mx-auto mb-6">Create a free developer account, generate your API keys, and test payloads in our playground.</p>
            <div class="cta-buttons">
              <a routerLink="/signup" class="btn btn-primary">Create Developer Account</a>
              <a routerLink="/playground" class="btn btn-ghost">Open Playground</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero-section {
      padding: 96px 0 64px;
      border-bottom: 1px solid var(--line);
      background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 60%);
    }
    .hero-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      align-items: center;
    }
    .hero-title {
      font-size: 56px;
      font-weight: 500;
      line-height: 1.08;
      letter-spacing: -0.03em;
      margin: 16px 0 24px;
    }
    .hero-desc {
      font-size: 18px;
      line-height: 1.6;
      color: var(--ink-soft);
      margin-bottom: 32px;
      max-width: 540px;
    }
    .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
    .btn-lg { padding: 14px 28px; font-size: 15px; }

    /* Code Window */
    .hero-code-window {
      background: var(--bg-deep);
      border: 1px solid var(--line-strong);
      box-shadow: var(--shadow-lg);
      padding: 0;
      overflow: hidden;
    }
    .code-window-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--line);
    }
    .window-dots { display: flex; gap: 6px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot.red { background: #ff5f56; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #27c93f; }

    .code-lang-selector { display: flex; gap: 4px; }
    .code-lang-selector button {
      background: transparent;
      border: none;
      color: var(--ink-muted);
      font-family: var(--font-mono);
      font-size: 12px;
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .code-lang-selector button.active {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }

    .code-body { padding: 20px; max-height: 280px; overflow-y: auto; }
    .code-body pre { margin: 0; padding: 0; background: transparent; border: none; font-size: 13px; }
    .code-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px;
      border-top: 1px solid var(--line);
      background: rgba(0, 0, 0, 0.2);
    }
    .copy-btn {
      background: transparent;
      border: 1px solid var(--line);
      color: var(--ink);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      font-size: 12px;
      cursor: pointer;
    }

    /* Trust Section */
    .trust-section {
      padding: 32px 0;
      border-bottom: 1px solid var(--line);
      text-align: center;
      background: var(--bg-deep);
    }
    .trust-label {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.15em;
      color: var(--ink-muted);
      margin-bottom: 20px;
    }
    .trust-logos {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }
    .trust-brand {
      font-family: var(--font-mono);
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.12em;
      color: rgba(255, 255, 255, 0.4);
    }

    /* Feature Cards */
    .feature-card { display: flex; flex-direction: column; height: 100%; }
    .card-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--accent-soft);
      color: var(--accent);
      display: grid;
      place-items: center;
      margin-bottom: 16px;
    }
    .card-link {
      margin-top: auto;
      padding-top: 16px;
      font-size: 14px;
      font-weight: 500;
      color: var(--accent);
    }

    .cta-section { padding: 64px 0 96px; }
    .cta-card { padding: 48px; }
    .cta-buttons { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }

    @media (max-width: 900px) {
      .hero-inner { grid-template-columns: 1fr; }
      .hero-title { font-size: 38px; }
    }
  `],
})
export class HomeComponent {
  selectedLang = 'Node.js';
  copied = false;

  codeLangs = ['Node.js', 'Python', 'cURL'];

  heroCode: Record<string, string> = {
    'Node.js': `import { AccessOS } from '@accessos/core';

const client = new AccessOS({ apiKey: 'aos_live_8f3a1b...' });

const result = await client.assist.process({
  input_text: "Analyze scene and summarize accessibility requirements",
  preferences: { reading_level: "simplified" }
});

console.log(result.primary_output.text);`,
    Python: `import accessos

client = accessos.Client(api_key="aos_live_8f3a1b...")

response = client.assist.create(
    input_text="Analyze scene and summarize accessibility requirements",
    preferences={"reading_level": "simplified"}
)

print(response.primary_output.text)`,
    cURL: `curl -X POST https://api.accessos.ai/v1/accessibility/assist \\
  -H "Authorization: Bearer aos_live_8f3a1b..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "input_text": "Analyze scene and summarize accessibility requirements",
    "preferences": { "reading_level": "simplified" }
  }'`,
  };

  copyCode() {
    navigator.clipboard.writeText(this.heroCode[this.selectedLang]);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }
}
