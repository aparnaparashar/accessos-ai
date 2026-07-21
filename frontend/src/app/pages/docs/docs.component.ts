import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocSection {
  id: string;
  title: string;
  category: string;
}

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="docs-container">
      <!-- Sidebar Nav -->
      <aside class="docs-sidebar">
        <div class="sidebar-group" *ngFor="let group of groups">
          <div class="group-title">{{ group.name }}</div>
          <a
            *ngFor="let item of group.items"
            href="javascript:void(0)"
            class="sidebar-item"
            [class.active]="activeSection === item.id"
            (click)="selectSection(item.id)"
          >
            {{ item.title }}
          </a>
        </div>
      </aside>

      <!-- Main Doc Content -->
      <main class="docs-content">
        <!-- Introduction -->
        <section *ngIf="activeSection === 'intro'" class="doc-page">
          <div class="eyebrow">DEVELOPER DOCUMENTATION</div>
          <h1>AccessOS AI Platform Overview</h1>
          <p class="lede">
            AccessOS AI is a high-throughput, developer-first AI orchestration API. It unifies computer vision, OCR, text simplification, multi-modal scene understanding, and sign-language glossing into a single API endpoint.
          </p>

          <div class="card doc-card">
            <h3>Quick Start</h3>
            <p>Send your first accessibility inference request in under 60 seconds with cURL or Node.js.</p>
            <div class="code-header">
              <span>cURL Request</span>
              <button class="copy-btn" (click)="copyText(curlExample)">{{ copied ? 'Copied!' : 'Copy' }}</button>
            </div>
            <pre><code>{{ curlExample }}</code></pre>
          </div>

          <div class="grid-2 mt-8">
            <div class="card">
              <h3>Low Latency Edge Routing</h3>
              <p>Sub-100ms global response times with automatic Redis caching and Edge edge-cases handling.</p>
            </div>
            <div class="card">
              <h3>Strict Data Privacy</h3>
              <p>Zero retention options for developer payloads. Compliant with strict accessibility standards.</p>
            </div>
          </div>
        </section>

        <!-- Authentication -->
        <section *ngIf="activeSection === 'auth'" class="doc-page">
          <div class="eyebrow">SECURITY</div>
          <h1>Authentication</h1>
          <p class="lede">
            All API calls to AccessOS AI require a Bearer API Token passed in the HTTP Authorization header.
          </p>
          <pre><code>Authorization: Bearer aos_live_8f3a1b...</code></pre>
          <div class="note-box mt-6">
            <strong>Key Management:</strong> API keys belong to Projects. Never expose your secret keys in browser frontend applications; invoke AccessOS AI from server environments.
          </div>
        </section>

        <!-- APIs: OCR -->
        <section *ngIf="activeSection === 'ocr'" class="doc-page">
          <div class="eyebrow">API REFERENCE</div>
          <h1>Optical Character Recognition (OCR)</h1>
          <p class="lede">
            Extract clear, formatted text from images, scanned PDFs, or complex UI snapshots with position coordinates and reading order.
          </p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/ocr</span>
          </div>

          <h3>Request Snippet</h3>
          <div class="language-selector">
            <button
              *ngFor="let lang of languages"
              [class.active]="selectedLang === lang"
              (click)="selectedLang = lang"
            >
              {{ lang }}
            </button>
          </div>
          <pre><code>{{ getCodeSnippet('ocr', selectedLang) }}</code></pre>

          <h3 class="mt-6">Response Payload</h3>
          <pre><code>{{ ocrResponse }}</code></pre>
        </section>

        <!-- APIs: Vision -->
        <section *ngIf="activeSection === 'vision'" class="doc-page">
          <div class="eyebrow">API REFERENCE</div>
          <h1>Vision & Scene Understanding</h1>
          <p class="lede">
            Generate detailed visual descriptions, object detection maps, and alt-text suggestions tailored to screen readers.
          </p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/vision</span>
          </div>

          <pre><code>{{ getCodeSnippet('vision', selectedLang) }}</code></pre>
        </section>

        <!-- APIs: Assist -->
        <section *ngIf="activeSection === 'assist'" class="doc-page">
          <div class="eyebrow">API REFERENCE</div>
          <h1>Universal Accessibility Assist</h1>
          <p class="lede">
            The core orchestration endpoint. Takes user context, image/text input, and disability preferences to output structured accessibility responses.
          </p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/accessibility/assist</span>
          </div>

          <pre><code>{{ getCodeSnippet('assist', selectedLang) }}</code></pre>
        </section>

        <!-- SDKs -->
        <section *ngIf="activeSection === 'sdks'" class="doc-page">
          <div class="eyebrow">TOOLING</div>
          <h1>SDKs & Client Libraries</h1>
          <p class="lede">Official SDKs maintained by the AccessOS team.</p>

          <div class="grid-3 mt-6">
            <div class="card sdk-card">
              <h4>Node.js / TypeScript</h4>
              <code>npm i @accessos/sdk</code>
            </div>
            <div class="card sdk-card">
              <h4>Python</h4>
              <code>pip install accessos</code>
            </div>
            <div class="card sdk-card">
              <h4>Go</h4>
              <code>go get github.com/accessos/accessos-go</code>
            </div>
          </div>
        </section>

        <!-- Rate Limits & Errors -->
        <section *ngIf="activeSection === 'ratelimits'" class="doc-page">
          <div class="eyebrow">GOVERNANCE</div>
          <h1>Rate Limits & Status Codes</h1>
          <p class="lede">Standard HTTP response codes and headers returned by AccessOS AI.</p>

          <table class="doc-table mt-6">
            <thead>
              <tr>
                <th>Code</th>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>200</td><td>OK</td><td>Request processed successfully.</td></tr>
              <tr><td>401</td><td>Unauthorized</td><td>Missing or invalid Bearer API key.</td></tr>
              <tr><td>429</td><td>Too Many Requests</td><td>Rate limit exceeded. Check Retry-After header.</td></tr>
              <tr><td>500</td><td>Internal Error</td><td>Server execution failure.</td></tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .docs-container {
      display: grid;
      grid-template-columns: 260px 1fr;
      min-height: calc(100vh - 64px);
      max-width: var(--container);
      margin: 0 auto;
    }
    .docs-sidebar {
      padding: 32px 16px;
      border-right: 1px solid var(--line);
      background: var(--bg-deep);
    }
    .sidebar-group { margin-bottom: 24px; }
    .group-title {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-muted);
      margin-bottom: 10px;
      padding-left: 8px;
    }
    .sidebar-item {
      display: block;
      padding: 8px 12px;
      font-size: 14px;
      color: var(--ink-soft);
      border-radius: var(--radius-sm);
      transition: all var(--duration-fast) var(--ease);
    }
    .sidebar-item:hover { color: #fff; background: rgba(255, 255, 255, 0.04); }
    .sidebar-item.active { color: var(--accent); background: var(--accent-soft); font-weight: 500; }

    .docs-content { padding: 48px 48px 96px; }
    .doc-page { animation: fade-up 0.2s var(--ease); }
    .endpoint-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: var(--bg-deep);
      border: 1px solid var(--line);
      padding: 8px 16px;
      border-radius: var(--radius-md);
      font-family: var(--font-mono);
      font-size: 14px;
      margin: 20px 0;
    }
    .method.post { color: #a855f7; font-weight: 700; }
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--ink-muted);
      margin-bottom: 8px;
    }
    .copy-btn {
      background: transparent;
      border: 1px solid var(--line);
      color: var(--ink);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .language-selector {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
      overflow-x: auto;
    }
    .language-selector button {
      background: transparent;
      border: 1px solid var(--line);
      color: var(--ink-muted);
      padding: 4px 10px;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 12px;
      cursor: pointer;
    }
    .language-selector button.active {
      border-color: var(--accent);
      color: #fff;
      background: var(--accent-soft);
    }
    .note-box {
      background: var(--accent-soft);
      border-left: 3px solid var(--accent);
      padding: 16px;
      border-radius: var(--radius-sm);
      font-size: 14px;
    }
    .sdk-card code { display: block; margin-top: 10px; font-size: 12px; }

    @media (max-width: 860px) {
      .docs-container { grid-template-columns: 1fr; }
      .docs-sidebar { border-right: none; border-bottom: 1px solid var(--line); }
      .docs-content { padding: 24px; }
    }
  `],
})
export class DocumentationComponent {
  activeSection = 'intro';
  selectedLang = 'JavaScript';
  copied = false;

  languages = ['JavaScript', 'TypeScript', 'Python', 'Go', 'cURL'];

  groups = [
    {
      name: 'Getting Started',
      items: [
        { id: 'intro', title: 'Introduction' },
        { id: 'auth', title: 'Authentication' },
      ],
    },
    {
      name: 'API Reference',
      items: [
        { id: 'ocr', title: 'OCR API' },
        { id: 'vision', title: 'Vision API' },
        { id: 'assist', title: 'Accessibility Assist' },
      ],
    },
    {
      name: 'Resources',
      items: [
        { id: 'sdks', title: 'SDKs' },
        { id: 'ratelimits', title: 'Rate Limits & Errors' },
      ],
    },
  ];

  curlExample = `curl -X POST https://api.accessos.ai/v1/ocr \\
  -H "Authorization: Bearer aos_live_12345" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url": "https://example.com/document.png"}'`;

  ocrResponse = `{
  "status": "success",
  "text": "AccessOS AI Developer Platform",
  "confidence": 0.992,
  "words": [
    { "word": "AccessOS", "bbox": [12, 45, 120, 70] },
    { "word": "AI", "bbox": [128, 45, 160, 70] }
  ]
}`;

  selectSection(id: string) {
    this.activeSection = id;
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  getCodeSnippet(api: string, lang: string): string {
    if (lang === 'cURL') {
      return `curl -X POST https://api.accessos.ai/v1/${api} \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"input": "sample payload"}'`;
    }
    if (lang === 'Python') {
      return `import accessos\n\nclient = accessos.Client(api_key="aos_live_...")\nresponse = client.${api}.create(input="sample payload")\nprint(response)`;
    }
    if (lang === 'Go') {
      return `package main\nimport "github.com/accessos/accessos-go"\n\nfunc main() {\n    client := accessos.New("aos_live_...")\n    res, _ := client.${api}.Create("sample payload")\n}`;
    }
    return `import { AccessOS } from '@accessos/core';\n\nconst aos = new AccessOS('aos_live_...');\nconst res = await aos.${api}.process({ input: 'sample payload' });`;
  }
}
