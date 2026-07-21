# UI/UX Reference: Luminous Intelligence (Light Mode)

This document serves as the master blueprint for redesigning the AccessOS AI frontend. It adapts the premium, architectural design language established in the `stitch_accessos_ai_premium_landing` prototype into a **refined, highly legible Light Mode** aesthetic tailored for developers and enterprise architects.

---

## 1. Core Philosophy: Architectural Clarity
The design system targets high-end professional tools and enterprise SaaS where clarity and authority are paramount. The emotional response is one of quiet confidence, precision, and technological sophistication.
- **Code is the Hero Image:** Stop telling developers what the product does. *Show* them the syntax and API payloads.
- **Editorial Elegance:** By combining high-contrast serif headlines with clean sans-serif body text and monospaced technical accents, the UI feels like a premium technical whitepaper.
- **Structured Space:** The visual language relies on strict grid structures, intentional negative space, and tonal layering rather than heavy shadows or decorative clutter.

---

## 2. The "Luminous Slate" Color Palette
We are transposing the deep "Noir" palette into a bright, airy Light Mode. We use pure whites, soft silvers, and deep slates to create contrast and hierarchy, accented by the brand's vibrant indigo-purple gradient.

| Element | Token/Color | Purpose |
|---------|-------------|---------|
| **Background** | `#F8F9FA` (Gray-50) | The primary canvas. Slightly off-white to reduce eye strain. |
| **Surface** | `#FFFFFF` (Pure White) | Container cards, bento boxes, and code windows. |
| **Surface Variant** | `#F3F4F6` (Gray-100) | Secondary containers, subtle highlights, or alternate table rows. |
| **Text (Primary)** | `#111827` (Gray-900) | Near black for maximum readability on headings and core text. |
| **Text (Variant)** | `#4B5563` (Gray-600) | For descriptions, meta-text, and standard paragraphs. |
| **Borders (Outline)** | `#E5E7EB` (Gray-200) | Ultra-subtle 1px borders to define structure without heavy shadows. |
| **Accent Gradient** | `linear-gradient(135deg, #6366f1, #a855f7)` | "Vibrant Gradient" for primary CTAs and active states. |
| **Vibrant Border** | `linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))` | For highlighting premium features or active bento boxes. |
| **Glass Effect** | `rgba(255, 255, 255, 0.8)` | Combined with `backdrop-filter: blur(12px)` for sticky navbars. |

---

## 3. Typography
The system employs a sophisticated typographic hierarchy combining editorial serifs with technical monospaces.

- **Headlines (Display & MD-XL):** *Playfair Display*
  - The high contrast between thick and thin strokes provides a premium, editorial feel. 
  - Weight: 500 (Medium).
  - Tracking: Tightly tracked (`letter-spacing: -0.01em` to `-0.02em`).
  - Styling: Large hero headlines should use *italic* emphasis on key phrases (e.g., "Architecting the Future of *AI*").
- **Body & Small Labels:** *Inter*
  - Provides a clean, neutral balance to the expressive headlines.
  - Generous line-height (`1.6`) ensures readability.
- **Technical & Code:** *JetBrains Mono*
  - Used for code snippets, API routes, and small caps tags (`label-caps` with `letter-spacing: 0.15em`).
  - Reinforces the "precision" and developer-first aspect of the brand.

---

## 4. Layout & Spacing
The layout follows a strict architectural rhythm to emphasize the minimalist aesthetic.

- **Grid:** 12-column grid on desktop, 4-column on mobile.
- **Container Max:** `1280px`
- **Gutter:** `24px`
- **Margins:** `80px` (Desktop) / `20px` (Mobile)
- **Section Gap:** `120px` between major sections to allow the design to breathe.
- **Base Unit:** `4px` baseline grid for consistent vertical rhythm.

---

## 5. Elevation & Shapes
Depth is created through **Tonal Layering**, **Soft Borders**, and **Hover Micro-interactions**.

### Border Radius
The shape language is "Soft-Geometric."
- **Small components (buttons, inputs, chips):** `0.25rem` (4px) to feel precise and sharp.
- **Standard Cards & Containers:** `0.5rem` (8px).
- **Large UI Panels (Code Windows):** `0.75rem` (12px).
- **Pills/Badges:** `full` (9999px) only for small utility chips.

### Shadows & Hover States (Light Mode specific)
Instead of heavy dark shadows, light mode relies on crisp borders and very diffused drop shadows.
- **Cards (Resting):** `border: 1px solid #E5E7EB`, Background `#FFFFFF`. No drop shadow.
- **Cards (Hover):** `transform: translateY(-4px)`, `box-shadow: 0 10px 30px -10px rgba(99,102,241,0.1)`, `border-color: rgba(168,85,247,0.3)`.
- **Primary Buttons:** Vibrant Gradient background with a subtle colored shadow: `box-shadow: 0 10px 15px -3px rgba(99,102,241,0.2)`. On active/click: `transform: scale(0.95)`.

---

## 6. Component Execution

### The Code Window
- **Container:** Background `#0D0D0D` (keep the code window dark for syntax contrast, creating a striking focal point against the light mode background), or a very crisp `#FFFFFF` with Light-mode syntax highlighting. (Prefer dark terminal windows on light backgrounds for that "developer tool" aesthetic).
- **Header:** Mac-style traffic lights (`#FF5F56`, `#FFBD2E`, `#27C93F`), JetBrains Mono labels.

### Bento Grid (Features & Endpoints)
- 12-column grid where cards span varying widths (e.g., 8-col and 4-col).
- **Endpoint Cards:** Interactive side-nav cards. When clicked/active, they receive the vibrant border highlight and a subtle background tint (`rgba(99,102,241,0.05)`).
- Icons utilize `Material Symbols Outlined` in the accent indigo color inside a soft tinted square (`bg-indigo-500/10`).

### Buttons
- **Primary:** `.vibrant-gradient` with white Inter-Medium text.
- **Secondary:** Transparent background, `1px solid #E5E7EB` border, text `#111827`. Hover state changes background to `#F3F4F6`.

### Navigation
- Sticky top header.
- Background: `rgba(255, 255, 255, 0.8)` with `backdrop-filter: blur(12px)`.
- Border-bottom: `1px solid rgba(0, 0, 0, 0.05)`.
