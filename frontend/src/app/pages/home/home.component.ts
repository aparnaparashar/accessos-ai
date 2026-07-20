import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container hero-inner fade-up">
        <span class="eyebrow">Product &amp; Technical Overview · Phase 1–3</span>
        <h1>One orchestration layer<br />for every accessibility need.</h1>
        <p class="lede">
          AccessOS AI unifies scene understanding, OCR, simplification, speech, and
          sign-language assistance behind a single endpoint — <code>POST /v1/accessibility/assist</code> —
          plus a full accessibility-as-a-service developer platform.
        </p>
        <div class="hero-cta">
          <a routerLink="/features" class="btn btn-primary">Explore the End-User App</a>
          <a routerLink="/developer-portal" class="btn btn-ghost">View Developer APIs</a>
        </div>
        <div class="hero-stats">
          <div><strong>30</strong><span>APIs referenced platform-wide</span></div>
          <div><strong>12</strong><span>developer product APIs shipped</span></div>
          <div><strong>1</strong><span>call site for every capability</span></div>
        </div>
      </div>
    </section>

    <section class="section model">
      <div class="container">
        <div class="section-head fade-up">
          <span class="eyebrow">Why this stands out</span>
          <h2>The old model vs. the AccessOS model</h2>
          <p>Callers never orchestrate multiple APIs themselves — a policy engine reads request
            context and decides which capabilities to invoke and how to fuse them.</p>
        </div>
        <div class="flow-compare fade-up">
          <div class="flow old">
            <span class="flow-label">Old model</span>
            <div class="flow-row">
              <span>Application</span><i>→</i><span>Accessibility Feature</span><i>→</i><span>Disabled User</span>
            </div>
          </div>
          <div class="flow new">
            <span class="flow-label">AccessOS model</span>
            <div class="flow-row">
              <span>Application</span><i>→</i><span>AccessOS API</span><i>→</i><span>AI Accessibility Engine</span><i>→</i><span>Adaptive Experience</span><i>→</i><span>Disabled User</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section two-products">
      <div class="container grid-2">
        <div class="card fade-up">
          <span class="eyebrow">Product 1</span>
          <h3>AccessOS AI — End-User App</h3>
          <p>An AI accessibility companion for people with visual, hearing, speech, motor,
            or cognitive disabilities. Set preferences once; the AI Companion personalizes
            every response to match.</p>
          <a routerLink="/features" class="btn btn-ghost">See end-user features →</a>
        </div>
        <div class="card fade-up">
          <span class="eyebrow">Product 2</span>
          <h3>AccessOS Developer Platform</h3>
          <p>Companies integrate accessibility into their own apps through one API. Manage
            applications, generate keys, monitor usage, and pay by consumption — modeled on
            Stripe / Twilio-style developer platforms.</p>
          <a routerLink="/developer-portal" class="btn btn-ghost">See developer platform →</a>
        </div>
      </div>
    </section>

    <section class="section cta-band fade-up">
      <div class="container cta-inner">
        <h2>Read the full technical architecture</h2>
        <p>Service map, tech stack, API reference, and rate limiting — all in one place.</p>
        <a routerLink="/architecture" class="btn btn-primary">View system architecture</a>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      padding: 100px 0 80px;
      background-image: radial-gradient(circle at top right, var(--accent-soft), transparent 50%), linear-gradient(180deg, rgba(238,241,251,0.55) 0%, rgba(238,241,251,0.92) 78%, var(--bg-base) 100%), url('/assets/hero-bg.png');
      background-size: cover;
      background-position: center 20%;
      overflow: hidden;
    }
    .hero-inner { max-width: 760px; }
    .hero h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); line-height: 1.1; }
    .hero .lede { font-size: 16px; max-width: 640px; }
    .hero-cta { display: flex; gap: 16px; margin: 32px 0 48px; flex-wrap: wrap; }
    .hero-stats { display: flex; gap: 48px; flex-wrap: wrap; }
    .hero-stats > div { border-left: 3px solid var(--accent); padding-left: 16px; }
    .hero-stats strong { display: block; font-family: var(--font-display); font-size: 28px; color: var(--accent); line-height: 1.2; margin-bottom: 4px; }
    .hero-stats span { font-size: 12px; color: var(--ink-soft); font-family: var(--font-mono); }

    .fade-up { animation: fade-up var(--duration-slow) var(--ease-out) backwards; }
    .hero-inner.fade-up { animation-delay: 0.1s; }
    .section-head.fade-up { animation-delay: 0.1s; }
    .flow-compare.fade-up { animation-delay: 0.2s; }
    .card.fade-up:nth-child(1) { animation-delay: 0.1s; }
    .card.fade-up:nth-child(2) { animation-delay: 0.2s; }

    .flow-compare { display: flex; flex-direction: column; gap: 16px; }
    .flow { border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 24px; background: var(--bg-panel); transition: box-shadow var(--duration) var(--ease); }
    .flow:hover { box-shadow: var(--shadow-sm); }
    .flow.new { border-left: 4px solid var(--accent); }
    .flow-label { font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); }
    .flow-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 12px; font-family: var(--font-display); font-size: 16px; }
    .flow.old .flow-row span { color: var(--ink-soft); }
    .flow.new .flow-row span { color: var(--accent); font-weight: 600; }
    .flow-row i { color: var(--line); font-style: normal; }

    .two-products .card { cursor: pointer; transition: all var(--duration) var(--ease); }
    .two-products .card:hover { box-shadow: var(--shadow-md); border-color: var(--accent); transform: translateY(-2px); }
    .two-products h3 { margin-top: 12px; font-size: 20px; }

    .cta-band { background: linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-base) 100%); padding: 64px 24px; border-radius: var(--radius-xl); margin-top: 24px; margin-bottom: 24px; text-align: center; }
    .cta-inner { max-width: 560px; margin: 0 auto; }
    .cta-inner .btn { margin-top: 16px; }

    @media (max-width: 860px) {
      .hero { padding: 80px 0 48px; }
    }
  `],
})
export class HomeComponent {}
