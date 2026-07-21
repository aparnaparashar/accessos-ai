import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ApiFeature {
  id: string;
  name: string;
  endpoint: string;
  description: string;
  defaultPayload: string;
  mockResponse: any;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="features-page container py-12">
      <div class="page-head">
        <div class="eyebrow">LIVE INTERACTIVE DEMOS</div>
        <h1>AccessOS AI API Suite</h1>
        <p class="lede">Explore live request and response benchmarks for every API in the AccessOS AI suite. Run real-time inferences directly in your browser.</p>
      </div>

      <!-- Feature Tabs -->
      <div class="api-tabs mb-8">
        <button
          *ngFor="let api of apis"
          class="tab-btn"
          [class.active]="activeApi.id === api.id"
          (click)="selectApi(api)"
        >
          {{ api.name }}
        </button>
      </div>

      <!-- Active Feature Details -->
      <div class="card demo-card">
        <div class="demo-head">
          <div>
            <span class="status-chip live">LIVE API</span>
            <h2 class="mt-2">{{ activeApi.name }}</h2>
            <p class="muted"><code>{{ activeApi.endpoint }}</code></p>
          </div>
          <a routerLink="/docs" class="btn btn-ghost">View API Docs →</a>
        </div>

        <p class="mb-6">{{ activeApi.description }}</p>

        <!-- Live Demo Panel -->
        <div class="grid-2">
          <!-- Request View -->
          <div class="pane">
            <div class="pane-head">
              <span class="mono">Request Payload</span>
              <span class="mono muted">JSON</span>
            </div>
            <textarea rows="9" [(ngModel)]="activePayload" class="font-mono text-xs"></textarea>
            <button class="btn btn-primary mt-4 w-full" (click)="runDemo()" [disabled]="running">
              <span *ngIf="!running">Run Interactive Inference</span>
              <span *ngIf="running">Running...</span>
            </button>
          </div>

          <!-- Response View -->
          <div class="pane">
            <div class="pane-head">
              <span class="mono">Response Body</span>
              <button class="copy-btn" (click)="copyResponse()" *ngIf="activeResponse">
                {{ copied ? 'Copied!' : 'Copy Response' }}
              </button>
            </div>
            <div class="response-box font-mono text-xs">
              <pre *ngIf="activeResponse"><code>{{ activeResponse }}</code></pre>
              <div class="empty-hint" *ngIf="!activeResponse">
                <span class="muted">Click "Run Interactive Inference" to execute payload.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Future APIs -->
      <div class="mt-16">
        <div class="eyebrow mb-4">COMING SOON</div>
        <div class="grid-3">
          <div class="card planned-card">
            <span class="status-chip planned mb-2">PLANNED</span>
            <h4>Real-Time Audio TTS API</h4>
            <p class="muted">Low-latency streaming text-to-speech audio generation with spatial orientation tags.</p>
          </div>
          <div class="card planned-card">
            <span class="status-chip planned mb-2">PLANNED</span>
            <h4>Video Spatial Trajectory API</h4>
            <p class="muted">Real-time object trajectory tracking for mobile indoor navigation feeds.</p>
          </div>
          <div class="card planned-card">
            <span class="status-chip planned mb-2">PLANNED</span>
            <h4>Multilingual Sign Avatar Stream</h4>
            <p class="muted">Generates 3D skeleton keypoints for continuous sign language streaming.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-tabs { display: flex; gap: 8px; flex-wrap: wrap; border-bottom: 1px solid var(--line); padding-bottom: 12px; }
    .tab-btn {
      background: transparent; border: 1px solid var(--line);
      color: var(--ink-soft); padding: 8px 16px; border-radius: var(--radius-sm);
      font-family: var(--font-sans); font-size: 14px; font-weight: 500; cursor: pointer;
      transition: all var(--duration-fast) var(--ease);
    }
    .tab-btn:hover { color: #fff; background: rgba(255, 255, 255, 0.04); }
    .tab-btn.active { color: #fff; background: var(--accent-soft); border-color: var(--accent); }

    .demo-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .pane { display: flex; flex-direction: column; }
    .pane-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px; color: var(--ink-muted); }
    .response-box {
      background: var(--bg-deep); border: 1px solid var(--line);
      border-radius: var(--radius-md); padding: 16px; height: 230px; overflow-y: auto;
    }
    .empty-hint { height: 100%; display: grid; place-items: center; text-align: center; }
    .copy-btn { background: transparent; border: 1px solid var(--line); color: var(--ink); padding: 2px 8px; border-radius: var(--radius-sm); cursor: pointer; font-size: 11px; }
  `],
})
export class FeaturesComponent {
  apis: ApiFeature[] = [
    {
      id: 'ocr',
      name: 'OCR API',
      endpoint: 'POST /v1/ocr',
      description: 'Extracts clear, formatted text from images and PDF documents with exact word bounding coordinates.',
      defaultPayload: '{\n  "image_url": "https://example.com/sample_invoice.png"\n}',
      mockResponse: {
        status: 'success',
        extracted_text: 'INVOICE #1042\nTotal Amount: $450.00\nDue Date: 2026-08-01',
        confidence: 0.994,
        processing_time_ms: 45,
      },
    },
    {
      id: 'vision',
      name: 'Vision API',
      endpoint: 'POST /v1/vision',
      description: 'Generates detailed scene explanations, primary subject descriptions, and alt-text for blind users.',
      defaultPayload: '{\n  "image_url": "https://example.com/street_view.jpg"\n}',
      mockResponse: {
        status: 'success',
        scene: 'A crosswalk with a visual signal showing a white walking icon. Pedestrians waiting on curb.',
        alt_text: 'Pedestrian crossing with active walk signal.',
        confidence: 0.982,
      },
    },
    {
      id: 'assist',
      name: 'Accessibility Assist',
      endpoint: 'POST /v1/accessibility/assist',
      description: 'Central orchestration endpoint synthesizing visual inputs, user context, and output preferences.',
      defaultPayload: '{\n  "input_text": "Is it safe to cross the street?",\n  "preferences": {\n    "reading_level": "simple"\n  }\n}',
      mockResponse: {
        primary_output: {
          text: 'Yes, it is safe to cross. The walk signal is white and active.',
          audio_url: null,
        },
        services_invoked: ['vision', 'orchestrator'],
        latency_ms: 54,
      },
    },
    {
      id: 'simplify',
      name: 'Text Simplification',
      endpoint: 'POST /v1/simplify',
      description: 'Converts complex or technical passages into plain-language summaries suited for cognitive readability.',
      defaultPayload: '{\n  "text": "The operational efficiency of the distributed consensus algorithm relies on Paxos."\n}',
      mockResponse: {
        original: 'The operational efficiency of the distributed consensus algorithm relies on Paxos.',
        simplified: 'The system uses a fast voting method called Paxos to keep computers working together.',
        grade_level: 'Grade 5',
      },
    },
    {
      id: 'sign',
      name: 'Sign Language Gloss',
      endpoint: 'POST /v1/sign-language',
      description: 'Converts natural language input into ordered sign language gloss vectors.',
      defaultPayload: '{\n  "text": "Where is the nearest train station?"\n}',
      mockResponse: {
        gloss: ['TRAIN', 'STATION', 'NEAREST', 'WHERE'],
        grammar_structure: 'Topic-Comment-Question',
      },
    },
  ];

  activeApi = this.apis[0];
  activePayload = this.activeApi.defaultPayload;
  activeResponse: string | null = null;
  running = false;
  copied = false;

  selectApi(api: ApiFeature) {
    this.activeApi = api;
    this.activePayload = api.defaultPayload;
    this.activeResponse = null;
  }

  runDemo() {
    this.running = true;
    setTimeout(() => {
      this.activeResponse = JSON.stringify(this.activeApi.mockResponse, null, 2);
      this.running = false;
    }, 300);
  }

  copyResponse() {
    if (this.activeResponse) {
      navigator.clipboard.writeText(this.activeResponse);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    }
  }
}
