import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="section auth-page">
      <div class="container auth-wrap">
        <div class="card auth-card">
          <span class="eyebrow">DEVELOPER REGISTRATION</span>
          <h1 class="mt-2">Create Developer Account</h1>
          <p class="lede mb-6">Get instant access to AccessOS AI API keys, interactive playground, and request logs.</p>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="field mb-4">
              <label for="full_name">Full Name</label>
              <input id="full_name" type="text" formControlName="full_name" autocomplete="name" placeholder="Jane Doe"
                [attr.aria-invalid]="submitted() && form.controls.full_name.invalid" />
              @if (submitted() && form.controls.full_name.invalid) {
                <span class="field-error">Full name is required.</span>
              }
            </div>

            <div class="field mb-4">
              <label for="email">Work Email</label>
              <input id="email" type="email" formControlName="email" autocomplete="email" placeholder="name@company.com"
                [attr.aria-invalid]="submitted() && form.controls.email.invalid" />
              @if (submitted() && form.controls.email.invalid) {
                <span class="field-error">Enter a valid email address.</span>
              }
            </div>

            <div class="field mb-6">
              <label for="password">Password</label>
              <input id="password" type="password" formControlName="password" autocomplete="new-password" placeholder="At least 8 characters"
                [attr.aria-invalid]="submitted() && form.controls.password.invalid" />
              @if (submitted() && form.controls.password.invalid) {
                <span class="field-error">Password must be at least 8 characters.</span>
              }
            </div>

            @if (serverError()) {
              <div class="form-error mb-4" role="alert">{{ serverError() }}</div>
            }

            <button type="submit" class="btn btn-primary w-full" [disabled]="loading()">
              {{ loading() ? 'Creating account…' : 'Create Developer Account' }}
            </button>
          </form>

          <p class="auth-switch">Already registered? <a routerLink="/login">Sign In</a></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page { padding: 80px 0 120px; min-height: 70vh; display: flex; align-items: center; }
    .auth-wrap { display: flex; justify-content: center; }
    .auth-card { width: 100%; max-width: 460px; padding: 40px 36px; animation: fade-up 0.3s var(--ease); }
    input[aria-invalid="true"] { border-color: var(--error); }
    .auth-switch { margin-top: 24px; font-size: 13px; text-align: center; color: var(--ink-muted); }
    .auth-switch a { color: var(--accent); font-weight: 500; }
  `],
})
export class SignupComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    full_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['developer'],
  });

  loading = signal(false);
  submitted = signal(false);
  serverError = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.submitted.set(true);
    this.serverError.set(null);
    if (this.form.invalid) return;

    this.loading.set(true);
    const { full_name, email, password } = this.form.getRawValue();
    this.auth.signup({ full_name: full_name!, email: email!, password: password!, role: 'developer' }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading.set(false);
        this.serverError.set(err?.error?.detail || err?.error?.error || 'Unable to create your account. Please try again.');
      },
    });
  }
}
