import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="section auth-page">
      <div class="container auth-wrap">
        <div class="card auth-card">
          <span class="eyebrow">DEVELOPER SIGN IN</span>
          <h1 class="mt-2">Welcome Back</h1>
          <p class="lede mb-6">Sign in to access your Developer Dashboard, manage API keys, and monitor request logs.</p>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="field mb-4">
              <label for="email">Work Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                placeholder="name@company.com"
                [attr.aria-invalid]="submitted() && form.controls.email.invalid"
              />
              @if (submitted() && form.controls.email.invalid) {
                <span class="field-error">Enter a valid email address.</span>
              }
            </div>

            <div class="field mb-6">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                autocomplete="current-password"
                placeholder="••••••••"
                [attr.aria-invalid]="submitted() && form.controls.password.invalid"
              />
              @if (submitted() && form.controls.password.invalid) {
                <span class="field-error">Password is required.</span>
              }
            </div>

            @if (serverError()) {
              <div class="form-error mb-4" role="alert">{{ serverError() }}</div>
            }

            <button type="submit" class="btn btn-primary w-full" [disabled]="loading()">
              {{ loading() ? 'Signing in…' : 'Sign In to Dashboard' }}
            </button>
          </form>

          <p class="auth-switch">Don't have a developer account? <a routerLink="/signup">Get API Key</a></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page { padding: 80px 0 120px; min-height: 70vh; display: flex; align-items: center; }
    .auth-wrap { display: flex; justify-content: center; }
    .auth-card { width: 100%; max-width: 440px; padding: 40px 36px; animation: fade-up 0.3s var(--ease); }
    input[aria-invalid="true"] { border-color: var(--error); }
    .auth-switch { margin-top: 24px; font-size: 13px; text-align: center; color: var(--ink-muted); }
    .auth-switch a { color: var(--accent); font-weight: 500; }
  `],
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading = signal(false);
  submitted = signal(false);
  serverError = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  submit() {
    this.submitted.set(true);
    this.serverError.set(null);
    if (this.form.invalid) return;

    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.serverError.set(err?.error?.detail || err?.error?.error || 'Unable to sign in. Check your credentials and try again.');
      },
    });
  }
}
