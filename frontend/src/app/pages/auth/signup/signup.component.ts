import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../../../core/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="section auth-page">
      <div class="container auth-wrap">
        <div class="card auth-card">
          <span class="eyebrow">Create account</span>
          <h1>Get started with AccessOS AI</h1>
          <p class="lede">Choose the account type that matches how you'll use the platform.</p>

          <div class="role-toggle" role="radiogroup" aria-label="Account type">
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="form.controls.role.value === 'end_user'"
              class="role-btn"
              [class.active]="form.controls.role.value === 'end_user'"
              (click)="form.controls.role.setValue('end_user')"
            >
              End user
              <small>Use the AI Companion &amp; accessibility settings</small>
            </button>
            <button
              type="button"
              role="radio"
              [attr.aria-checked]="form.controls.role.value === 'developer'"
              class="role-btn"
              [class.active]="form.controls.role.value === 'developer'"
              (click)="form.controls.role.setValue('developer')"
            >
              Developer
              <small>Build with the AccessOS API platform</small>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="field">
              <label for="full_name">Full name</label>
              <input id="full_name" type="text" formControlName="full_name" autocomplete="name"
                [attr.aria-invalid]="submitted() && form.controls.full_name.invalid" />
              @if (submitted() && form.controls.full_name.invalid) {
                <span class="field-error">Full name is required.</span>
              }
            </div>

            <div class="field">
              <label for="email">Email</label>
              <input id="email" type="email" formControlName="email" autocomplete="email"
                [attr.aria-invalid]="submitted() && form.controls.email.invalid" />
              @if (submitted() && form.controls.email.invalid) {
                <span class="field-error">Enter a valid email address.</span>
              }
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input id="password" type="password" formControlName="password" autocomplete="new-password"
                [attr.aria-invalid]="submitted() && form.controls.password.invalid" />
              @if (submitted() && form.controls.password.invalid) {
                <span class="field-error">Password must be at least 8 characters.</span>
              }
            </div>

            @if (serverError()) {
              <div class="form-error" role="alert">{{ serverError() }}</div>
            }

            <button type="submit" class="btn btn-primary" [disabled]="loading()">
              {{ loading() ? 'Creating account…' : 'Create account' }}
            </button>
          </form>

          <p class="auth-switch">Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-page { padding: 64px 0 96px; min-height: 60vh; }
    .auth-wrap { display: flex; justify-content: center; }
    .auth-card { width: 100%; max-width: 460px; padding: 36px; }
    .role-toggle { display: flex; gap: 10px; margin: 18px 0 22px; }
    .role-btn {
      flex: 1; text-align: left; padding: 12px 14px; border-radius: 10px;
      border: 1px solid var(--line); background: #fff; cursor: pointer;
      font-family: var(--font-body); font-weight: 600; font-size: 13.5px; color: var(--ink);
    }
    .role-btn small { display: block; font-weight: 400; color: var(--ink-soft); margin-top: 4px; font-size: 12px; }
    .role-btn.active { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
    .role-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
    .field { margin-bottom: 18px; display: flex; flex-direction: column; gap: 6px; }
    label { font-size: 13.5px; font-weight: 600; color: var(--ink); }
    input {
      padding: 11px 13px; border-radius: 10px; border: 1px solid var(--line);
      font-size: 14.5px; font-family: var(--font-body); background: #fff; color: var(--ink);
    }
    input:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
    input[aria-invalid="true"] { border-color: #C2410D; }
    .field-error { color: #C2410D; font-size: 12.5px; }
    .form-error {
      background: rgba(194,65,13,0.1); color: #C2410D; padding: 10px 12px;
      border-radius: 10px; font-size: 13.5px; margin-bottom: 16px;
    }
    button[type="submit"] { width: 100%; justify-content: center; margin-top: 6px; }
    button[disabled] { opacity: 0.6; cursor: not-allowed; }
    .auth-switch { margin-top: 20px; font-size: 13.5px; text-align: center; }
    .auth-switch a { color: var(--accent); font-weight: 600; }
  `],
})
export class SignupComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    full_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['end_user' as UserRole, [Validators.required]],
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
    const { full_name, email, password, role } = this.form.getRawValue();
    this.auth.signup({ full_name: full_name!, email: email!, password: password!, role: role! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(role === 'developer' ? '/developer-portal' : '/');
      },
      error: (err) => {
        this.loading.set(false);
        this.serverError.set(err?.error?.detail || err?.error?.error || 'Unable to create your account. Please try again.');
      },
    });
  }
}
