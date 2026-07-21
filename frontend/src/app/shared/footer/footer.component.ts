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
          <span class="brand-name">AccessOS <b class="gradient-text">AI</b></span>
          <p class="foot-desc">Developer-first AI API platform for accessibility intelligence, scene understanding, OCR, and text simplification.</p>
        </div>
        <div class="foot-cols">
          <div>
            <h4>Product</h4>
            <a routerLink="/features">API Suite</a>
            <a routerLink="/docs">Documentation</a>
            <a routerLink="/playground">Playground</a>
          </div>
          <div>
            <h4>Company</h4>
            <a routerLink="/about">About Us</a>
            <a routerLink="/dashboard">Developer Dashboard</a>
            <a routerLink="/signup">Get API Key</a>
          </div>
        </div>
      </div>
      <div class="container foot-bottom">
        <span>© 2026 AccessOS AI · Developer-First Accessibility API Platform</span>
      </div>
    </footer>
  `,
  styles: [`
    .foot { background: var(--bg-deep); border-top: 1px solid var(--line); padding-top: 64px; }
    .foot-inner { display: flex; justify-content: space-between; gap: 48px; flex-wrap: wrap; padding-bottom: 48px; }
    .foot-brand { max-width: 360px; }
    .brand-name { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: #fff; }
    .gradient-text {
      background: var(--vibrant-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .foot-desc { margin-top: 12px; font-size: 14px; color: var(--ink-muted); }
    .foot-cols { display: flex; gap: 64px; }
    .foot-cols h4 { font-size: 11px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em; color: var(--ink-muted); margin-bottom: 16px; }
    .foot-cols a { display: block; color: var(--ink-soft); font-size: 14px; margin-bottom: 10px; transition: color var(--duration-fast) var(--ease); }
    .foot-cols a:hover { color: #ffffff; }
    .foot-bottom { border-top: 1px solid var(--line); padding: 24px 0; font-size: 12px; color: var(--ink-muted); font-family: var(--font-mono); }
  `],
})
export class FooterComponent {}
