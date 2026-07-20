# UI/UX Reference: "Resend, but Light Mode"

This document serves as the master blueprint for redesigning the AccessOS AI frontend. It takes the core principles of the industry's best developer experience (Resend, Stripe, Vercel) and maps them to a **premium, hyper-minimalist Light Mode** aesthetic.

---

## 1. Core Philosophy: The Developer's Canvas
Developers spend their lives staring at screens. Our light mode cannot be blinding; it must feel like high-quality matte paper. 
- **Code is the Hero Image:** Stop telling developers what the product does. *Show* them the JSON payload.
- **Micro-Interactions over Static Content:** The page must feel alive. 3D elements that track the mouse, code blocks that animate on scroll, and buttons that respond to hover with physical depth.
- **Zero Clutter:** Every border, shadow, and line of text must earn its place. If it doesn't help the developer integrate the API faster, delete it.

---

## 2. The "Matte Light" Color Palette
Instead of deep blacks and neon glows (Dark Mode), we use pure whites, soft silvers, and deep slates to create contrast and hierarchy.

| Element | Token/Color | Purpose |
|---------|-------------|---------|
| **Background (Base)** | `#FDFDFD` (Off-white) | The primary canvas. Not `#FFFFFF` (too harsh). |
| **Background (Panel)** | `#FFFFFF` | For floating cards and bento boxes to stand out against the base. |
| **Text (Primary)** | `#09090B` (Zinc-950) | Near black for maximum readability on headings. |
| **Text (Secondary)** | `#71717A` (Zinc-500) | For descriptions, meta-text, and standard paragraphs. |
| **Borders** | `#E4E4E7` (Zinc-200) | Ultra-subtle 1px borders to define structure. |
| **Accent (Brand)** | `#4F46E5` (Indigo-600) | For primary CTAs, active states, and code syntax highlights. |
| **Glass Effect** | `rgba(255,255,255,0.7)` | Combined with `backdrop-filter: blur(12px)` for sticky navs. |

### The "Light Glassmorphism" Shadow Strategy
In dark mode, you use inner borders/glows to create depth. In light mode, you use **diffused drop shadows**.
- **Resting state:** `box-shadow: 0 1px 2px rgba(0,0,0,0.05)`
- **Hover state (Interactive Boxes):** `box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1), 0 0 0 1px var(--accent)`

---

## 3. Typography
A developer brand needs highly legible, technical typography.
- **Headings (Display):** Inter (or Geist) — tightly tracked (`letter-spacing: -0.02em`), bold.
- **Body:** Inter — regular weight, spacious line-height (`1.6`).
- **Code (Monospace):** Fira Code or JetBrains Mono — used extensively not just in code blocks, but for badges, API routes (e.g., `POST /v1/assist`), and small metadata.

---

## 4. Visual Elements & Interactive Design

### 3D Objects & Motion
Instead of flat vector illustrations, we use lightweight 3D objects (rendered via Spline or Three.js). 
- **The Hero Visual:** A floating, slowly rotating 3D glass sphere or abstract geometric shape that reacts subtly to the user's mouse position. 
- **Purpose:** It adds a premium, "cutting-edge tech" feel without cluttering the page.

### The Bento Grid (Interactive Boxes)
The feature section must abandon standard vertical lists. We will use a **Bento Box Grid** (as seen on Apple and Linear).
- Each box represents a capability (e.g., Vision, OCR, Speech).
- **Hover Effect:** When a developer hovers over a box, the background shifts slightly, the 1px border illuminates (changes from Zinc-200 to Indigo-600), and a micro-animation plays inside the box (e.g., a mock API request returning a `200 OK`).

### Code Front and Center
- **The Code Window:** A beautiful, macOS-style code window (white background, very subtle shadow) permanently positioned on the right half of the hero section.
- **Syntax Highlighting:** A custom light-mode syntax theme. Strings are green, keywords are purple, variables are blue.
- **Tabs:** Developers can toggle between `cURL`, `Node.js`, and `Python` right in the UI.

---

## 5. Page-by-Page Transformation

### A. The Homepage (The Developer Pitch)
- **Hero:** Left side: Massive text: "The API for Accessibility". A clean "Get API Key" primary button. Right side: The interactive code window showing a live `POST` request to our endpoint.
- **Social Proof:** Grayscale logos of trusted companies directly below the hero.
- **Bento Features:** A grid showing "One API. Total Scene Understanding." Boxes for specific ML capabilities.
- **Performance:** A section dedicated purely to latency (`< 200ms response time`) and edge routing.

### B. The Developer Dashboard (The App)
This is the only logged-in experience. It must look like a high-end CLI tool brought to the web.
- **Navigation:** Left sidebar, clean icons. `Overview`, `API Keys`, `Logs`, `Webhooks`, `Billing`.
- **API Keys Page:** 
  - Keys are blurred until clicked. 
  - "Copy to clipboard" buttons everywhere.
- **Logs Page:** A dense, paginated table showing every request. Clicking a row opens a drawer showing the raw JSON request headers, body, and the response.

### C. Documentation (The Guide)
- Three-column layout: Navigation (Left), Content (Center), Dynamic Code Snippets (Right).
- **Sticky Code:** As you scroll down the explanation of an endpoint on the left, the code snippet on the right automatically updates to match the context.

---

## 6. Execution Rules
1. **Never use generic placeholder images.** If you need a visual, use a code snippet or a 3D primitive.
2. **Padding is sacred.** Double the padding you think you need. Breathing room is what makes light mode look expensive.
3. **Interactive feedback.** Every button, link, and interactive card must have a `<100ms` transition state (color change, scale shift, or shadow pop).
