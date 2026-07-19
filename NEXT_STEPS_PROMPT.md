# Prompt for the next LLM: continue AccessOS AI production build-out

Paste this along with the attached `accessos-ai.zip`.

## Context

This is continuing work on **AccessOS AI**. Stack is fixed — don't change it:
Angular 20 (standalone, lazy routes) / Next.js 14 App Router (single
service) / MongoDB via Mongoose / Redis via ioredis / JWT + bcrypt /
Tesseract.js OCR (genuinely local) / provider-abstracted vision-text
(fails closed with `capability_not_configured`).

Status-honesty convention still applies: every UI feature is tagged LIVE /
BUILT / PLANNED and the tag must match what the code actually does.

## What already exists now (don't rebuild)

**Backend** — all builds clean with `npm run build`:
- Everything from before: `lib/db.ts`, `lib/redis.ts` (now also has
  `consumeNonce`, `pingRedis`), `lib/jwt.ts`, `lib/orchestrator.ts` (OCR
  factored out into `lib/ocr.ts`), `models/User.ts`.
- New this pass: `lib/plans.ts`, `lib/keys.ts`, `lib/apiKeyAuth.ts`,
  `lib/vendorPricing.ts`, `lib/validation.ts` (zod schemas),
  `lib/requireDeveloper.ts`, `models/{Application,ApiKey,UsageLog,AuditLog}.ts`.
- Routes live: `/v1/auth/{signup,login,refresh}` (zod-validated),
  `/v1/accessibility/assist` (zod-validated, writes UsageLog, rate-limit
  headers), `/v1/developer/applications` (POST/GET),
  `/v1/developer/applications/[id]` (GET/PATCH),
  `/v1/developer/applications/[id]/keys` (POST/GET),
  `/v1/developer/applications/[id]/keys/[keyId]` (DELETE = revoke),
  `/v1/developer/applications/[id]/keys/[keyId]/rotate` (POST),
  `/v1/ocr` (API-key auth, real OCR, UsageLog), `/v1/analytics` (Mongo
  aggregation), `/v1/billing/usage`, `/v1/billing/checkout` (real Stripe,
  fails closed), `/v1/audit` (paginated), `/health/live`, `/health/ready`,
  `middleware.ts` (security headers on `/api/*`).
- `stripe` added to `backend/package.json`. `.env.example` updated with
  Stripe + nonce-TTL vars.

**Frontend**:
- `environments/environment.ts` + `.prod.ts`, wired into `angular.json` via
  `fileReplacements`.
- `core/auth.service.ts`, `core/auth.interceptor.ts`, `core/auth.guard.ts`.
- `pages/auth/login`, `pages/auth/signup` (reactive forms, role toggle,
  inline validation, loading states).
- `app.routes.ts` has `/login`, `/signup`; `/developer-portal` is
  `authGuard`-protected. `app.config.ts` registers `provideHttpClient` +
  the interceptor. `shared/navbar` is auth-aware (shows sign-in/up or
  current user + logout).
- Verified with `ng build --configuration development` (production build's
  font-inlining step needs real internet access to fonts.googleapis.com —
  a sandbox-only limitation, not a code issue; use `npm run build` normally).

**Nothing has Docker, CI, tests, or a deploy story yet.**

## Your job — work in this order, rebuild after each section

### 1. Frontend: AI Companion (Section 6 of the original spec)
- New `pages/companion` route, guarded by `authGuard`, added to `app.routes.ts`.
- Image upload (drag/drop + file picker) and/or text input, an "Emergency"
  toggle, submit button.
