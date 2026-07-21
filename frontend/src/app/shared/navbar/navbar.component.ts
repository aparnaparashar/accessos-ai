import { Component, ElementRef, HostListener } from '@angular/core';
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
          <span class="brand-name">AccessOS <b class="gradient-text">AI</b></span>
        </a>

        <button class="mobile-menu-btn" (click)="menuOpen = !menuOpen" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>

        <nav class="links" [class.menuOpen]="menuOpen">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/features" routerLinkActive="active">Features</a>
          <a routerLink="/docs" routerLinkActive="active">Documentation</a>
          <a routerLink="/playground" routerLinkActive="active">Playground</a>
          <a routerLink="/about" routerLinkActive="active">About Us</a>
          @if (auth.user()) {
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          }
        </nav>

        @if (auth.user()) {
          <div class="profile-wrapper">
            <button type="button" class="profile-trigger" (click)="toggleProfile($event)" aria-haspopup="true" [attr.aria-expanded]="profileOpen">
              <span class="profile-avatar">{{ avatarInitial() }}</span>
              <span class="profile-label">Profile</span>
              <svg class="profile-chevron" [class.open]="profileOpen" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6l4 4 4-4"/></svg>
            </button>
            @if (profileOpen) {
              <div class="profile-dropdown" role="menu">
                <div class="profile-info">
                  <span class="profile-avatar-lg">{{ avatarInitial() }}</span>
                  <div class="profile-details">
                    <span class="profile-name">{{ auth.user()?.full_name || auth.user()?.email }}</span>
                    <span class="profile-email">{{ auth.user()?.email }}</span>
                  </div>
                </div>
                <div class="profile-divider"></div>
                <a routerLink="/dashboard" class="profile-item" role="menuitem" (click)="profileOpen = false">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Dashboard
                </a>
                <a routerLink="/settings" class="profile-item" role="menuitem" (click)="profileOpen = false">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  Settings
                </a>
                <button type="button" class="profile-item profile-logout" role="menuitem" (click)="logout()">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Log out
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="nav-account">
            <a routerLink="/login" class="btn btn-ghost nav-cta">Login</a>
            <a routerLink="/signup" class="btn btn-primary nav-cta">Get API Key</a>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    .nav {
      position: sticky; top: 0; z-index: 50;
      background: var(--bg-overlay);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--line);
    }
    .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
    .brand { display: flex; align-items: center; gap: 8px; }
    .brand-name { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
    .gradient-text {
      background: var(--vibrant-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .links { display: flex; gap: 6px; font-size: 14px; color: var(--ink-soft); align-items: center; }
    .links a {
      padding: 6px 14px;
      border-radius: var(--radius-sm);
      transition: all var(--duration-fast) var(--ease);
      font-weight: 500;
    }
    .links a:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }
    .links a.active {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }
    .nav-account { display: flex; align-items: center; gap: 10px; }
    .nav-cta { padding: 8px 18px; font-size: 13px; }

    /* Profile dropdown */
    .profile-wrapper { position: relative; }
    .profile-trigger {
      display: flex; align-items: center; gap: 8px;
      background: var(--bg-deep); border: 1px solid var(--line);
      border-radius: var(--radius-full);
      padding: 4px 12px 4px 4px;
      cursor: pointer; font-family: var(--font-sans);
      font-size: 13px; font-weight: 500; color: var(--ink-heading);
      transition: all var(--duration-fast) var(--ease);
    }
    .profile-trigger:hover { border-color: var(--line-strong); background: rgba(255, 255, 255, 0.04); }
    .profile-avatar {
      width: 28px; height: 28px; border-radius: var(--radius-full);
      background: var(--vibrant-gradient); color: #fff;
      display: grid; place-items: center;
      font-family: var(--font-sans); font-size: 12px; font-weight: 700;
    }
    .profile-label { margin-left: 2px; }
    .profile-chevron { transition: transform var(--duration-fast) var(--ease); opacity: 0.7; }
    .profile-chevron.open { transform: rotate(180deg); }

    .profile-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      min-width: 240px;
      background: var(--bg-panel);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 8px;
      animation: fade-up var(--duration-fast) var(--ease);
      z-index: 60;
    }
    .profile-info { display: flex; align-items: center; gap: 12px; padding: 8px 10px; }
    .profile-avatar-lg {
      width: 36px; height: 36px; border-radius: var(--radius-full);
      background: var(--vibrant-gradient); color: #fff;
      display: grid; place-items: center; font-weight: 700; font-size: 14px;
      flex-shrink: 0;
    }
    .profile-details { display: flex; flex-direction: column; min-width: 0; }
    .profile-name { font-size: 13px; font-weight: 600; color: var(--ink-heading); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .profile-email { font-size: 11px; color: var(--ink-muted); font-family: var(--font-mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .profile-divider { height: 1px; background: var(--line); margin: 6px 0; }
    .profile-item {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 8px 10px;
      border: none; background: transparent;
      border-radius: var(--radius-sm);
      font-family: var(--font-sans); font-size: 13px; font-weight: 500;
      color: var(--ink-soft); cursor: pointer; text-align: left;
      transition: all var(--duration-fast) var(--ease);
    }
    .profile-item:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
    .profile-item svg { flex-shrink: 0; opacity: 0.7; }
    .profile-logout:hover { background: var(--error-soft); color: var(--error); }

    .mobile-menu-btn { display: none; background: transparent; border: none; color: var(--ink); cursor: pointer; padding: 4px; }
    @media (max-width: 860px) {
      .mobile-menu-btn { display: block; }
      .links {
        display: none; position: absolute; top: 64px; left: 16px; right: 16px;
        flex-direction: column; background: var(--bg-panel);
        border: 1px solid var(--line); padding: 16px;
        border-radius: var(--radius-md); gap: 8px;
        box-shadow: var(--shadow-lg);
      }
      .links.menuOpen { display: flex; }
    }
  `],
})
export class NavbarComponent {
  menuOpen = false;
  profileOpen = false;

  constructor(public auth: AuthService, private router: Router, private elRef: ElementRef) {}

  avatarInitial(): string {
    const user = this.auth.user();
    if (!user) return '?';
    const name = user.full_name || user.email || '';
    return name.charAt(0).toUpperCase();
  }

  toggleProfile(event: Event) {
    event.stopPropagation();
    this.profileOpen = !this.profileOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.profileOpen && !this.elRef.nativeElement.querySelector('.profile-wrapper')?.contains(event.target as Node)) {
      this.profileOpen = false;
    }
  }

  logout() {
    this.profileOpen = false;
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
