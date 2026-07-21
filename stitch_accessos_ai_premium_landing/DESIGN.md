---
name: Monolith Noir
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#303033'
  tertiary-container: '#e4e1e5'
  on-tertiary-container: '#656467'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#e4e1e5'
  tertiary-fixed-dim: '#c8c6c9'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.15em
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 120px
---

## Brand & Style
The design system for Monolith Noir is rooted in a "Dark Cinematic Minimalism" aesthetic. It targets high-end professional tools and enterprise SaaS where clarity and authority are paramount. The emotional response is one of quiet confidence, precision, and technological sophistication.

Drawing inspiration from the provided reference, the style utilizes deep monochromatic foundations punctuated by high-contrast typography and subtle glassmorphic overlays. The visual language is architectural—relying on structure, negative space, and a refined editorial sensibility rather than decorative flourishes.

## Colors
The palette is strictly monochromatic to maintain the "Noir" identity. 
- **Primary:** Pure white, reserved for high-priority text and primary action surfaces.
- **Secondary:** A muted zinc/silver used for secondary information and supporting icons.
- **Tertiary:** Dark graphite used for borders, dividers, and surface elevations.
- **Neutral:** A deep "near-black" ($09090B) serves as the universal background, providing the necessary depth for high-contrast typography to emerge.

## Typography
This system employs a sophisticated typographic hierarchy inspired by the Arcmail reference. 
- **Headlines:** Use *Playfair Display*. The high contrast between thick and thin strokes provides a premium, editorial feel. These are set with tight line-heights and slightly negative letter-spacing for a "locked-in" look.
- **Body:** Use *Inter*. This provides a clean, neutral balance to the expressive headlines. It is set with generous line-height to ensure readability against the dark background.
- **Technical Labels:** Use *JetBrains Mono*. Monospaced accents are used for small caps tags and UI meta-data, reinforcing the "precision" aspect of the brand.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop (max-width: 1280px) and a **Fluid Grid** on mobile.
- **Desktop:** 12-column grid with 24px gutters. Content is often centered with wide 80px margins to evoke a gallery-like feeling.
- **Mobile:** 4-column grid with 20px margins.
- **Rhythm:** A 4px baseline grid ensures vertical consistency. Spacing between major sections is intentionally large (120px+) to allow the design to breathe and emphasize the minimalist aesthetic.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Subtle Glassmorphism**.
- **Surface 0:** Background ($09090B).
- **Surface 1:** Container cards ($18181B) with a 1px solid border ($27272A).
- **Overlays:** Navigation bars and dropdowns use a "Frosted Glass" effect: 20px Backdrop Blur with a 10% white tint.
- **Shadows:** Avoid heavy black shadows. Instead, use a subtle 1px white "inner glow" or "rim light" on the top edge of primary components to give them a tactile, physical presence in the dark space.

## Shapes
The shape language is "Soft-Geometric." 
- Small components (buttons, inputs) use a 0.25rem (4px) radius to feel precise.
- Larger containers and cards use a 0.5rem (8px) radius.
- Interactive elements never use full pills (unless they are small utility chips) to maintain the architectural and structured feel of the design system.

## Components
- **Buttons:** 
  - *Primary:* Solid white background with black Inter-Bold text. No shadow, 4px radius.
  - *Secondary:* Transparent background with a 1px $27272A border. Text in white.
- **Inputs:** Dark background ($09090B), 1px border ($27272A). On focus, the border becomes white.
- **Chips:** Small Caps *JetBrains Mono* text inside a 1px bordered box. Used for categories or status indicators.
- **Cards:** Subtle dark-grey backgrounds ($121212) with a 1px border. No drop shadows; depth is strictly indicated by border contrast.
- **Lists:** Clean rows separated by 1px $27272A dividers. High horizontal padding (24px) to emphasize the width of the layout.