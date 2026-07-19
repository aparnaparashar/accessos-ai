# AccessOS AI — Website & API Layer

A working implementation of the platform described in *AccessOS AI — Product &
Technical Overview*: an **Angular 20** app backed by a **Next.js + MongoDB +
Redis** API layer.

```
accessos-ai/
├── frontend/   Angular 20 standalone-component app (the website)
└── backend/    Next.js API routes (Auth, Accessibility Orchestrator, Developer Platform)
```

## What changed in this pass

Starting point was a marketing/documentation site with a working end-user
auth + accessibility-assist API but **no Developer Platform routes, no
frontend auth flow, and no usage/billing/audit surface**. This pass added:

**Backend**
- `lib/plans.ts`, `lib/keys.ts`, `lib/apiKeyAuth.ts`, `lib/vendorPricing.ts`,
  `lib/validation.ts` (zod schemas for every route body), `lib/ocr.ts`
  (Tesseract OCR factored out of the orchestrator so it's shared).
- Models: `Application`, `ApiKey`, `UsageLog`, `AuditLog`.
- Full Developer Platform CRUD: create/list/update applications, generate/
  rotate/revoke API keys (secret shown once, bcrypt-hashed at rest, every
  mutation writes an `AuditLog` row, ownership enforced).
- `POST /v1/ocr` — reference developer-product API: API-key auth (bearer
  secret + `X-Client-Id`, optional HMAC-signed replay protection via
  `X-Timestamp`/`X-Nonce`/`X-Signature`), real local OCR, `UsageLog` write on
  every call.
- `GET /v1/analytics` (Mongo aggregation: totals, by-API, avg latency,
  success rate, calls/day for 30 days), `GET /v1/billing/usage` (illustrative
  estimated charges from `lib/vendorPricing.ts`), `POST /v1/billing/checkout`
  (real Stripe Checkout session if `STRIPE_SECRET_KEY` is set, otherwise
  fails closed with `capability_not_configured` — never fakes success),
  `GET /v1/audit` (paginated).
- `/v1/accessibility/assist` now validates its body with zod, writes a
  `UsageLog` row on every call, and returns `X-RateLimit-*` headers.
- `/health/live` + `/health/ready` (Mongo + Redis reachability), plus
  `middleware.ts` adding CSP/X-Frame-Options/etc. to every API response.

**Frontend**
- `environments/environment.ts` / `.prod.ts` (wired via `angular.json`
  `fileReplacements`).
- `core/auth.service.ts`, `core/auth.interceptor.ts` (attaches the bearer
  token, retries once on 401 via silent refresh), `core/auth.guard.ts`.
- `pages/auth/login`, `pages/auth/signup` — reactive forms, inline
  validation, a role toggle (end user vs. developer), loading/disabled
  states, visible focus states.
- `/login` and `/signup` added to `app.routes.ts`; `/developer-portal` is now
  guarded; the navbar shows sign-in/sign-up or the current user + log-out.

## What changed in this pass (CORS fix + End-User Portal + Developer Portal wiring)

**CORS bug fixed** — `backend/middleware.ts` previously only set security
headers and never answered the browser's OPTIONS preflight or sent
`Access-Control-Allow-*` headers, so any direct cross-origin call from
`localhost:4200` to `localhost:8000` was blocked before it reached a route
handler. It now answers preflight with 204 + the right headers and echoes
back any origin listed in the new `ALLOWED_ORIGINS` env var (defaults to
the Angular dev server). Note the dev server's own `proxy.conf.json` already
avoided this by proxying same-origin during `ng serve` — this fix covers
every other way of running the frontend (a static build, a different port,
production).

**Frontend — new**
- `core/toast.service.ts` + `shared/toast-host` — replaces `alert()`.
- `core/settings.service.ts` — accessibility preferences (primary
  disability, reading level, output modalities), persisted to
  `localStorage`, matching `backend/src/lib/models/User.ts` exactly.
- `core/dev.service.ts` — wraps every real Developer Platform endpoint.
- `core/seo.service.ts` — per-route `<title>`/meta description/Open Graph,
  driven by `data.seo` on each route in `app.routes.ts`.
- `pages/companion` — the AI Companion: image/text input, drag-and-drop
  upload, an emergency toggle, calls `/v1/accessibility/assist` with saved
  preferences, renders the real response (including a clear
  `capability_not_configured` state — never a fake success).
- `pages/settings` — the preferences form described above.
- `pages/not-found` — a real 404 page (the wildcard route now points here
  instead of silently redirecting).
- `favicon.svg`, `robots.txt`, `sitemap.xml`, wired into `angular.json`
  build assets; `index.html` now references the real favicon.

**Frontend — rewired to real data**
- `developer-portal.component.ts` no longer shows sample data: application
  create/list, key generate/rotate/revoke (secret shown exactly once),
  real analytics (inline SVG bar chart from `GET /v1/analytics`), billing
  usage + a "Set up billing" button that surfaces the real
  `capability_not_configured` (501) state when Stripe isn't configured,
  and a paginated audit log. Every status chip on this page now says LIVE
  because every panel is wired to a real endpoint.
- `architecture.component.ts` rewritten to describe the actual system: one
  Angular SPA + one Next.js backend (no gateway, no Kafka, no separate
  microservices, no Postgres) with a full table of every real route and
  its status.
- `roadmap.component.ts` updated to move API keys/billing/analytics/audit/
  Companion/Settings into a "Shipped" section instead of "Phase 4/5".
- `app.component.ts` now applies the SEO service on every navigation and
  hosts the toast component; `navbar` adds Companion/Settings links for
  signed-in users.

## What's still not done

Per this pass's instructions, **Docker, docker-compose, CI, and automated
tests were intentionally left out** — everything above runs locally with
plain `npm install && npm run dev/start` (see below). Also still open:
wiring the existing HMAC-signature + nonce-replay helpers into an actual
signed-request route, per-key IP allowlists/scopes enforced at request
time, and object storage for real TTS audio URLs. See the Roadmap page in
the app for the full list.

> **Build verification note:** this pass was done in a sandboxed
> environment with no network access and no `node_modules` installed, so
> `npm run build` could not be executed here to confirm a clean compile.
> All new/edited TypeScript files were checked by hand against the existing
> Angular 20 standalone-component/control-flow (`@if`/`@for`) conventions
> already used elsewhere in this codebase, and a structural (brace-balance)
> sanity pass was run on every changed file. Please run
> `npm install && npm run build` in both `frontend/` and `backend/` after
> unzipping to confirm, and open an issue-equivalent note back here if
> anything doesn't compile.

## Running it locally

### 1. Backend (Next.js + MongoDB + Redis)

```bash
cd backend
npm install
cp .env.example .env      # fill in MONGODB_URI, JWT secrets, and (optionally) AI provider / Stripe keys
npm run dev                # http://localhost:8000
```

Requires MongoDB (local `mongod` or Atlas). Redis is optional for rate
limiting in dev — it fails open if unreachable, but note the API-key path's
nonce replay protection also depends on Redis (`consumeNonce`), so run Redis
locally if you want to exercise signed requests.

### 2. Frontend (Angular)

```bash
cd frontend
npm install
npm start                  # http://localhost:4200, proxies /v1/* and /health to :8000
```

> **Note on this session's sandbox:** `ng build` (production) failed here
> only because the sandbox has no network access to `fonts.googleapis.com`
> for Angular's build-time font inlining — not a code defect. `ng build
> --configuration development` was used to confirm the app compiles and
> bundles cleanly. A normal CI runner or local machine with internet access
> will hit `npm run build` without this issue.

## Tech stack

| Layer | Stack used here |
|---|---|
| Frontend | Angular 20, standalone components, lazy-loaded routes |
| Backend | Next.js 14 App Router (route handlers) |
| Primary database | MongoDB via Mongoose |
| Cache / rate limiting / nonces | Redis (ioredis) |
| Auth | JWT access + refresh tokens, bcrypt password hashing |
| Developer Platform auth | API key (client id + bcrypt-hashed secret) with optional HMAC request signing |
| OCR | Tesseract.js (genuinely local, no vendor key) |
| Vision / Text | Provider-abstracted — `AI_PROVIDER_VISION` / `AI_PROVIDER_TEXT` = `openai`/`gemini`/`claude` |
| Billing | Stripe Checkout, fails closed with `capability_not_configured` if unset |

Intentionally out of scope (per the source spec's own roadmap): a separately
deployed Postgres-backed Auth service, Kafka/RabbitMQ, Kubernetes,
Prometheus/Grafana/OpenTelemetry, MinIO-backed TTS audio, a trained
sign-language model, and real BLE/WiFi/AR indoor navigation.
