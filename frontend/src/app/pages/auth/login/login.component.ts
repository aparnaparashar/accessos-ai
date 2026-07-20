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
          <span class="eyebrow">Sign in</span>
          <h1>Welcome back</h1>
          <p class="lede">Sign in to reach your AI Companion, accessibility settings, or developer portal.</p>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="field">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                [attr.aria-invalid]="submitted() && form.controls.email.invalid"
              />
              @if (submitted() && form.controls.email.invalid) {
                <span class="field-error">Enter a valid email address.</span>
              }
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                autocomplete="current-password"
                [attr.aria-invalid]="submitted() && form.controls.password.invalid"
              />
              @if (submitted() && form.controls.password.invalid) {
                <span class="field-error">Password is required.</span>
              }
            </div>

            @if (serverError()) {
              <div class="form-error" role="alert">{{ serverError() }}</div>
            }

            <button type="submit" class="btn btn-primary" [disabled]="loading()">
              {{ loading() ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>

          <p class="auth-switch">Don't have an account? <a routerLink="/signup">Create one</a></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page { padding: 64px 0 96px; min-height: 60vh; }
    .auth-wrap { display: flex; justify-content: center; }
    .auth-card { width: 100%; max-width: 440px; padding: 36px 32px; box-shadow: var(--shadow-lg); border: none; animation: fade-up 0.4s var(--ease); }
    input[aria-invalid="true"] { border-color: var(--error); }
    button[type="submit"] { width: 100%; justify-content: center; margin-top: 8px; }
    .auth-switch { margin-top: 24px; font-size: 13px; text-align: center; }
    .auth-switch a { color: var(--accent); font-weight: 600; transition: color var(--duration) var(--ease); }
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
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading.set(false);
        this.serverError.set(err?.error?.detail || err?.error?.error || 'Unable to sign in. Check your credentials and try again.');
      },
    });
  }
}
