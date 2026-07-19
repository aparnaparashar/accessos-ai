import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SettingsService } from '../../core/settings.service';
import { ToastService } from '../../core/toast.service';

interface AssistSecondaryOutput {
  modality: string;
  text: string;
  data?: unknown;
}

interface AssistResponse {
  response_id: string;
  primary_output: { modality: string; text: string; audio_url?: string | null };
  secondary_outputs: AssistSecondaryOutput[];
  services_invoked: string[];
  confidence: number;
  latency_ms: number;
}

interface AssistError {
  error: string;
  detail?: string;
}

/**
 * AI Companion (Section 06) — the single end-user surface for the entire
 * Accessibility Orchestrator. Sends whatever input is provided (image
 * and/or text) plus the emergency flag and the user's saved preferences
 * to POST /v1/accessibility/assist and renders exactly what comes back —
 * including a `capability_not_configured` response, which is shown as a
 * clear inline notice rather than a fake success state.
 */
@Component({
  selector: 'app-companion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="section page-head">
      <div class="container">
        <span class="eyebrow">06 · AI Companion</span>
        <h1>Describe what's around you, or ask for help</h1>
        <p class="lede">
          Attach a photo and/or type a question, flag it as an emergency if needed, and submit.
          Your saved <a routerLink="/settings">accessibility preferences</a> are sent with every request.
        </p>
      </div>
    </section>

    <section class="section companion-body">
      <div class="container companion-grid">
        <form class="card companion-form" (ngSubmit)="submit()" #form="ngForm">
          <div class="field">
            <label for="image-input">Photo (optional)</label>
            <div
              class="dropzone"
              [class.has-image]="imagePreview()"
              tabindex="0"
              role="button"
              aria-label="Upload or drop an image"
              (click)="fileInput.click()"
              (keydown.enter)="fileInput.click()"
              (keydown.space)="fileInput.click(); $event.preventDefault()"
              (dragover)="$event.preventDefault()"
              (drop)="onDrop($event)"
            >
              @if (imagePreview()) {
                <img [src]="imagePreview()" alt="Selected image preview" class="preview-img" />
                <button type="button" class="btn btn-ghost remove-img" (click)="clearImage($event)">Remove image</button>
              } @else {
                <span>Click, press Enter, or drag an image here</span>
              }
            </div>
            <input
              #fileInput
              id="image-input"
              type="file"
              accept="image/*"
              class="visually-hidden"
              (change)="onFileSelected($event)"
            />
          </div>

          <div class="field">
            <label for="text-input">Text / question (optional)</label>
            <textarea
              id="text-input"
              name="text"
              rows="4"
              [(ngModel)]="textInput"
              placeholder="e.g. Simplify this paragraph, or ask a question about the photo"
            ></textarea>
          </div>

          <div class="field field-inline">
            <label for="emergency-toggle" class="toggle-label">
              <input
                id="emergency-toggle"
                type="checkbox"
                name="emergency"
                [(ngModel)]="emergency"
              />
              Flag this as an emergency
            </label>
            <span class="hint">Emergency requests skip the secondary OCR pass for the fastest possible response.</span>
          </div>

          @if (clientError()) {
            <div class="form-error" role="alert">{{ clientError() }}</div>
          }

          <button type="submit" class="btn btn-primary" [disabled]="loading()">
            {{ loading() ? 'Asking the Orchestrator…' : 'Submit' }}
          </button>
        </form>

        <div class="card companion-response" aria-live="polite">
          <h3>Response</h3>
          @if (loading()) {
            <p class="muted">Waiting for a response…</p>
          } @else if (assistError()) {
            <div class="response-error" role="alert">
              <strong>{{ assistErrorTitle() }}</strong>
              <p>{{ assistError()!.detail || 'The request could not be completed.' }}</p>
            </div>
          } @else if (result()) {
            <p class="primary-text">{{ result()!.primary_output.text }}</p>

            @if (result()!.primary_output.audio_url) {
              <audio controls [src]="result()!.primary_output.audio_url!"></audio>
            } @else if (prefs().output_modalities.includes('audio')) {
              <p class="note">Audio output was requested, but no audio URL was returned — object storage/TTS backing is a planned item, not faked here.</p>
            }

            @if (result()!.secondary_outputs.length) {
              <div class="secondary-outputs">
                <h4>Secondary outputs</h4>
                @for (s of result()!.secondary_outputs; track s.text) {
                  <div class="secondary-item">
                    <span class="tag">{{ s.modality }}</span>
                    <pre>{{ s.data ? (s.data | json) : s.text }}</pre>
                  </div>
                }
              </div>
            }

            <div class="meta-row">
              <span>Services invoked: <strong>{{ result()!.services_invoked.join(', ') || 'none' }}</strong></span>
              <span>Latency: <strong>{{ result()!.latency_ms }}ms</strong></span>
              <span>Confidence: <strong>{{ (result()!.confidence * 100).toFixed(0) }}%</strong></span>
            </div>
          } @else {
            <p class="muted">Submit a photo or question to see the fused Orchestrator response here.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .lede { max-width: 620px; }
    .companion-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
    .companion-form { display: flex; flex-direction: column; gap: 18px; }
    .field { display: flex; flex-direction: column; gap: 8px; }
    .field-inline { flex-direction: row; align-items: center; flex-wrap: wrap; gap: 10px; }
    label { font-size: 13.5px; font-weight: 600; color: var(--ink); }
    textarea {
      padding: 11px 13px; border-radius: 10px; border: 1px solid var(--line);
      font-size: 14.5px; font-family: var(--font-body); resize: vertical; background: #fff; color: var(--ink);
    }
    textarea:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
    .dropzone {
      border: 2px dashed var(--line); border-radius: 12px; padding: 28px 16px;
      text-align: center; color: var(--ink-soft); cursor: pointer; font-size: 13.8px;
      display: flex; flex-direction: column; align-items: center; gap: 10px; min-height: 90px; justify-content: center;
    }
    .dropzone:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .dropzone.has-image { padding: 12px; }
    .preview-img { max-width: 100%; max-height: 200px; border-radius: 8px; }
    .remove-img { padding: 6px 14px; font-size: 12.5px; }
    .visually-hidden {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
    }
    .toggle-label { display: flex; align-items: center; gap: 8px; font-weight: 500; }
    .toggle-label input { width: 17px; height: 17px; }
    .hint { font-size: 12.5px; color: var(--ink-soft); font-weight: 400; }
    .form-error {
      background: rgba(194,65,13,0.1); color: #C2410D; padding: 10px 12px;
      border-radius: 10px; font-size: 13.5px;
    }
    button[disabled] { opacity: 0.6; cursor: not-allowed; }
    .companion-response h3 { margin-bottom: 14px; }
    .muted { color: var(--ink-soft); font-size: 14px; }
    .primary-text { font-size: 15.5px; color: var(--ink); }
    .response-error {
      background: rgba(194,65,13,0.08); border: 1px solid rgba(194,65,13,0.25);
      padding: 14px 16px; border-radius: 10px; color: #7A2A15;
    }
    .response-error p { color: inherit; margin: 6px 0 0; font-size: 13.8px; }
    .secondary-outputs { margin-top: 18px; }
    .secondary-outputs h4 { font-size: 13.5px; margin-bottom: 8px; }
    .secondary-item { margin-bottom: 10px; }
    .tag {
      display: inline-block; font-family: var(--font-mono); font-size: 11px;
      background: var(--accent-soft); color: var(--accent); padding: 2px 8px;
      border-radius: 999px; margin-bottom: 6px;
    }
    pre {
      background: var(--bg-base); border: 1px solid var(--line); border-radius: 8px;
      padding: 10px 12px; font-size: 12.5px; overflow-x: auto; white-space: pre-wrap;
    }
    .meta-row {
      margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--line);
      display: flex; flex-wrap: wrap; gap: 16px; font-size: 12.8px; color: var(--ink-soft);
    }
    .note { font-size: 12.5px; color: var(--ink-soft); margin-top: 8px; }
    audio { width: 100%; margin-top: 10px; }
    @media (max-width: 900px) { .companion-grid { grid-template-columns: 1fr; } }
  `],
})
export class CompanionComponent {
  textInput = '';
  emergency = false;
  imagePreview = signal<string | null>(null);
  loading = signal(false);
  result = signal<AssistResponse | null>(null);
  assistError = signal<AssistError | null>(null);
  clientError = signal<string | null>(null);

  constructor(private http: HttpClient, private settings: SettingsService, private toast: ToastService) {}

  prefs() {
    return this.settings.get();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.readFile(file);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.readFile(file);
  }

  private readFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.clientError.set('Please choose an image file.');
      return;
    }
    this.clientError.set(null);
    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  clearImage(event: Event) {
    event.stopPropagation();
    this.imagePreview.set(null);
  }

  submit() {
    this.clientError.set(null);
    this.assistError.set(null);

    if (!this.imagePreview() && !this.textInput.trim()) {
      this.clientError.set('Add a photo and/or some text before submitting.');
      return;
    }

    this.loading.set(true);
    this.result.set(null);

    const body = {
      user_context: { preferences: this.prefs() },
      input: {
        image: this.imagePreview() || null,
        text: this.textInput.trim() || null,
        audio: null,
        document: null,
      },
      device: {
        has_speaker: this.prefs().output_modalities.includes('audio'),
        has_haptics: this.prefs().output_modalities.includes('haptic'),
      },
      situation: { urgency: this.emergency ? 'emergency' : 'normal' },
    };

    this.http.post<AssistResponse>(`${environment.apiBase}/v1/accessibility/assist`, body).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.result.set(res);
        this.toast.success('Response received.');
      },
      error: (err) => {
        this.loading.set(false);
        const body = err?.error as AssistError | undefined;
        this.assistError.set(body || { error: 'server_error', detail: 'Unable to reach the Orchestrator.' });
        this.toast.error(body?.detail || 'Request failed.');
      },
    });
  }

  assistErrorTitle(): string {
    const code = this.assistError()?.error;
    if (code === 'capability_not_configured') return 'Capability not configured';
    if (code === 'rate_limit_exceeded') return 'Daily rate limit exceeded';
    if (code === 'unauthorized') return 'Please sign in again';
    if (code === 'invalid_request') return 'Invalid request';
    return 'Request failed';
  }
}
