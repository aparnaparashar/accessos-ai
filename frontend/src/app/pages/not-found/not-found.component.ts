import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section not-found">
      <div class="bg-text">404</div>
      <div class="container content">
        <span class="eyebrow">404</span>
        <h1>Page not found</h1>
        <p class="lede">The page you were looking for doesn't exist, or may have moved.</p>
        <a routerLink="/" class="btn btn-primary home-btn">Back to home</a>
      </div>
    </section>
  `,
  styles: [`
    .not-found { 
      padding: 96px 0; text-align: center; 
      min-height: 60vh; 
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .bg-text {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      font-family: var(--font-display); font-size: 120px; font-weight: 800;
      color: var(--line-strong); opacity: 0.5; z-index: -1; pointer-events: none;
    }
    .content { animation: fade-up 0.4s var(--ease-out); z-index: 1; }
    .lede { max-width: 480px; margin: 16px auto; }
    .home-btn { margin-top: 24px; }
  `],
})
export class NotFoundComponent {}
