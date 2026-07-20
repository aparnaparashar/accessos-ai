# AccessOS AI — Website & API Layer

A working implementation of the platform described in *AccessOS AI — Product &
Technical Overview*: an **Angular 20** app backed by a **Next.js + MongoDB +
Redis** API layer.

```
accessos-ai/
├── frontend/   Angular 20 standalone-component app (the website)
├── backend/    Next.js API routes (Auth, Accessibility Orchestrator, Developer Platform)
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## What changed in this pass

Starting point was a fully-wired End-User App (Companion, Settings) and
Developer Portal (applications, keys, analytics, billing, audit) backed by
real backend endpoints. This pass added **automated tests, Docker, and CI** —
the final three items from `NEXT_STEPS_PROMPT.md`.

**Frontend — unit tests (Section 4b)**
- Karma/Jasmine bootstrapped from scratch: `karma.conf.js`,
  `tsconfig.spec.json`, test architect target in `angular.json`, and
  `@angular-devkit/build-angular` Karma plugin.
- `auth.service.spec.ts` — signup/login/refresh/logout, token persistence,
  role management.
- `settings.service.spec.ts` — localStorage persistence, defaults, reset,
  signal reactivity, corrupt-data resilience.
- `dev.service.spec.ts` — every HTTP method/URL/body shape for the full
  Developer Platform API surface.
- `companion.component.spec.ts` — empty state, validation, submission,
  `capability_not_configured` error display, response rendering, audio null.
- `settings.component.spec.ts` — form init, save/reset flows, modality
  toggling, toast notifications.
- Run with `npm test` (headless Chrome).

**Backend — integration tests (Section 5)**
- Vitest + `mongodb-memory-server` — no external MongoDB or Redis needed.
- `tests/auth.test.ts` — signup (happy + duplicate + validation), login
  (happy + wrong creds + non-existent), refresh (happy + invalid).
- `tests/assist.test.ts` — 401 without auth, response structure, rate-limit
  headers, malformed body 400, rate-limit 429 (Redis mocked).
- `tests/developer.test.ts` — application CRUD, 401/403 enforcement,
  ownership isolation, PATCH updates, key generate/list lifecycle.
- `tests/billing.test.ts` — checkout fail-closed 501 (Stripe unconfigured),
  auth/role enforcement, plan validation 400, usage endpoint structure.
- Run with `npm test`.

**Infra — Docker, compose, CI (Section 6)**
- `backend/Dockerfile` — multi-stage `node:20-alpine`: deps → build → run.
- `frontend/Dockerfile` — multi-stage: `node:20-alpine` `ng build` →
  `nginx:alpine` serving the dist.
- `frontend/nginx.conf` — SPA history-API fallback, `/v1/*` and `/health`
  reverse proxy to `backend:8000`, gzip, static asset caching.
- `docker-compose.yml` — `mongo:7`, `redis:7-alpine`, `backend`, `frontend`.
  `docker compose up --build` starts the full stack.
- `.github/workflows/ci.yml` — two parallel jobs (backend + frontend):
  install → lint → build → test. Triggers on push to `main` and PRs.

## What was already done (prior passes)

**Backend** — all builds clean with `npm run build`:
- `lib/db.ts`, `lib/redis.ts`, `lib/jwt.ts`, `lib/orchestrator.ts`,
  `lib/ocr.ts`, `lib/plans.ts`, `lib/keys.ts`, `lib/apiKeyAuth.ts`,
  `lib/vendorPricing.ts`, `lib/validation.ts` (zod schemas),
  `lib/requireDeveloper.ts`.
- Models: `User`, `Application`, `ApiKey`, `UsageLog`, `AuditLog`.
- Routes: `/v1/auth/{signup,login,refresh}`, `/v1/accessibility/assist`,
  `/v1/developer/applications` (POST/GET),
  `/v1/developer/applications/[id]` (GET/PATCH),
  `/v1/developer/applications/[id]/keys` (POST/GET),
  `/v1/developer/applications/[id]/keys/[keyId]` (DELETE/rotate),
  `/v1/ocr`, `/v1/analytics`, `/v1/billing/usage`, `/v1/billing/checkout`,
  `/v1/audit`, `/health/live`, `/health/ready`.
- `middleware.ts` — security headers + CORS.

**Frontend**:
- `core/auth.service.ts` + interceptor + guard.
- `core/settings.service.ts`, `core/dev.service.ts`, `core/seo.service.ts`,
  `core/toast.service.ts`.
- Pages: `home`, `features`, `companion` (AI Companion), `settings`,
  `developer-portal` (fully wired), `architecture`, `pricing`, `roadmap`,
  `auth/login`, `auth/signup`, `not-found` (404).
- Shared: `navbar`, `footer`, `icon-rail`, `toast-host`.
- `favicon.svg`, `robots.txt`, `sitemap.xml`, per-route SEO + Open Graph.

## Running it locally

### Option A: Docker Compose (recommended)

```bash
cp backend/.env.example backend/.env   # fill in JWT secrets; AI provider + Stripe keys are optional
docker compose up --build              # http://localhost (frontend), :8000 (backend), :27017 (mongo), :6379 (redis)
```

### Option B: Manual

#### 1. Backend (Next.js + MongoDB + Redis)

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

#### 2. Frontend (Angular)

```bash
cd frontend
npm install
npm start                  # http://localhost:4200, proxies /v1/* and /health to :8000
```

> **Note:** `ng build` (production) requires internet access to
> `fonts.googleapis.com` for Angular's build-time font inlining. Use
> `ng build --configuration development` to verify compilation in an
> offline environment.

## Running tests

```bash
# Backend integration tests (self-contained, no external DB needed)
cd backend && npm test

# Frontend unit tests (requires Chrome/Chromium)
cd frontend && npm test
```

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
| Frontend tests | Karma + Jasmine (headless Chrome) |
| Backend tests | Vitest + mongodb-memory-server |
| CI | GitHub Actions (build + lint + test on push/PR) |
| Containerization | Docker multi-stage + docker-compose |

## Intentionally out of scope

Per the source spec's own roadmap: a separately deployed Postgres-backed Auth
service, Kafka/RabbitMQ, Kubernetes, Prometheus/Grafana/OpenTelemetry,
MinIO-backed TTS audio, a trained sign-language model, and real BLE/WiFi/AR
indoor navigation.
