import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MonolithCanvasComponent } from './monolith-canvas.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MonolithCanvasComponent],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <!-- 3D Monolith Background -->
        <app-monolith-canvas class="hero-canvas-bg"></app-monolith-canvas>
        <!-- Gradient overlay for readability -->
        <div class="hero-readability-overlay"></div>
        <!-- Content -->
        <div class="container grid-12 items-center hero-content-wrapper">
          <div class="hero-content">
            <div class="eyebrow">DEVELOPER-FIRST INTELLIGENCE</div>
            <h1 class="hero-title italic">
              Architecting the Future of AI.
            </h1>
            <p class="lede mb-12">
              The most reliable way to integrate agentic intelligence into your production environment. Scalable, secure, and developer-first.
            </p>
            <div class="hero-actions">
              <a routerLink="/signup" class="btn btn-primary btn-lg shadow-glow">Schedule a Consultation</a>
              <a routerLink="/docs" class="btn btn-ghost btn-lg hero-ghost">View Documentation</a>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="code-window card vibrant-border">
              <div class="code-window-header">
                <div class="window-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
              </div>
              <div class="code-body">
                <pre><code><span class="token-keyword">import</span> {{ '{' }} AccessosAgent {{ '}' }} <span class="token-keyword">from</span> <span class="token-string">'@accessos/core'</span>;

<span class="token-keyword">const</span> agent = <span class="token-keyword">new</span> AccessosAgent({{ '{' }}
  identity: <span class="token-string">'enterprise-architect'</span>,
  capabilities: [<span class="token-string">'workflow_automation'</span>, <span class="token-string">'data_synthesis'</span>],
  security: <span class="token-string">'hardened'</span>
{{ '}' }});

