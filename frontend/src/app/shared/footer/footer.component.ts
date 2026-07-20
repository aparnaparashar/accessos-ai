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
          <div class="brand-header">
            <img src="/assets/logo_accessos-ai.png" alt="AccessOS AI Logo" class="brand-logo" />
            <span class="brand-name">AccessOS <b>AI</b></span>
          </div>
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
    .foot { background: var(--bg-panel); padding-top: 64px; }
    .foot-inner { display: flex; justify-content: space-between; gap: 48px; flex-wrap: wrap; padding-bottom: 48px; }
    .foot-brand { max-width: 340px; }
    .brand-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
    .brand-logo { width: 32px; height: 32px; border-radius: var(--radius-sm); object-fit: contain; }
    .brand-name { font-family: var(--font-display); font-size: 18px; }
    .brand-name b { color: var(--accent); }
    .foot-cols { display: flex; gap: 64px; }
    .foot-cols h4 { font-size: 11px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); margin-bottom: 16px; }
    .foot-cols a { display: block; color: var(--ink-soft); font-size: 14px; margin-bottom: 8px; transition: color var(--duration) var(--ease); }
    .foot-cols a:hover { color: var(--accent); }
    .foot-bottom { background: var(--bg-base); padding: 20px 0; font-size: 12px; color: var(--ink-soft); font-family: var(--font-mono); }
  `],
})
export class FooterComponent {}
