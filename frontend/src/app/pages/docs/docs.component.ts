import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
        <!-- Overview -->
        <section *ngIf="activeSection === 'intro'" class="doc-page">
          <div class="eyebrow">DEVELOPER DOCUMENTATION</div>
          <h1>AccessOS AI Developer API</h1>
          <p class="lede">
            AccessOS AI provides developer-first REST APIs for computer vision, OCR, text simplification, ASL sign glossing, and multi-modal accessibility orchestration.
          </p>

          <div class="card doc-card">
            <h3>Quick Start Request</h3>
            <p class="mb-3 text-sm muted">Send your first inference using your Client ID and Secret API Key:</p>
            <div class="code-header">
              <span>cURL Request</span>
              <button class="copy-btn" (click)="copyText(quickStartCurl)">{{ copied ? '✓ Copied' : 'Copy' }}</button>
            </div>
            <pre><code>{{ quickStartCurl }}</code></pre>
          </div>

          <div class="grid-2 mt-8">
            <div class="card">
              <h3>Required Headers</h3>
              <p class="text-sm muted">All product endpoints require two headers:</p>
              <ul class="font-mono text-xs mt-2 space-y-1">
                <li><code>Authorization: Bearer &lt;secret_key&gt;</code></li>
                <li><code>X-Client-Id: &lt;client_id&gt;</code></li>
              </ul>
            </div>
            <div class="card">
              <h3>Rate Limiting & Quotas</h3>
              <p class="text-sm muted">Daily quotas are enforced per project. Check response headers:</p>
              <ul class="font-mono text-xs mt-2 space-y-1">
                <li><code>X-RateLimit-Limit: 1000</code></li>
                <li><code>X-RateLimit-Remaining: 998</code></li>
              </ul>
            </div>
          </div>
        </section>

        <!-- Authentication -->
        <section *ngIf="activeSection === 'auth'" class="doc-page">
          <div class="eyebrow">SECURITY</div>
          <h1>Authentication & Headers</h1>
          <p class="lede">
            Every request to the AccessOS AI Product APIs must include your Client ID and Secret API key obtained from your Developer Portal.
          </p>
          <div class="card font-mono text-xs space-y-2 mb-6">
            <div><strong class="text-white">Authorization:</strong> Bearer &lt;your_secret_key&gt;</div>
            <div><strong class="text-white">X-Client-Id:</strong> &lt;your_client_id&gt;</div>
            <div><strong class="text-white">Content-Type:</strong> application/json</div>
          </div>
          <div class="note-box">
            <strong>Security Warning:</strong> API keys grant full access to your project quota. Keep secret keys in server-side environments (Node.js, Python, Go) and never expose secret keys in browser frontends.
          </div>
        </section>

        <!-- API: OCR -->
        <section *ngIf="activeSection === 'ocr'" class="doc-page">
          <div class="eyebrow">PRODUCT API</div>
          <h1>Optical Character Recognition (OCR)</h1>
          <p class="lede">Extract plain text and confidence scores from base64 images or remote image URLs.</p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/ocr</span>
          </div>

          <div class="language-selector">
            <button *ngFor="let lang of languages" [class.active]="selectedLang === lang" (click)="selectedLang = lang">{{ lang }}</button>
          </div>
          <pre><code>{{ getCodeSnippet('ocr', selectedLang, { image_url: 'https://example.com/document.jpg' }) }}</code></pre>

          <h3 class="mt-6">Response (200 OK)</h3>
          <pre><code>{{ ocrResponse }}</code></pre>
        </section>

        <!-- API: Vision -->
        <section *ngIf="activeSection === 'vision'" class="doc-page">
          <div class="eyebrow">PRODUCT API</div>
          <h1>Vision & Scene Description</h1>
          <p class="lede">Generate detailed visual descriptions, alt text, and tags using AI vision models.</p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/vision</span>
          </div>

          <div class="language-selector">
            <button *ngFor="let lang of languages" [class.active]="selectedLang === lang" (click)="selectedLang = lang">{{ lang }}</button>
          </div>
          <pre><code>{{ getCodeSnippet('vision', selectedLang, { image_url: 'https://example.com/photo.jpg', simplified: false }) }}</code></pre>

          <h3 class="mt-6">Response (200 OK)</h3>
          <pre><code>{{ visionResponse }}</code></pre>
        </section>

        <!-- API: Simplify -->
        <section *ngIf="activeSection === 'simplify'" class="doc-page">
          <div class="eyebrow">PRODUCT API</div>
          <h1>Text Simplification</h1>
          <p class="lede">Convert complex or academic text to Grade 5 plain language for cognitive accessibility.</p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/simplify</span>
          </div>

          <div class="language-selector">
            <button *ngFor="let lang of languages" [class.active]="selectedLang === lang" (click)="selectedLang = lang">{{ lang }}</button>
          </div>
          <pre><code>{{ getCodeSnippet('simplify', selectedLang, { text: 'The mitochondria is the power house of the cell...' }) }}</code></pre>

          <h3 class="mt-6">Response (200 OK)</h3>
          <pre><code>{{ simplifyResponse }}</code></pre>
        </section>

        <!-- API: Sign Gloss -->
        <section *ngIf="activeSection === 'sign-language'" class="doc-page">
          <div class="eyebrow">PRODUCT API</div>
          <h1>Sign Language Glossing</h1>
          <p class="lede">Translate natural English text into ASL (American Sign Language) gloss tokens with grammar labels.</p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/sign-language</span>
          </div>

          <div class="language-selector">
            <button *ngFor="let lang of languages" [class.active]="selectedLang === lang" (click)="selectedLang = lang">{{ lang }}</button>
          </div>
          <pre><code>{{ getCodeSnippet('sign-language', selectedLang, { text: 'Where is the nearest train station?' }) }}</code></pre>

          <h3 class="mt-6">Response (200 OK)</h3>
          <pre><code>{{ signResponse }}</code></pre>
        </section>

        <!-- API: Accessibility Orchestrator -->
        <section *ngIf="activeSection === 'accessibility'" class="doc-page">
          <div class="eyebrow">PRODUCT API</div>
          <h1>Accessibility Orchestrator</h1>
          <p class="lede">Multi-modal endpoint running OCR, Vision, Simplification, and Sign Glossing in parallel.</p>

          <div class="endpoint-badge">
            <span class="method post">POST</span>
            <span class="url">/v1/accessibility</span>
          </div>

          <div class="language-selector">
            <button *ngFor="let lang of languages" [class.active]="selectedLang === lang" (click)="selectedLang = lang">{{ lang }}</button>
          </div>
          <pre><code>{{ getCodeSnippet('accessibility', selectedLang, { text: 'Take one pill before sleep.', reading_level: 'simplified' }) }}</code></pre>

          <h3 class="mt-6">Response (200 OK)</h3>
          <pre><code>{{ accessibilityResponse }}</code></pre>
        </section>

        <!-- Rate Limits & Errors -->
        <section *ngIf="activeSection === 'ratelimits'" class="doc-page">
          <div class="eyebrow">GOVERNANCE</div>
          <h1>Error Codes & Statuses</h1>
          <p class="lede">Standard HTTP status codes and error responses returned by AccessOS AI.</p>

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
              <tr><td>401</td><td>Unauthorized</td><td>Missing or invalid <code>Authorization</code> or <code>X-Client-Id</code> headers.</td></tr>
              <tr><td>429</td><td>Too Many Requests</td><td>Daily project rate limit exceeded.</td></tr>
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
    .doc-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    .doc-table th, .doc-table td { padding: 10px 14px; border-bottom: 1px solid var(--line); text-align: left; }
    .doc-table th { font-family: var(--font-mono); color: var(--ink-muted); font-size: 12px; }

    @media (max-width: 860px) {
      .docs-container { grid-template-columns: 1fr; }
      .docs-sidebar { border-right: none; border-bottom: 1px solid var(--line); }
      .docs-content { padding: 24px; }
    }
  `],
})
export class DocumentationComponent {
  activeSection = 'intro';
  selectedLang = 'cURL';
  copied = false;

  languages = ['cURL', 'JavaScript', 'Python'];

  groups = [
    {
      name: 'Getting Started',
      items: [
        { id: 'intro', title: 'Overview & Setup' },
        { id: 'auth', title: 'Authentication' },
      ],
    },
    {
      name: 'Product APIs',
      items: [
        { id: 'ocr', title: 'OCR API' },
        { id: 'vision', title: 'Vision API' },
        { id: 'simplify', title: 'Text Simplify' },
        { id: 'sign-language', title: 'Sign Language Gloss' },
        { id: 'accessibility', title: 'Accessibility Orchestrator' },
      ],
    },
    {
      name: 'Governance',
      items: [{ id: 'ratelimits', title: 'Rate Limits & Errors' }],
    },
  ];

  quickStartCurl = `curl -X POST http://localhost:8000/v1/ocr \\
  -H "Authorization: Bearer YOUR_SECRET_KEY" \\
  -H "X-Client-Id: YOUR_CLIENT_ID" \\
  -H "Content-Type: application/json" \\
  -d '{"image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Tux.png/220px-Tux.png"}'`;

  ocrResponse = `{
  "text": "AccessOS AI Platform",
  "confidence": 99.4,
  "engine": "tesseract"
}`;

  visionResponse = `{
  "provider": "openai",
  "description": "A high-resolution photograph showing a Linux mascot penguin standing on white background.",
  "alt_text": "Tux the Linux mascot penguin.",
  "tags": ["penguin", "linux", "mascot", "logo", "animal"],
  "simplified": false
}`;

  simplifyResponse = `{
  "provider": "openai",
  "original": "The mitochondria is the organelle responsible for ATP synthesis...",
  "simplified": "Mitochondria make power for cells.",
  "grade_level": "Grade 5"
}`;

  signResponse = `{
  "gloss": ["WHERE", "NEAREST", "TRAIN", "STATION"],
  "grammar_structure": "Question-Location",
  "method": "ai-gloss-openai"
}`;

  accessibilityResponse = `{
  "response_id": "resp_9a2b8c",
  "results": {
    "simplified_text": { "simplified": "Take one tablet twice a day." },
    "sign_gloss": { "gloss": ["TAKE", "ONE", "PILL", "TWICE", "DAILY"] }
  },
  "services_invoked": ["text-simplification", "sign-language-gloss"],
  "latency_ms": 142
}`;

  selectSection(id: string) {
    this.activeSection = id;
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  getCodeSnippet(api: string, lang: string, payloadObj: object): string {
    const jsonStr = JSON.stringify(payloadObj, null, 2);
    if (lang === 'cURL') {
      return `curl -X POST http://localhost:8000/v1/${api} \\\n  -H "Authorization: Bearer YOUR_SECRET_KEY" \\\n  -H "X-Client-Id: YOUR_CLIENT_ID" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(payloadObj)}'`;
    }
    if (lang === 'Python') {
      return `import requests\n\nurl = "http://localhost:8000/v1/${api}"\nheaders = {\n    "Authorization": "Bearer YOUR_SECRET_KEY",\n    "X-Client-Id": "YOUR_CLIENT_ID",\n    "Content-Type": "application/json"\n}\npayload = ${jsonStr}\n\nresponse = requests.post(url, json=payload, headers=headers)\nprint(response.json())`;
    }
    return `const res = await fetch('http://localhost:8000/v1/${api}', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer YOUR_SECRET_KEY',\n    'X-Client-Id': 'YOUR_CLIENT_ID',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify(${jsonStr})\n});\nconst data = await res.json();\nconsole.log(data);`;
  }
}
