import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="foot">
      <div class="container foot-inner">
        <div class="foot-brand">
          <span class="brand-name">AccessOS <b>AI</b></span>
          <p>One orchestration layer for scene understanding, OCR, simplification,
            speech, sign language, and accessibility-as-a-service.</p>
        </div>
        <div class="foot-cols">
          <div>
            <h4>Product</h4>
            <a routerLink="/features">End-User App</a>
            <a routerLink="/developer-portal">Developer Portal</a>
            <a routerLink="/pricing">Pricing</a>
          </div>
          <div>
            <h4>Platform</h4>
            <a routerLink="/architecture">System Architecture</a>
            <a routerLink="/roadmap">Roadmap</a>
          </div>
        </div>
      </div>
      <div class="container foot-bottom">
        <span>© 2026 AccessOS AI · Product &amp; Technical Overview, Phase 1–3</span>
      </div>
    </footer>
  `,
  styles: [`
    .foot { border-top: 1px solid var(--line); background: var(--bg-panel); padding-top: 56px; }
    .foot-inner { display: flex; justify-content: space-between; gap: 48px; flex-wrap: wrap; padding-bottom: 40px; }
    .foot-brand { max-width: 340px; }
    .brand-name { font-family: var(--font-display); font-size: 17px; }
    .brand-name b { color: var(--accent); }
    .foot-cols { display: flex; gap: 64px; }
    .foot-cols h4 { font-size: 13px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); margin-bottom: 14px; }
    .foot-cols a { display: block; color: var(--ink-soft); font-size: 14.5px; margin-bottom: 10px; }
    .foot-cols a:hover { color: var(--accent); }
    .foot-bottom { border-top: 1px solid var(--line); padding: 20px 28px; font-size: 12.5px; color: var(--ink-soft); font-family: var(--font-mono); }
  `],
})
export class FooterComponent {}
