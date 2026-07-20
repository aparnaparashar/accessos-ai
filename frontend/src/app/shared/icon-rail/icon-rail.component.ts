import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Signature element: a vertical "senses rail" echoing the four disability
 * icons (hearing / vision / motor / mobility) from the platform's own
 * brand art. It's a real structural device, not decoration — each icon
 * maps to an actual capability cluster documented in Section 03, and
 * clicking one deep-links to that part of the Features page.
 */
@Component({
  selector: 'app-icon-rail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="rail" aria-label="Accessibility capability categories">
      <a routerLink="/features" fragment="hearing" class="rail-item" title="Hearing &amp; Sign Language">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 5a5 5 0 0 1 5 5c0 3-2 3.5-2 6a2.5 2.5 0 0 1-5 0"/><path d="M12 10a2 2 0 1 1 4 0c0 1.2-1 1.5-1 3"/></svg>
      </a>
      <a routerLink="/features" fragment="vision" class="rail-item" title="Vision &amp; Scene Understanding">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.6"/></svg>
      </a>
      <a routerLink="/features" fragment="motor" class="rail-item" title="Motor &amp; Voice Control">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 12V4.5a1.5 1.5 0 0 1 3 0V11"/><path d="M12 11V3.5a1.5 1.5 0 0 1 3 0V11"/><path d="M15 11.5V6a1.5 1.5 0 0 1 3 0v8c0 4-2.5 7-6.5 7-3 0-4.5-1.3-6-3.3L3.6 14a1.4 1.4 0 0 1 2-2L8 14"/></svg>
      </a>
      <a routerLink="/features" fragment="navigation" class="rail-item" title="Navigation &amp; Mobility">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="5" r="1.6"/><path d="M9 8l-1.5 5L4 15l1 2 3.5-2 1-3 2 2 .5 4h2l-.7-5-2-2 .7-3 2 1.5 1 2h2"/></svg>
      </a>
    </aside>
  `,
  styles: [`
    .rail {
      position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
      z-index: 30;
      display: flex; flex-direction: column; gap: 8px;
      background: var(--bg-overlay);
      backdrop-filter: blur(14px);
      border: 1px solid var(--line);
      border-radius: var(--radius-full);
      padding: 8px;
      box-shadow: var(--shadow-md);
    }
    .rail-item {
      width: 36px; height: 36px; border-radius: var(--radius-full);
      display: grid; place-items: center;
      color: var(--ink-soft);
      transition: background var(--duration) var(--ease), color var(--duration) var(--ease), transform var(--duration) var(--ease);
    }
    .rail-item svg { width: 18px; height: 18px; }
    .rail-item:hover { background: var(--accent-soft); color: var(--accent); transform: scale(1.08); }
    @media (max-width: 900px) { .rail { display: none; } }
  `],
})
export class IconRailComponent {}
