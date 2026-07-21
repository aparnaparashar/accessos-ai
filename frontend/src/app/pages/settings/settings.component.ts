import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { SettingsService, AccessibilityPreferences, DEFAULT_PREFERENCES, OutputModality } from '../../core/settings.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-page container py-12">
      <div class="page-head">
        <div class="eyebrow">ACCOUNT & PREFERENCES</div>
        <h1>Developer Settings</h1>
        <p class="lede">Manage developer credentials, security parameters, notifications, and API defaults.</p>
      </div>

      <div class="grid-2 mt-8 align-start">
        <!-- Accessibility Preferences Card -->
        <div class="card">
          <h3>Accessibility Preferences</h3>
          <p class="hint mt-1">These default preferences are sent automatically with AI Companion requests.</p>

          <div class="field mt-4">
            <label for="disability">Primary Accessibility Needs</label>
            <select id="disability" [(ngModel)]="form.primary_disability">
              <option value="none">None / Default</option>
              <option value="low_vision">Low Vision</option>
              <option value="blind">Blind</option>
              <option value="deaf">Deaf</option>
              <option value="hard_of_hearing">Hard of Hearing</option>
              <option value="motor">Motor Impairment</option>
              <option value="cognitive">Cognitive Impairment</option>
            </select>
          </div>

          <div class="field mt-4">
            <label for="reading-level">Reading Level</label>
            <select id="reading-level" [(ngModel)]="form.reading_level">
              <option value="standard">Standard</option>
              <option value="simplified">Simplified</option>
            </select>
          </div>

          <div class="field mt-4">
            <label>Output Modalities</label>
            <div class="flex gap-4 mt-2">
              <label class="toggle-label">
                <input type="checkbox" [checked]="form.output_modalities.includes('text')" (change)="toggleModality('text')" />
                Text
              </label>
              <label class="toggle-label">
                <input type="checkbox" [checked]="form.output_modalities.includes('audio')" (change)="toggleModality('audio')" />
                Audio
              </label>
              <label class="toggle-label">
                <input type="checkbox" [checked]="form.output_modalities.includes('haptic')" (change)="toggleModality('haptic')" />
                Haptic
              </label>
            </div>
          </div>

          <div class="flex gap-4 mt-6">
            <button class="btn btn-primary" (click)="save()">Save Preferences</button>
            <button class="btn btn-ghost" (click)="resetDefaults()">Reset Defaults</button>
          </div>
        </div>

        <!-- Developer Profile Card -->
        <div class="card">
          <h3>Developer Profile</h3>
          <div class="field mt-4">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="fullName" />
          </div>
          <div class="field mt-4">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" disabled />
          </div>
          <div class="field mt-4">
            <label>Company / Organization</label>
            <input type="text" [(ngModel)]="company" placeholder="e.g. Acme AI Corp" />
          </div>
          <button class="btn btn-primary mt-6" (click)="saveProfile()">Save Changes</button>
        </div>

        <!-- Security & Preferences Card -->
        <div class="card">
          <h3>API Preferences & Privacy</h3>

          <div class="field mt-4">
            <label>Data Retention Policy (store_logs)</label>
            <select [(ngModel)]="storeLogs">
              <option value="enabled">Enabled — Store encrypted request logs for observability</option>
              <option value="disabled">Disabled — Zero data retention (HIPAA / SOC2 mode)</option>
            </select>
          </div>

          <div class="field mt-4">
            <label>Default Vision OCR Engine</label>
            <select [(ngModel)]="ocrEngine">
              <option value="accessos-v2">AccessOS OCR v2 (Recommended, 38ms)</option>
              <option value="tesseract-local">Tesseract.js Local Client</option>
            </select>
          </div>

          <div class="field mt-6">
            <label>Two-Factor Authentication (2FA)</label>
            <div class="flex justify-between items-center mt-2">
              <span class="status-chip planned">READY FOR ENROLLMENT</span>
              <button class="btn btn-ghost btn-sm">Configure 2FA</button>
            </div>
          </div>

          <div class="border-top pt-6 mt-6">
            <h4 class="text-red-400">Danger Zone</h4>
            <p class="muted text-xs mt-1">Permanently revoke all API keys and delete developer workspace data.</p>
            <button class="btn btn-ghost text-red-400 mt-2 btn-sm">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-sm { padding: 4px 10px; font-size: 12px; }
    .toggle-label { display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; }
  `],
})
export class SettingsComponent {
  form: AccessibilityPreferences = { ...DEFAULT_PREFERENCES };
  fullName = '';
  email = '';
  company = 'Developer Corp';
  storeLogs = 'enabled';
  ocrEngine = 'accessos-v2';

  constructor(
    public auth: AuthService,
    private settingsService: SettingsService,
    private toast: ToastService
  ) {
    this.form = { ...this.settingsService.get() };
    const u = this.auth.user();
    if (u) {
      this.fullName = u.full_name || '';
      this.email = u.email || '';
    }
  }

  save() {
    if (!this.form.output_modalities || this.form.output_modalities.length === 0) {
      this.toast.error('Choose at least one output modality.');
      return;
    }
    this.settingsService.save(this.form);
    this.toast.success('Preferences saved.');
  }

  toggleModality(modality: OutputModality) {
    const current = this.form.output_modalities || [];
    if (current.includes(modality)) {
      this.form.output_modalities = current.filter((m) => m !== modality);
    } else {
      this.form.output_modalities = [...current, modality];
    }
  }

  resetDefaults() {
    this.settingsService.reset();
    this.form = { ...this.settingsService.get() };
    this.toast.info('Preferences reset to defaults.');
  }

  saveProfile() {
    this.toast.success('Developer settings updated successfully.');
  }
}
