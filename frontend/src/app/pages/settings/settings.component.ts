import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AccessibilityPreferences,
  OutputModality,
  PrimaryDisability,
  ReadingLevel,
  SettingsService,
} from '../../core/settings.service';
import { ToastService } from '../../core/toast.service';

interface Option<T> {
  value: T;
  label: string;
}

/**
 * Settings page (Section 07). Edits the same AccessibilityPreferences
 * shape stored in backend/src/lib/models/User.ts, persisted client-side
 * via SettingsService (localStorage) and read by the Companion page
 * before every /v1/accessibility/assist call.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">07 · Accessibility Settings</span>
        <h1>Your preferences</h1>
        <p class="lede">
          These are stored on this device and sent with every AI Companion request — they actually
          change how the Orchestrator responds (reading level, sign-gloss, audio hints).
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <form class="card settings-form" (ngSubmit)="save()">
          <div class="field">
            <label for="disability">Primary disability / support need</label>
            <select id="disability" name="disability" [(ngModel)]="form.primary_disability">
              @for (opt of disabilityOptions; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
          </div>

          <div class="field">
            <label for="reading-level">Reading level</label>
            <select id="reading-level" name="readingLevel" [(ngModel)]="form.reading_level">
              @for (opt of readingLevelOptions; track opt.value) {
                <option [value]="opt.value">{{ opt.label }}</option>
              }
            </select>
            <span class="hint">"Simplified" routes text through the configured text-simplification provider.</span>
          </div>

          <fieldset class="field">
            <legend>Output modalities</legend>
            @for (opt of modalityOptions; track opt.value) {
              <label class="checkbox-row">
                <input
                  type="checkbox"
                  [checked]="form.output_modalities.includes(opt.value)"
                  (change)="toggleModality(opt.value)"
                />
                {{ opt.label }}
              </label>
            }
            <span class="hint">"Audio" requests an audio_url in the response — currently always null until object storage/TTS is wired up (Phase 4).</span>
          </fieldset>

          <div class="actions">
            <button type="submit" class="btn btn-primary">Save preferences</button>
            <button type="button" class="btn btn-ghost" (click)="resetDefaults()">Reset to defaults</button>
          </div>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .settings-form { max-width: 520px; display: flex; flex-direction: column; gap: 24px; }
  `],
})
export class SettingsComponent {
  form: AccessibilityPreferences;

  disabilityOptions: Option<PrimaryDisability>[] = [
    { value: 'none', label: 'None' },
    { value: 'low_vision', label: 'Low vision' },
    { value: 'blind', label: 'Blind' },
    { value: 'deaf', label: 'Deaf' },
    { value: 'hard_of_hearing', label: 'Hard of hearing' },
    { value: 'motor', label: 'Motor' },
    { value: 'cognitive', label: 'Cognitive' },
  ];

  readingLevelOptions: Option<ReadingLevel>[] = [
    { value: 'standard', label: 'Standard' },
    { value: 'simplified', label: 'Simplified' },
  ];

  modalityOptions: Option<OutputModality>[] = [
    { value: 'text', label: 'Text' },
    { value: 'audio', label: 'Audio' },
    { value: 'haptic', label: 'Haptic' },
  ];

  constructor(private settings: SettingsService, private toast: ToastService) {
    this.form = { ...this.settings.get() };
  }

  toggleModality(value: OutputModality) {
    const set = new Set(this.form.output_modalities);
    if (set.has(value)) {
      set.delete(value);
    } else {
      set.add(value);
    }
    this.form.output_modalities = Array.from(set);
  }

  save() {
    if (!this.form.output_modalities.length) {
      this.toast.error('Choose at least one output modality.');
      return;
    }
    this.settings.save({ ...this.form });
    this.toast.success('Preferences saved.');
  }

  resetDefaults() {
    this.settings.reset();
    this.form = { ...this.settings.get() };
    this.toast.info('Preferences reset to defaults.');
  }
}
