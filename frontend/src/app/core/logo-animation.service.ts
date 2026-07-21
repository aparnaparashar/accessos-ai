import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogoAnimationService {
  private hasAnimated = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        // Detect full page reload (F5 / Refresh)
        const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        const isReload = entries.length > 0 && entries[0].type === 'reload';

        if (isReload) {
          // On full page refresh, reset animation state so it plays on refresh
          sessionStorage.removeItem('accessos_logo_animated');
          this.hasAnimated = false;
        } else {
          // Read session storage state for SPA tab navigation
          this.hasAnimated = sessionStorage.getItem('accessos_logo_animated') === 'true';
        }
      } catch {
        this.hasAnimated = false;
      }

      // Expose helper in browser console for manual testing
      (window as any).resetLogoAnim = () => this.reset();
    }
  }

  shouldAnimate(): boolean {
    // Always allow logo entrance animation on initial load / refresh
    if (this.hasAnimated) {
      return false;
    }
    return true;
  }

  markAnimated(): void {
    this.hasAnimated = true;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('accessos_logo_animated', 'true');
      } catch {}
    }
  }

  reset(): void {
    this.hasAnimated = false;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('accessos_logo_animated');
      } catch {}
    }
  }
}
