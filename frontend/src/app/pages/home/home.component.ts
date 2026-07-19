import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container hero-inner">
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
        <div class="section-head">
          <span class="eyebrow">Why this stands out</span>
          <h2>The old model vs. the AccessOS model</h2>
          <p>Callers never orchestrate multiple APIs themselves — a policy engine reads request
            context and decides which capabilities to invoke and how to fuse them.</p>
        </div>
        <div class="flow-compare">
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
        <div class="card">
          <span class="eyebrow">Product 1</span>
          <h3>AccessOS AI — End-User App</h3>
          <p>An AI accessibility companion for people with visual, hearing, speech, motor,
            or cognitive disabilities. Set preferences once; the AI Companion personalizes
            every response to match.</p>
          <a routerLink="/features" class="btn btn-ghost">See end-user features →</a>
        </div>
        <div class="card">
          <span class="eyebrow">Product 2</span>
          <h3>AccessOS Developer Platform</h3>
          <p>Companies integrate accessibility into their own apps through one API. Manage
            applications, generate keys, monitor usage, and pay by consumption — modeled on
            Stripe / Twilio-style developer platforms.</p>
          <a routerLink="/developer-portal" class="btn btn-ghost">See developer platform →</a>
        </div>
      </div>
    </section>

    <section class="section cta-band">
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
      padding: 120px 0 80px;
      background-image: linear-gradient(180deg, rgba(238,241,251,0.55) 0%, rgba(238,241,251,0.92) 78%, var(--bg-base) 100%), url('/assets/hero-bg.png');
      background-size: cover;
      background-position: center 20%;
      overflow: hidden;
    }
    .hero-inner { max-width: 760px; }
    .hero h1 { font-size: clamp(2.2rem, 4.4vw, 3.4rem); line-height: 1.08; }
    .lede { font-size: 17px; max-width: 640px; }
    .hero-cta { display: flex; gap: 14px; margin: 28px 0 44px; flex-wrap: wrap; }
    .hero-stats { display: flex; gap: 44px; flex-wrap: wrap; }
    .hero-stats strong { display: block; font-family: var(--font-display); font-size: 28px; color: var(--accent); }
    .hero-stats span { font-size: 12.5px; color: var(--ink-soft); font-family: var(--font-mono); }

    .flow-compare { display: flex; flex-direction: column; gap: 18px; }
    .flow { border: 1px solid var(--line); border-radius: var(--radius); padding: 22px 24px; background: var(--bg-panel); }
    .flow-label { font-family: var(--font-mono); font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); }
    .flow-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 12px; font-family: var(--font-display); font-size: 15px; }
    .flow.old .flow-row span { color: var(--ink-soft); }
    .flow.new .flow-row span { color: var(--accent); font-weight: 600; }
    .flow-row i { color: var(--line); font-style: normal; }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .grid-2 .card h3 { margin-top: 10px; }

    .cta-band { text-align: center; }
    .cta-inner { max-width: 560px; margin: 0 auto; }
    .cta-inner .btn { margin-top: 12px; }

    @media (max-width: 860px) {
      .hero { padding: 92px 0 56px; }
      .grid-2 { grid-template-columns: 1fr; }
    }
  `],
})
export class HomeComponent {}
