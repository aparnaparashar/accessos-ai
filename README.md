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

## What's still not done — see `NEXT_STEPS_PROMPT.md`

Companion page, Settings page, wiring the Developer Portal UI to the new
real endpoints (it still shows sample data), SEO/404/toast polish, and all
of Docker/CI/tests. `NEXT_STEPS_PROMPT.md` in this repo root is a ready-to-
paste prompt for the next session with exact file-level instructions.

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
