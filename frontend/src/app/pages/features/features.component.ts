import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  title: string;
  status: 'live' | 'built' | 'planned';
  desc: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">02 · End-User App — Features</span>
        <h1>Angular 20 standalone-component app</h1>
        <p class="lede">Everything below describes <code>apps/end-user-app</code> — status tags show what's
          actually running versus scoped-but-not-yet-built.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="feature-list">
          <div class="feature-row" *ngFor="let f of appFeatures">
            <div class="feature-row-head">
              <h3>{{ f.title }}</h3>
              <span class="status-chip" [class]="f.status">{{ f.status.toUpperCase() }}</span>
            </div>
            <p>{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section deep-dive" id="vision">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">03 · Feature Deep Dive</span>
          <h2>What each capability feels like</h2>
          <p>The target experience the End-User App is built toward — see the status tags above for
            what ships today.</p>
        </div>
        <div class="dive-grid">
          <div class="card" id="vision">
            <h4>Live Scene Understanding</h4>
            <p>Uses camera, microphone, GPS, computer vision, and LLMs to explain surroundings —
              e.g. "You're entering Terminal 3. Security queue has approximately 12 people. Gate 18
              is on your right."</p>
          </div>
          <div class="card">
            <h4>Smart OCR</h4>
            <p>Reads medicine labels, restaurant menus, currency, books, forms, handwriting,
              whiteboards, graphs, charts, and receipts.</p>
          </div>
          <div class="card" id="hearing">
            <h4>Live Sign Language</h4>
            <p>Camera detects Indian, American, or British Sign Language and converts it into
              speech or text across multiple languages, with reverse translation supported.</p>
          </div>
          <div class="card">
            <h4>Universal Screen Reader</h4>
            <p>Understands purpose, context, and relationships instead of reading buttons one by
              one — "This page allows you to book a train ticket" instead of "Button. Button. Image."</p>
          </div>
          <div class="card">
            <h4>AI Learning Assistant</h4>
            <p>Simplifies textbooks, creates notes, converts content to audio, generates quizzes,
              explains diagrams, and adapts to cognitive disabilities.</p>
          </div>
          <div class="card" id="navigation">
            <h4>Indoor Navigation</h4>
            <p>Works inside hospitals, universities, airports, metro stations, and shopping malls
              without GPS, using BLE, WiFi, computer vision, and AR.</p>
          </div>
          <div class="card" id="motor">
            <h4>Voice-Controlled Everything</h4>
            <p>Open apps, book tickets, fill forms, read notifications, and reply to messages —
              all by voice.</p>
          </div>
          <div class="card">
            <h4>Emergency AI</h4>
            <p>Detects falls, crashes, and medical emergencies. Automatically calls emergency
              contacts and shares live location.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .feature-list { display: flex; flex-direction: column; }
    .feature-row { padding: 24px 16px; border-bottom: 1px solid var(--line); border-left: 3px solid transparent; transition: all var(--duration) var(--ease); }
    .feature-row:hover { border-left-color: var(--accent); padding-left: 24px; background: var(--bg-panel); }
    .feature-row-head { display: flex; align-items: center; gap: 12px; }
    .feature-row-head h3 { margin: 0; font-size: 16px; }
    .feature-row p { margin-top: 8px; margin-bottom: 0; max-width: 720px; font-size: 14px; }
    
    .deep-dive { background: var(--bg-panel); box-shadow: inset 0 4px 6px -4px var(--shadow-xs); border-top: 1px solid var(--line); }
    .dive-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .dive-grid .card { transition: all var(--duration) var(--ease); }
    .dive-grid .card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .dive-grid .card h4 { font-size: 16px; margin-bottom: 8px; }
    .dive-grid .card p { font-size: 13px; margin: 0; }
    
    @media (max-width: 980px) { .dive-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 620px) { .dive-grid { grid-template-columns: 1fr; } }
  `],
})
export class FeaturesComponent {
  appFeatures: Feature[] = [
    { title: 'Authentication', status: 'live', desc: 'Email/password login against the Auth Service via the gateway. JWT access + refresh tokens stored client-side; every request auto-attaches the bearer token via an HTTP interceptor. Routes are gated behind an auth guard.' },
    { title: 'AI Companion', status: 'live', desc: 'Attach a photo and/or type text, optionally flag the request as an emergency, and submit to the single /v1/accessibility/assist endpoint. Displays the fused response, plays synthesized audio, and surfaces exactly which backend services were invoked plus latency.' },
    { title: 'Accessibility Preferences (Settings)', status: 'live', desc: 'Primary disability/support need, reading level, and audio-response preference — persisted locally and sent with every Companion request, actually changing backend behavior.' },
    { title: 'Standalone Scene Understanding screen', status: 'planned', desc: 'Live camera streaming (currently photo upload only).' },
    { title: 'Dedicated Screen Reader mode', status: 'planned', desc: 'A standalone mode for the Universal Screen Reader capability.' },
    { title: 'Adaptive Learning Assistant', status: 'planned', desc: 'A dedicated UI for the AI Learning Assistant capability.' },
    { title: 'Indoor Navigation UI', status: 'planned', desc: 'Backend navigation logic is currently heuristic — no sensor/beacon input yet.' },
    { title: 'Full Emergency Mode UI', status: 'planned', desc: 'Currently a single urgency flag, not a dedicated flow.' },
    { title: 'Onboarding & theme toggle', status: 'planned', desc: 'Onboarding flow and dark/light theme toggle.' },
  ];
}
