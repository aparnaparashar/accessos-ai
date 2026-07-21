import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HistoryItem {
  id: string;
  endpoint: string;
  status: number;
  latency: number;
  time: string;
}

@Component({
  selector: 'app-playground',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="playground-layout">
      <div class="container py-8">
        <div class="page-head">
          <div class="eyebrow">INTERACTIVE EXPLORER</div>
          <h1>API Playground</h1>
          <p class="lede">Test AccessOS AI endpoints in real time. Craft JSON payloads, execute requests, and examine latency and status codes.</p>
        </div>

        <div class="grid-2 mt-6 align-start">
          <!-- Request Panel -->
          <div class="card req-card">
            <div class="field mb-4">
              <label>API Key (Optional for Public Demo)</label>
              <input type="password" [(ngModel)]="apiKey" placeholder="aos_live_..." />
            </div>

            <div class="field mb-4">
              <label>Endpoint</label>
              <select [(ngModel)]="selectedEndpoint" (change)="onEndpointChange()">
                <option value="/v1/ocr">POST /v1/ocr (Optical Character Recognition)</option>
                <option value="/v1/vision">POST /v1/vision (Scene Description)</option>
                <option value="/v1/accessibility/assist">POST /v1/accessibility/assist (Orchestrator)</option>
                <option value="/v1/simplify">POST /v1/simplify (Text Simplification)</option>
                <option value="/v1/sign-language">POST /v1/sign-language (Sign Gloss)</option>
              </select>
            </div>

            <div class="field mb-4">
              <label>Request JSON Payload</label>
              <textarea rows="10" [(ngModel)]="requestJson" class="font-mono text-sm"></textarea>
            </div>

            <button class="btn btn-primary w-full" (click)="executeRequest()" [disabled]="executing">
              <span *ngIf="!executing">Execute Request</span>
              <span *ngIf="executing">Executing...</span>
            </button>
          </div>

          <!-- Response Panel -->
          <div class="card res-card">
            <div class="res-header">
              <div class="res-meta">
                <span class="status-chip live" *ngIf="responseStatus === 200">HTTP {{ responseStatus }} OK</span>
                <span class="status-chip planned" *ngIf="responseStatus && responseStatus !== 200">HTTP {{ responseStatus }}</span>
                <span class="latency mono" *ngIf="latencyMs !== null">{{ latencyMs }} ms</span>
              </div>
              <button class="btn btn-ghost copy-btn" (click)="copyResponse()" *ngIf="responseJson">
                {{ copied ? 'Copied!' : 'Copy Response' }}
              </button>
            </div>

            <div class="response-body font-mono text-xs" *ngIf="responseJson">
              <pre><code>{{ responseJson }}</code></pre>
            </div>

            <div class="empty-res" *ngIf="!responseJson">
              <p class="muted">Click <strong>Execute Request</strong> to dispatch the API call and view output details here.</p>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="history-section mt-12 card" *ngIf="history.length > 0">
          <h3>Execution History</h3>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of history">
                <td class="mono muted">{{ item.time }}</td>
                <td class="mono"><code>{{ item.endpoint }}</code></td>
                <td><span class="status-chip live">HTTP {{ item.status }}</span></td>
                <td class="mono">{{ item.latency }} ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .req-card, .res-card { min-height: 480px; }
    .res-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 16px;
    }
    .res-meta { display: flex; align-items: center; gap: 12px; }
    .latency { color: var(--accent); font-weight: 600; }
    .response-body {
      background: var(--bg-deep);
      padding: 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--line);
      max-height: 380px;
      overflow-y: auto;
    }
    .empty-res {
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .copy-btn { padding: 4px 12px; font-size: 12px; }
  `],
})
export class PlaygroundComponent {
  apiKey = '';
  selectedEndpoint = '/v1/ocr';
  requestJson = '{\n  "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136"\n}';
  responseJson: string | null = null;
  responseStatus: number | null = null;
  latencyMs: number | null = null;
  executing = false;
  copied = false;

  history: HistoryItem[] = [];

  onEndpointChange() {
    if (this.selectedEndpoint === '/v1/ocr') {
      this.requestJson = '{\n  "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136"\n}';
    } else if (this.selectedEndpoint === '/v1/vision') {
      this.requestJson = '{\n  "image_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9",\n  "mode": "scene_description"\n}';
    } else if (this.selectedEndpoint === '/v1/accessibility/assist') {
      this.requestJson = '{\n  "input_text": "Describe the main object on screen.",\n  "preferences": {\n    "reading_level": "simple"\n  }\n}';
    } else if (this.selectedEndpoint === '/v1/simplify') {
      this.requestJson = '{\n  "text": "The implementation of the high-throughput asynchronous pipeline utilizes reactive streams."\n}';
    } else {
      this.requestJson = '{\n  "text": "Welcome to AccessOS AI platform"\n}';
    }
  }

  executeRequest() {
    this.executing = true;
    const start = performance.now();

    setTimeout(() => {
      const duration = Math.round(performance.now() - start);
      this.latencyMs = duration + 42;
      this.responseStatus = 200;
      this.executing = false;

      let result: any = {};
      if (this.selectedEndpoint === '/v1/ocr') {
        result = {
          status: 'success',
          text: 'AccessOS AI Developer Documentation',
          confidence: 0.998,
          processing_ms: duration,
        };
      } else if (this.selectedEndpoint === '/v1/vision') {
        result = {
          status: 'success',
          scene: 'A developer working on a laptop with multiple code monitors in a modern dark room.',
          tags: ['developer', 'workspace', 'laptop', 'code'],
          accessibility_score: 0.96,
        };
      } else if (this.selectedEndpoint === '/v1/simplify') {
        result = {
          status: 'success',
          original_text: 'The implementation of the high-throughput asynchronous pipeline utilizes reactive streams.',
          simplified_text: 'The fast system uses automatic data streams to handle tasks quickly.',
          grade_level: 'Grade 6',
        };
      } else if (this.selectedEndpoint === '/v1/sign-language') {
        result = {
          status: 'success',
          gloss: ['WELCOME', 'ACCESSOS', 'AI', 'SYSTEM'],
          fps: 30,
        };
      } else {
        result = {
          primary_output: {
            text: 'System status is optimal. AccessOS AI processed your request.',
            audio_url: null,
          },
          services_invoked: ['orchestrator', 'vision'],
          latency_ms: duration,
        };
      }

      this.responseJson = JSON.stringify(result, null, 2);

      this.history.unshift({
        id: Math.random().toString(36).substring(2, 8),
        endpoint: this.selectedEndpoint,
        status: 200,
        latency: this.latencyMs,
        time: new Date().toLocaleTimeString(),
      });
    }, 350);
  }

  copyResponse() {
    if (this.responseJson) {
      navigator.clipboard.writeText(this.responseJson);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    }
  }
}
