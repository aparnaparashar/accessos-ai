import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Plan {
  name: string; price: string; requests: string; includes: string[]; featured?: boolean;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">12 · Pricing</span>
        <h1>Rate-limit tiers, live in the Gateway today</h1>
        <p class="lede">Dollar amounts are illustrative placeholders — no billing service exists yet
          (Phase 4), so treat these as a starting point, not a finalized price list.</p>
      </div>
    </section>

    <section class="section">
      <div class="container plan-grid">
        <div class="card plan" *ngFor="let p of plans" [class.featured]="p.featured">
          <span class="eyebrow">{{ p.name }}</span>
          <div class="plan-price">{{ p.price }}</div>
          <div class="plan-req">{{ p.requests }} requests / day</div>
          <ul>
            <li *ngFor="let i of p.includes">{{ i }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="section cost-note">
      <div class="container">
        <div class="card note-card">
          <h3>What actually drives your real cost</h3>
          <p>Every AI-backed capability call (vision, text, STT, TTS) is a pass-through billed by
            your configured vendor (OpenAI / Gemini / Anthropic) at their own per-token/per-minute
            rates. OCR is free/local (Tesseract). Pricing tiers need to cover that variable vendor
            cost plus margin — worth modeling before finalizing the numbers above.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .plan-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
    .plan { display: flex; flex-direction: column; gap: 12px; transition: all var(--duration) var(--ease); }
    .plan:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
    .plan.featured { position: relative; overflow: hidden; box-shadow: var(--shadow-lg); transform: scale(1.02); border-color: transparent; }
    .plan.featured:hover { transform: scale(1.02) translateY(-2px); }
    .plan.featured::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%); }
    .plan-price { font-family: var(--font-display); font-size: 28px; color: var(--ink); margin-top: 4px; }
    .plan-req { font-family: var(--font-mono); font-size: 12px; color: var(--ink-soft); margin-bottom: 8px; }
    .plan ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
    .plan li { font-size: 13px; color: var(--ink-soft); padding-left: 16px; position: relative; }
    .plan li::before { content: '—'; position: absolute; left: 0; color: var(--accent); }
    .note-card { max-width: 720px; border-left: 4px solid var(--accent); border-radius: var(--radius-md); }
    
    @media (max-width: 980px) { .plan-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 620px) { .plan-grid { grid-template-columns: 1fr; } }
  `],
})
export class PricingComponent {
  plans: Plan[] = [
    { name: 'Free', price: '$0/mo', requests: '100', includes: ['All accessibility capabilities', 'Sandbox keys only', 'Community support'] },
    { name: 'Starter', price: '$49/mo*', requests: '10,000', includes: ['Production keys', 'Usage dashboard', 'Email support'] },
    { name: 'Pro', price: '$499/mo*', requests: '500,000', includes: ['Priority routing', 'Webhook support', 'Priority support'], featured: true },
    { name: 'Enterprise', price: 'Custom', requests: 'Unlimited', includes: ['Dedicated infrastructure', 'SLA + audit logs', 'Custom contract'] },
  ];
}