- Create `core/settings.service.ts` (see #2) and read the user's saved
  preferences before every request; send as `user_context.preferences` in
  the POST body to `${environment.apiBase}/v1/accessibility/assist`.
- Render `primary_output.text`; play `primary_output.audio_url` if present
  (it will currently always be `null` — that's correct, don't fake it);
  list `services_invoked` and `latency_ms`; show a clear inline error if
  the response is `{"error":"capability_not_configured"}` — no fake success
  states.
- Accessible by construction: `aria-live="polite"` region for the response,
  labeled controls, keyboard-operable upload, respect
  `prefers-reduced-motion` (already global in `styles.css` — don't override).

### 2. Frontend: Settings page (Section 7)
- New `pages/settings` route, guarded, added to routes.
- Primary disability/support need, reading level, output modalities —
  matches `AccessibilityPreferences` in `backend/src/lib/models/User.ts`.
- Persist to `localStorage` via a small `core/settings.service.ts`; the
  Companion page reads from the same service before every request. (The
  original prompt suggested localStorage-only; if you want it to actually
  persist server-side too, you'd need a `PATCH /v1/users/me/preferences`
  backend route — not implemented yet. Simplest correct path: localStorage
  only, matching the Features page's existing LIVE description of this
  feature — verify that description still matches what you build.)

### 3. Frontend: wire the Developer Portal to real data (Section 8)
This is the highest-value remaining item — the page currently shows 100%
sample data and several status chips claim BUILT when they should say LIVE
once wired.
- Create `core/dev.service.ts` wrapping: `POST/GET /v1/developer/applications`,
  `PATCH /v1/developer/applications/:id`, `POST/GET /v1/developer/applications/:id/keys`,
  `POST .../keys/:keyId/rotate`, `DELETE .../keys/:keyId`,
  `GET /v1/analytics`, `GET /v1/billing/usage`, `POST /v1/billing/checkout`,
  `GET /v1/audit`.
- Application list + "create application" form (name, plan, allowed-APIs
  checklist — valid values today: `ocr`, `accessibility.assist`).
- Key management per application: generate shows the plaintext secret
  **exactly once** in a dismissible "copy this now" panel (the API already
  returns it once and never again — don't try to re-fetch it); rotate;
  revoke with a confirm step.
- Analytics dashboard from `GET /v1/analytics` — inline SVG bars are fine,
  no charting library needed.
- Billing/usage view from `GET /v1/billing/usage`; a "Set up billing"
  button calling `POST /v1/billing/checkout`, clearly showing the
  `capability_not_configured` state (HTTP 501) when Stripe isn't configured
  — don't show a fake "connected" state.
- Update every status chip on this page from BUILT to LIVE **only** where
  it is now actually wired to a real endpoint; leave anything not covered
  above as BUILT/PLANNED, honestly.

### 4. Frontend: production polish (Section 9)
- SEO: per-route `<title>`/meta description via Angular's `Meta`/`Title`
  services (add to each page component or a route-data-driven resolver),
  Open Graph tags, `robots.txt`, `sitemap.xml` in `src/`.
- Replace the blank data-URI favicon in `index.html` with real icons.
- Real 404 page instead of silent `redirectTo: ''` (keep the redirect as a
  fallback but add a dedicated `NotFoundComponent` route users can actually
  land on with a "page not found" message + link home).
- Toast/notification service instead of `alert()` (there are currently no
  `alert()` calls to replace, but the new Companion/Settings/Developer
  Portal work in steps 1–3 should use it for submit success/error instead
  of inline-only errors).
- Accessibility pass (axe or Lighthouse) once steps 1–3 exist — fix any
  contrast or keyboard-trap issues.
- Unit tests for `auth.service`, `dev.service`, `settings.service`, and the
  Companion/Settings components (Karma/Jasmine, per Angular CLI defaults —
  no test runner is configured yet, so add it).

### 5. Backend: integration tests (still not done from the original Section 4)
Vitest or Jest + `next-test-api-route-handler` or supertest, covering:
signup/login/refresh happy + failure paths; assist with/without a provider
configured; API-key auth success/failure/replay (the nonce path needs a
real or mocked Redis); rate-limit 429 behavior; the Developer Platform CRUD
+ ownership-403 cases; billing checkout's fail-closed path.

### 6. Infra: Docker, compose, CI (Section 10, still not done)
- `backend/Dockerfile` — multi-stage `node:20-alpine`, `next build` → `next start`.
- `frontend/Dockerfile` — multi-stage: `ng build --configuration production`,
  serve `dist/` with `nginx:alpine`; `nginx.conf` with history-API fallback
  and a reverse proxy for `/v1/*` and `/health` to the backend service.
- `docker-compose.yml` at the repo root: `mongo`, `redis`, `backend`,
  `frontend`, using `.env.example` as the template.
- `.github/workflows/ci.yml`: install, lint, `next build`, `ng build`, run
  the backend integration tests from step 5.
- Update root `README.md`'s "Running it locally" section once
  `docker compose up` actually works, keeping the manual instructions too.

## Roadmap items intentionally still out of scope

Don't attempt unless explicitly asked — keep tagged PLANNED in the UI:
splitting Auth into a separate Postgres service; Kafka/RabbitMQ/Kubernetes/
Prometheus/Grafana/OpenTelemetry; MinIO object storage for TTS audio (keep
`audio_url: null`); a trained sign-language model (keep rule-based gloss);
real BLE/WiFi/AR indoor navigation; client SDK packages beyond documenting
the request pattern.

## Deliverable

A rebuilt `accessos-ai.zip` (source only — no `node_modules`, `.next`,
`dist`, `.angular`) that:
1. Passes `npm run build` in both `frontend/` and `backend/` with no errors
   (note: production `ng build` needs real internet access for Google Fonts
   inlining — if your sandbox lacks it, verify with
   `ng build --configuration development` and say so, same as this pass did)
2. Has every status chip in the UI accurately reflecting the code behind it
3. Includes an updated root `README.md` describing exactly what changed