<span class="token-keyword">await</span> agent.initiateWorkflow(<span class="token-string">'optimize-pipeline'</span>);</code></pre>
              </div>
              <div class="code-window-footer">
                <span class="preview-badge">Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Social Proof -->
      <section class="social-proof">
        <div class="container text-center">
          <div class="badge-pill mx-auto mb-6">
            <span class="pulse-dot"></span>
            <span>Ecosystem Partners</span>
          </div>
          <h2 class="hero-title italic mb-4" style="font-size: 32px;">Trusted by modern engineering teams worldwide.</h2>
          <p class="lede text-center mx-auto opacity-60">Powering cognitive accessibility and multi-modal AI pipelines for enterprise scale.</p>
          <div class="feature-grid mt-12 text-left">
            <div class="feature-bullet card border-line">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-symbols-outlined text-accent">api</span>
                <h4 class="m-0 font-semibold text-white text-sm">Multi-Modal Orchestration</h4>
              </div>
              <p class="muted text-sm m-0">Run OCR, computer vision, and text simplification through a single robust endpoint.</p>
            </div>
            
            <div class="feature-bullet card border-line">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-symbols-outlined text-accent">bolt</span>
                <h4 class="m-0 font-semibold text-white text-sm">Edge Latency</h4>
              </div>
              <p class="muted text-sm m-0">Lightning-fast inference architectures optimized for real-time global availability.</p>
            </div>
            
            <div class="feature-bullet card border-line">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-symbols-outlined text-accent">shield_lock</span>
                <h4 class="m-0 font-semibold text-white text-sm">Zero-Retention Security</h4>
              </div>
              <p class="muted text-sm m-0">Strict enterprise compliance ensuring payload data is never logged or stored.</p>
            </div>

            <div class="feature-bullet card border-line">
              <div class="flex items-center gap-3 mb-3">
                <span class="material-symbols-outlined text-accent">psychology</span>
                <h4 class="m-0 font-semibold text-white text-sm">Cognitive Translation</h4>
              </div>
              <p class="muted text-sm m-0">Instant natural language downgrading tailored for users with cognitive disabilities.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Operational Metrics -->
      <section class="section metrics-section">
        <div class="container grid-3">
          <div class="metric-card card vibrant-border text-center">
            <p class="eyebrow muted-eyebrow">SYSTEM OPERATIONAL</p>
            <p class="metric-value">99.8%</p>
          </div>
          <div class="metric-card card vibrant-border text-center">
            <p class="eyebrow muted-eyebrow">PROCESSING LATENCY</p>
            <p class="metric-value">12ms</p>
          </div>
          <div class="metric-card card vibrant-border text-center">
            <p class="eyebrow muted-eyebrow">SUCCESS RATE</p>
            <p class="metric-value">99.99%</p>
          </div>
        </div>
      </section>

      <!-- Premium Intelligence Header -->
      <section class="section-sm bg-deep border-t border-b text-center">
        <div class="container">
          <h2 class="hero-title italic mb-6 mx-auto">Premium Intelligence, Delivered.</h2>
          <p class="lede mx-auto opacity-80">Engineered for teams that demand zero compromise on speed, reliability, and security.</p>
        </div>
      </section>

      <!-- Architectural Excellence (Bento Grid) -->
      <section class="section bg-deep">
        <div class="container">
          <div class="section-head">
            <h2>Architectural Excellence</h2>
            <p class="lede opacity-80">We don't just build features; we design intelligent systems that evolve with your business needs.</p>
          </div>
          <div class="bento-grid">
            <div class="bento-card card card-hover vibrant-border" style="grid-column: span 7;">
              <div class="icon-wrap"><span class="material-symbols-outlined">smart_toy</span></div>
              <h3>Custom AI Agents</h3>
              <p class="opacity-80">Autonomous agents that handle complex, multi-step business logic with unparalleled precision and context-awareness.</p>
              <div class="bento-graphic mt-auto">
                <div class="graphic-line w-100"></div>
                <div class="graphic-line w-75"></div>
                <div class="graphic-line w-50"></div>
              </div>
            </div>
            
            <div class="bento-card card card-hover vibrant-border" style="grid-column: span 5;">
              <div class="icon-wrap"><span class="material-symbols-outlined">hub</span></div>
              <h3>Workflow Automation</h3>
              <p class="opacity-80">Bridge the gap between legacy tools and modern AI intelligence through robust API orchestration.</p>
              <a href="#" class="bento-link mt-auto">LEARN MORE <span class="material-symbols-outlined">arrow_forward</span></a>
            </div>
            
            <div class="bento-card card card-hover vibrant-border" style="grid-column: span 4;">
              <div class="icon-wrap"><span class="material-symbols-outlined">architecture</span></div>
              <h3>Strategy Consulting</h3>
              <p class="opacity-80">Navigate the AI landscape with confidence. We provide technical roadmaps that prioritize long-term ROI.</p>
            </div>
            
            <div class="bento-card card card-hover vibrant-border row-flex" style="grid-column: span 8;">
              <div class="flex-1">
                <div class="icon-wrap"><span class="material-symbols-outlined">shield_lock</span></div>
                <h3>Hardened Security</h3>
                <p class="opacity-80">Enterprise-grade safety protocols for LLM deployment, ensuring your data never leaves the architectural perimeter.</p>
              </div>
              <div class="bento-graphic-side flex-1">
                <div class="graphic-line w-75"></div>
                <div class="graphic-line w-100"></div>
                <div class="graphic-line w-50"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Technical Proof -->
      <section class="section border-t">
        <div class="container bento-grid">
          <div class="bento-card card card-hover vibrant-border" style="grid-column: span 8;">
            <div class="icon-wrap"><span class="material-symbols-outlined">bolt</span></div>
            <h3>Ultra Low Latency</h3>
            <p class="opacity-80 mb-6">Our global inference network ensures your agents respond in sub-100ms. Distributed across 24 regions to keep your data close to your users.</p>
            <div class="map-graphic">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA33uaCY7_BUhZNuySoLbCH011A5ngH4Nf020g34UPpj_h-O2ZigAfko7YmIiHP17Oj2-dtTAFpXnHiQuxbTag3ZUxWoBNq4jO_zS9yrLFgaE71vq1ePLQ_h1N-CPMc9BZCVYuujuScBmdmO6GQwKuSecAa1dhIhTJm_zk56PySEn82Lm0juwelNQkXrykheGZ-k_mOuvFtRiJJKRlShybJUeW_I12A102gqdiThsmJswQ1yRKINOUxfRqaB-VXRZdFxMCKPa-FgVs" alt="Global server map">
            </div>
          </div>
          
          <div class="bento-card card bg-high vibrant-border" style="grid-column: span 4; justify-content: space-between;">
            <div>
              <div class="icon-wrap"><span class="material-symbols-outlined">shield</span></div>
              <h3>Enterprise Compliance</h3>
              <p class="opacity-80">SOC2 Type II, HIPAA, and GDPR compliant. Your data is encrypted at rest and in transit with your own keys.</p>
            </div>
            <div class="mt-10">
              <span class="eyebrow opacity-60" style="font-size: 10px;">Active Protection</span>
              <div class="protection-lines">
                <div class="graphic-line filled"></div>
                <div class="graphic-line filled"></div>
                <div class="graphic-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonial Section -->
      <section class="section">
        <div class="container text-center">
          <div class="max-w-4xl mx-auto">
            <span class="material-symbols-outlined quote-icon">format_quote</span>
            <blockquote class="testimonial-text italic">
              "Accessos-AI transformed our approach to automation. They didn't just give us a tool; they gave us an intelligent architecture that scales with our ambition."
            </blockquote>
            <div class="testimonial-author">
              <div class="author-line"></div>
              <p class="author-name">Eleanor Vance</p>
              <p class="eyebrow opacity-60">CTO, STRATOS GLOBAL</p>
            </div>
          </div>
        </div>
      </section>

      <!-- API Endpoints Section -->
      <section class="section bg-deep border-t">
        <div class="container">
          <div class="section-head text-center mx-auto mb-16">
            <h2 class="hero-title italic">An API endpoint for any use case</h2>
            <p class="lede mx-auto opacity-70">Do more with flexible API endpoints. Process files, run OCR, or trigger complex workflows with ease.</p>
          </div>

          <div class="grid-12 items-start">
            <div class="endpoint-sidebar">
              <div 
                *ngFor="let endpoint of endpoints" 
                class="endpoint-card card card-hover"
                [class.active]="selectedEndpoint === endpoint.id"
                (click)="selectedEndpoint = endpoint.id"
              >
                <div class="endpoint-header">
                  <div class="icon-wrap-small"><span class="material-symbols-outlined">{{ endpoint.icon }}</span></div>
                  <div>
                    <h4 class="mb-0">{{ endpoint.title }}</h4>
                    <p *ngIf="selectedEndpoint === endpoint.id" class="endpoint-desc">{{ endpoint.desc }}</p>
                  </div>
                </div>
                <span *ngIf="selectedEndpoint === endpoint.id" class="status-chip live mt-3">POST</span>
              </div>
            </div>

            <div class="endpoint-code">
              <div class="code-window card shadow-glow">
                <div class="code-window-header border-b">
                  <div class="window-dots">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                  </div>
                  <div class="code-lang-selector">
                    <span class="mono muted">TypeScript</span>
                    <span class="material-symbols-outlined muted text-sm ml-1">expand_more</span>
                  </div>
                </div>
                <div class="code-body large-code">
                  <pre><code>{{ getCurrentSnippet() }}</code></pre>
                </div>
              </div>
            </div>
          </div>
          
          <div class="endpoints-cta">
            <a routerLink="/docs" class="btn btn-ghost btn-lg"><span class="material-symbols-outlined">menu_book</span> See API Docs</a>
            <a routerLink="/signup" class="btn btn-primary btn-lg">Get API Key</a>
          </div>
        </div>
      </section>
      
      <!-- Partnership Models -->
      <section class="section bg-deep border-t">
        <div class="container">
          <div class="section-head text-center mx-auto mb-16">
            <h2 class="hero-title italic">Partnership Models</h2>
            <p class="lede mx-auto opacity-70">Choose the engagement structure that aligns with your technical scale.</p>
          </div>
          
          <div class="grid-3 items-end">
            <!-- Tier 1 -->
            <div class="card pricing-card card-hover vibrant-border">
              <h4>Strategic Review</h4>
              <p class="muted mb-6">For teams exploring AI potential.</p>
              <div class="price-wrap mb-8">
                <span class="price">$4,500</span><span class="mono muted text-xs">/consult</span>
              </div>
              <ul class="pricing-features">
                <li><span class="material-symbols-outlined">check_circle</span> Architecture Roadmap</li>
                <li><span class="material-symbols-outlined">check_circle</span> Security Audit</li>
              </ul>
              <button class="btn btn-ghost w-full border mt-auto">Book Review</button>
            </div>
            
            <!-- Tier 2 -->
            <div class="card pricing-card card-popular shadow-glow">
              <div class="popular-badge">Most Popular</div>
              <h4 class="text-white">Agency Retainer</h4>
              <p class="text-white opacity-80 mb-6">Embedded AI engineering team.</p>
              <div class="price-wrap mb-8 text-white">
                <span class="price">$12,000</span><span class="mono opacity-80 text-xs">/month</span>
              </div>
              <ul class="pricing-features text-white">
                <li><span class="material-symbols-outlined opacity-80">check_circle</span> Unlimited Agent Dev</li>
                <li><span class="material-symbols-outlined opacity-80">check_circle</span> 24/7 Managed Ops</li>
                <li><span class="material-symbols-outlined opacity-80">check_circle</span> Custom Integrations</li>
              </ul>
              <button class="btn bg-white w-full text-ink mt-auto">Get Started</button>
            </div>
            
            <!-- Tier 3 -->
            <div class="card pricing-card card-hover vibrant-border">
              <h4>Custom Forge</h4>
              <p class="muted mb-6">One-off complex builds.</p>
              <div class="price-wrap mb-8">
                <span class="price">Custom</span>
              </div>
              <ul class="pricing-features">
                <li><span class="material-symbols-outlined">check_circle</span> Custom LLM Training</li>
                <li><span class="material-symbols-outlined">check_circle</span> On-premise Deployment</li>
                <li><span class="material-symbols-outlined">check_circle</span> Dedicated Architect</li>
              </ul>
              <button class="btn btn-ghost w-full border mt-auto">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="section text-center border-t">
        <div class="container relative z-10">
          <h2 class="hero-title italic mb-6" style="font-size: 64px;">Ready to Scale?</h2>
          <p class="lede mx-auto mb-10 opacity-80">Join the new era of cognitive automation. Let's build the intelligence that drives your future.</p>
          <div class="hero-actions justify-center">
            <a routerLink="/signup" class="btn btn-primary btn-lg shadow-glow">Talk to an Architect</a>
            <a routerLink="/pricing" class="btn btn-ghost btn-lg hero-ghost">View Case Studies</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .bg-base { background: var(--bg-base); }
    .bg-deep { background: var(--bg-deep); }
    .bg-high { background: var(--bg-panel-high); }
    .border-t { border-top: 1px solid var(--line); }
    .border-b { border-bottom: 1px solid var(--line); }
    .border { border: 1px solid var(--line); }
    .section-sm { padding: 80px 0; }
    
    .text-ink { color: #111827 !important; }
    .text-white { color: #ffffff; }

    /* ── Hero with 3D Monolith Background ── */
    .hero-section {
      position: relative;
      overflow: hidden;
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 32px;
      background: var(--bg-base);
    }

    .hero-canvas-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      opacity: 0.55;
    }

    .hero-readability-overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background:
        radial-gradient(ellipse 75% 85% at 50% 50%, transparent 35%, var(--bg-base) 92%),
        linear-gradient(180deg, rgba(19,19,21,0.15) 0%, transparent 30%, transparent 70%, rgba(19,19,21,0.35) 100%);
    }

    .hero-content-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1360px;
    }

    .hero-content {
      grid-column: span 6;
      text-align: left;
    }

    .hero-visual {
      grid-column: span 6;
      display: flex;
      justify-content: flex-end;
    }

    .hero-content .hero-title {
      font-size: clamp(38px, 4.5vw, 64px);
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      text-shadow: 0 2px 30px rgba(0,0,0,0.5);
    }

    .hero-content .lede {
      font-size: clamp(16px, 1.4vw, 18px);
      text-shadow: 0 1px 16px rgba(0,0,0,0.4);
    }

    @media (max-width: 900px) {
      .hero-section { padding: 48px 20px; min-height: auto; }
      .hero-content, .hero-visual { grid-column: span 12; justify-content: center; text-align: center; }
      .hero-content { text-align: center; }
      .hero-actions { justify-content: center; }
    }

    .hero-title { font-size: clamp(38px, 4.5vw, 64px); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 24px; }
    .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; justify-content: flex-start; }
    .btn-lg { padding: 16px 32px; font-size: 15px; }
    .hero-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(8px); }

    /* Code Window */
    .code-window { padding: 0; overflow: hidden; width: 100%; border-color: rgba(255,255,255,0.1); background: #0D0D0D; }
    .code-window-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(255,255,255,0.02); }
    .code-window-footer { display: flex; justify-content: flex-end; padding: 8px 16px; border-top: 1px solid rgba(255,255,255,0.05); }
    .preview-badge { font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; background: var(--bg-panel-high); padding: 4px 8px; border-radius: 4px; color: var(--ink-soft); }
    
    .window-dots { display: flex; gap: 6px; }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .dot.red { background: #FF5F56; }
    .dot.yellow { background: #FFBD2E; }
    .dot.green { background: #27C93F; }
    .code-body { padding: 32px; }
    .large-code pre { min-height: 400px; }
    .code-body pre { background: transparent; border: none; box-shadow: none; padding: 0; font-size: 14px; }

    /* Ecosystem Features */
    .social-proof { padding: 96px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--bg-deep); }
    .badge-pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: var(--bg-panel); border: 1px solid var(--line); border-radius: 99px; font-family: var(--font-mono); font-size: 11px; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.1em; }
    .pulse-dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 12px #4ade80; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    
    .feature-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 48px; }
    @media (max-width: 900px) { .feature-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .feature-grid { grid-template-columns: 1fr; } }
    
    .feature-bullet { padding: 24px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); background: var(--bg-panel-low); }
    .feature-bullet:hover { transform: translateY(-4px); border-color: rgba(168, 85, 247, 0.4); box-shadow: var(--shadow-md); }
    .text-accent { color: var(--accent); }
    .text-left { text-align: left; }

    /* Metrics */
    .metrics-section { padding: 96px 0; }
    .metric-card { padding: 48px; border-radius: var(--radius-md); background: var(--bg-panel-low); }
    .muted-eyebrow { color: var(--accent); opacity: 0.8; letter-spacing: 0.15em; }
    .metric-value { font-family: var(--font-display); font-size: 64px; margin: 0; color: var(--ink-heading); line-height: 1; }

    /* Bento Grid */
    .bento-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; }
    @media (max-width: 900px) { .bento-card { grid-column: span 12 !important; } .row-flex { flex-direction: column; } }
    .bento-card { display: flex; flex-direction: column; padding: 40px; background: var(--bg-panel); border-color: rgba(255,255,255,0.05); }
    .row-flex { flex-direction: row; gap: 32px; }
    
    .icon-wrap { width: 48px; height: 48px; border-radius: var(--radius-md); background: var(--accent-soft); color: var(--accent); display: grid; place-items: center; margin-bottom: 32px; }
    .bento-card h3 { margin-bottom: 16px; font-size: 32px; }
    
    .bento-graphic { height: 160px; background: rgba(255,255,255,0.02); border: 1px solid var(--line); border-radius: var(--radius-md); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 16px; }
    .bento-graphic-side { background: rgba(255,255,255,0.02); border: 1px solid var(--line); border-radius: var(--radius-md); display: flex; flex-direction: column; justify-content: center; padding: 24px; gap: 12px; min-height: 160px; }
    .graphic-line { height: 4px; background: var(--accent); border-radius: 2px; }
    .graphic-line.filled { background: var(--accent); }
    .graphic-line:not(.filled) { background: rgba(255,255,255,0.1); }
    .w-100 { width: 100%; } .w-75 { width: 75%; } .w-50 { width: 50%; }
    .bento-link { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.1em; color: var(--accent); text-transform: uppercase; display: flex; align-items: center; gap: 8px; }

    .map-graphic { height: 250px; border-radius: var(--radius-md); border: 1px solid var(--line); overflow: hidden; position: relative; }
    .map-graphic img { width: 100%; height: 100%; object-fit: cover; opacity: 0.2; mix-blend-mode: screen; filter: grayscale(1); }
    .protection-lines { display: flex; gap: 4px; margin-top: 16px; }
    .protection-lines .graphic-line { flex: 1; }

    /* Testimonial */
    .quote-icon { font-size: 80px; color: var(--accent-soft); margin-bottom: 48px; }
    .testimonial-text { font-size: 48px; line-height: 1.2; font-family: var(--font-display); margin-bottom: 48px; }
    .author-line { width: 48px; height: 2px; background: var(--vibrant-gradient); margin: 0 auto 24px; }
    .author-name { font-size: 24px; font-weight: 500; color: var(--ink-heading); margin-bottom: 4px; }

    /* Endpoints */
    .endpoint-sidebar { grid-column: span 5; display: flex; flex-direction: column; gap: 16px; }
    .endpoint-code { grid-column: span 7; }
    @media (max-width: 900px) { .endpoint-sidebar, .endpoint-code { grid-column: span 12; } }
    .endpoint-card { padding: 24px; cursor: pointer; transition: all 0.3s; display: flex; justify-content: space-between; align-items: center; border-color: rgba(255,255,255,0.1); }
    .endpoint-card:hover:not(.active) { background: rgba(255,255,255,0.03); }
    .endpoint-card.active { border-color: var(--accent); background: var(--accent-soft); }
    .endpoint-header { display: flex; align-items: flex-start; gap: 16px; }
    .icon-wrap-small { width: 40px; height: 40px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.05); color: var(--ink-soft); display: grid; place-items: center; }
    .endpoint-card:hover .icon-wrap-small, .endpoint-card.active .icon-wrap-small { color: var(--accent); }
    .endpoint-desc { font-size: 14px; margin-top: 4px; margin-bottom: 0; opacity: 0.7; }
    .endpoints-cta { display: flex; justify-content: center; gap: 32px; margin-top: 64px; }

    /* Pricing */
    .pricing-card { display: flex; flex-direction: column; padding: 40px; }
    .card-popular { background: var(--vibrant-gradient); transform: scale(1.05); position: relative; z-index: 10; border: none; }
    .popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #ffffff; color: var(--accent); font-family: var(--font-mono); font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; padding: 6px 16px; border-radius: 999px; font-weight: 600; }
    .price { font-size: 36px; font-weight: 500; }
    .pricing-features { list-style: none; padding: 0; margin-bottom: 48px; display: flex; flex-direction: column; gap: 20px; }
    .pricing-features li { display: flex; align-items: center; gap: 12px; font-size: 14px; opacity: 0.9; }
    .pricing-features .material-symbols-outlined { color: var(--accent); opacity: 0.6; font-size: 18px; }
    .card-popular .pricing-features .material-symbols-outlined { color: #ffffff; }
  `]
})
export class HomeComponent {
  selectedEndpoint = 'ocr';

  endpoints = [
    {
      id: 'ocr',
      title: 'Extract Text (OCR)',
      icon: 'document_scanner',
      desc: 'High-accuracy text extraction from documents or images.'
    },
    {
      id: 'vision',
      title: 'Analyze Scene',
      icon: 'visibility',
      desc: 'Generates rich, contextual image descriptions and accessibility alt-text.'
    },
    {
      id: 'simplify',
      title: 'Simplify Text',
      icon: 'sort_by_alpha',
      desc: 'Transform dense technical jargon into clear, accessible prose.'
    }
  ];

  snippets: Record<string, string> = {
    ocr: `import { AccessOS } from '@accessos/core';

const client = new AccessOS({ apiKey: 'aos_live_xxx' });

const result = await client.ocr.extract({
  fileUrl: 'https://example.com/invoice.pdf',
  options: { preserve_layout: true }
});

console.log(result.text);`,
    vision: `import { AccessOS } from '@accessos/core';

const client = new AccessOS({ apiKey: 'aos_live_xxx' });

const result = await client.vision.describe({
  imageUrl: 'https://example.com/dashboard.png',
  detail_level: 'high'
});

console.log(result.alt_text);`,
    simplify: `import { AccessOS } from '@accessos/core';

const client = new AccessOS({ apiKey: 'aos_live_xxx' });

const result = await client.text.simplify({
  text: "The asynchronous nature of the non-blocking event loop...",
  target_reading_level: "grade_8"
});

console.log(result.simplified_text);`
  };

  getCurrentSnippet(): string {
    return this.snippets[this.selectedEndpoint];
  }
}
