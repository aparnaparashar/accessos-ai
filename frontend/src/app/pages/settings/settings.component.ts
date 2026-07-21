import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

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
  `],
})
export class SettingsComponent {
  fullName = '';
  email = '';
  company = 'Developer Corp';
  storeLogs = 'enabled';
  ocrEngine = 'accessos-v2';

  constructor(public auth: AuthService) {
    const u = this.auth.user();
    if (u) {
      this.fullName = u.full_name || '';
      this.email = u.email || '';
    }
  }

  saveProfile() {
    alert('Developer settings updated successfully.');
  }
}
