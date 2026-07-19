import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="nav">
      <div class="container nav-inner">
        <a routerLink="/" class="brand">
          <span class="brand-mark">AOS</span>
          <span class="brand-name">AccessOS <b>AI</b></span>
        </a>
        <nav class="links">
          <a routerLink="/features" routerLinkActive="active">Features</a>
          @if (auth.user()) {
            <a routerLink="/companion" routerLinkActive="active">Companion</a>
            <a routerLink="/settings" routerLinkActive="active">Settings</a>
          }
          <a routerLink="/developer-portal" routerLinkActive="active">Developer Portal</a>
          <a routerLink="/architecture" routerLinkActive="active">Architecture</a>
          <a routerLink="/pricing" routerLinkActive="active">Pricing</a>
          <a routerLink="/roadmap" routerLinkActive="active">Roadmap</a>
        </nav>
        @if (auth.user()) {
          <div class="nav-account">
            <span class="nav-email">{{ auth.user()?.email }}</span>
            <button type="button" class="btn btn-ghost nav-cta" (click)="logout()">Log out</button>
          </div>
        } @else {
          <div class="nav-account">
            <a routerLink="/login" class="btn btn-ghost nav-cta">Sign in</a>
            <a routerLink="/signup" class="btn btn-primary nav-cta">Get API Access</a>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .nav {
      position: sticky; top: 0; z-index: 40;
      background: rgba(238, 241, 251, 0.82);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--line);
    }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 68px; }
    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-mark {
      width: 34px; height: 34px; border-radius: 9px;
      background: var(--accent); color: #fff;
      display: grid; place-items: center;
      font-family: var(--font-mono); font-size: 11px; font-weight: 600;
    }
    .brand-name { font-family: var(--font-display); font-size: 17px; color: var(--ink); }
    .brand-name b { font-weight: 700; color: var(--accent); }
    .links { display: flex; gap: 28px; font-size: 14.5px; color: var(--ink-soft); }
    .links a { transition: color 0.15s ease; }
    .links a:hover, .links a.active { color: var(--accent); }
    .nav-account { display: flex; align-items: center; gap: 12px; }
    .nav-email { font-size: 13px; color: var(--ink-soft); font-family: var(--font-mono); }
    .nav-cta { padding: 9px 18px; font-size: 13.5px; }
    button.btn { border: 1px solid var(--line); background: transparent; }
    @media (max-width: 900px) {
      .links { display: none; }
      .nav-email { display: none; }
    }
  `],
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
