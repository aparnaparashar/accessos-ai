import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="about-page container py-16">
      <!-- Hero -->
      <div class="section-head text-center mx-auto mb-16">
        <div class="eyebrow">OUR MISSION</div>
        <h1>Powering Universal Digital Accessibility</h1>
        <p class="lede mx-auto">
          AccessOS AI is building the intelligent developer infrastructure that makes every digital application instantly accessible to everyone.
        </p>
      </div>

      <!-- Grid Highlights -->
      <div class="grid-3 mb-16">
        <div class="card">
          <div class="eyebrow mb-2">VISION</div>
          <h3>Developer-First Plumbing</h3>
          <p>We treat accessibility not as an afterthought checklist, but as high-performance API infrastructure that integrates seamlessly into modern engineering pipelines.</p>
        </div>
        <div class="card">
          <div class="eyebrow mb-2">SPEED & SCALING</div>
          <h3>Edge Orchestration</h3>
          <p>Sub-100ms processing times with intelligent model routing, OCR extraction, scene description, and real-time text simplification.</p>
        </div>
        <div class="card">
          <div class="eyebrow mb-2">PRIVACY</div>
          <h3>Zero-Knowledge Compliance</h3>
          <p>Built from the ground up for strict enterprise data privacy, supporting zero-retention developer execution pipelines.</p>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="card mb-16">
        <div class="eyebrow">ARCHITECTURE</div>
        <h2>Enterprise-Grade Intelligence Platform</h2>
        <p>Built with Angular 20, Next.js Edge Gateway, Redis acceleration, and fault-tolerant orchestration layers.</p>
        <div class="grid-2 mt-8">
          <div>
            <h4>OCR & Vision Pipelines</h4>
            <p class="muted">Sub-second document parsing with exact bounding boxes, semantic layout preservation, and screen-reader optimizations.</p>
          </div>
          <div>
            <h4>Multi-Modal Translation</h4>
            <p class="muted">Text simplification tuned for cognitive accessibility and rule-based sign language gloss translation.</p>
          </div>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section">
        <div class="eyebrow mb-4">FREQUENTLY ASKED QUESTIONS</div>
        <h2 class="mb-8">Everything you need to know</h2>

        <div class="faq-list">
          <div class="faq-item card mb-4" *ngFor="let item of faqs; let i = index" (click)="toggleFaq(i)">
            <div class="faq-question">
              <h4>{{ item.q }}</h4>
              <span class="faq-icon">{{ openFaq === i ? '−' : '+' }}</span>
            </div>
            <div class="faq-answer" *ngIf="openFaq === i">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="card text-center py-12 mt-16 vibrant-border">
        <div class="eyebrow mb-2">GET STARTED</div>
        <h2>Ready to integrate AccessOS AI?</h2>
        <p class="max-w-md mx-auto mb-6">Generate your API key today and start transforming your application’s accessibility features.</p>
        <a routerLink="/signup" class="btn btn-primary">Get API Key</a>
      </div>
    </div>
  `,
  styles: [`
    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
    .faq-question h4 { margin: 0; }
    .faq-icon { font-size: 20px; color: var(--accent); font-weight: 700; }
    .faq-answer { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); }
  `],
})
export class AboutComponent {
  openFaq: number | null = 0;

  faqs = [
    {
      q: 'How does AccessOS AI compare to generic LLM APIs?',
      a: 'AccessOS AI is specifically engineered for accessibility workflows. It combines OCR, bounding box tracking, simplified text rewriting, and sign language glossing in a single request with guaranteed sub-100ms latency.',
    },
    {
      q: 'Can I test the APIs before creating an account?',
      a: 'Yes! You can test all endpoints in our interactive Public Playground or explore the live feature demos without an API key.',
    },
    {
      q: 'Where are API keys managed?',
      a: 'API keys are managed inside your Developer Dashboard under Projects. You can create, rotate, and revoke keys instantly.',
    },
    {
      q: 'What data retention policies apply?',
      a: 'We strictly respect developer data confidentiality. You can toggle store_logs: false to ensure zero retention of payload text and image data.',
    },
  ];

  toggleFaq(index: number) {
    this.openFaq = this.openFaq === index ? null : index;
  }
}
