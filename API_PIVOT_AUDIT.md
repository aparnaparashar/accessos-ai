# Pivot Audit: AccessOS AI as a Developer-First API (The "Resend" Model)

Pivoting to a pure developer-first API platform is a highly effective move. It simplifies your go-to-market strategy, reduces surface area, and focuses entirely on Developer Experience (DX). Like Resend did for email, AccessOS AI will become the sleek, reliable plumbing for accessibility.

Here is a full audit of what changes architecturally and structurally across your stack:

---

## 1. Product & Frontend Architecture Changes

### What gets removed (or repurposed):
- **End-User Companion App (`/companion`)**: Remove it as a standalone consumer product. Repurpose it into an **API Playground** within the Developer Portal so developers can test payloads before writing code.
- **Consumer Settings (`/settings`)**: Remove end-user preferences. Settings will now strictly be account/workspace settings for developers (billing, team members, webhooks).
- **Dual Messaging**: Your marketing pages (`/home`, `/features`) currently split focus between "Product 1: End User App" and "Product 2: Dev Platform". This entire narrative must change. The home page becomes a pure technical pitch: "The API for Accessibility."

### What gets enhanced (The new core):
- **The Developer Dashboard (`/developer-portal`)**: This becomes the *entire* logged-in application. It needs to be flawless.
  - **Logs & Tracing**: Developers need to see exactly what their API calls are doing. You'll need a "Logs" view showing request payloads, orchestration latency, and response bodies.
  - **Webhooks**: Like Resend, developers will want async processing for heavy tasks (e.g., video processing). Webhook management becomes a tier-1 feature.
  - **Playground**: A beautiful, interactive API explorer directly in the dashboard.
- **Documentation**: You will need a dedicated `/docs` site (often built with Mintlify or Nextra) containing SDK references, quickstarts, and integration guides.

---

## 2. Backend Architecture & Infrastructure Changes

Since you are now selling an API, **uptime, latency, and security** are your actual products.

### API Gateway & Edge Routing
- **Current**: Next.js App Router acting as the backend.
- **Change**: You may need to move your core `POST /v1/accessibility/assist` endpoint to the **Edge** (e.g., Cloudflare Workers or Vercel Edge Functions) for lowest possible latency before hitting your orchestration layer.
- **Global Distribution**: API requests should be routed to the region closest to the developer's servers.

### Authentication & Authorization
- **Current**: JWTs for users, simple API keys for apps.
- **Change**: Pure Bearer token authentication via API keys (`Authorization: Bearer aos_...`). You must implement robust key rolling, environment separation (Test vs. Live keys), and fine-grained scopes.
- **Rate Limiting**: Redis-based rate limiting becomes mission-critical. You must enforce strict token bucket limits per API key and return HTTP 429s with `Retry-After` headers.

### Data Storage & Retention
- **Current**: MongoDB for everything.
- **Change**: Since you are processing other companies' data, you must implement strict data retention policies. A `POST` request shouldn't store the user's data indefinitely. You might need a toggle for developers: `store_logs: boolean` (default false for privacy/HIPAA/SOC2 compliance).

### SDKs and Tooling
- You will need to build and maintain official SDKs for Node.js, Python, and Go.
  - *Example:* `import { AccessOS } from 'accessos'; const aos = new AccessOS('api_key'); aos.assist.create({...});`
- **Idempotency**: API calls that modify state or charge money need Idempotency Keys so developers can safely retry failed network requests.

---

## 3. Go-to-Market & Pricing Impact

- **Pricing Model**: Pure usage-based (per 1,000 requests or per compute second), identical to Stripe/Resend.
- **Onboarding**: A developer should be able to sign up, generate a key, and make a successful `curl` request in under 60 seconds. This is your primary North Star metric.

## Summary Checklist for the Pivot

1. [ ] **Frontend**: Delete `/companion` and `/settings` (consumer); expand `/developer-portal` to be the sole app.
2. [ ] **Marketing**: Rewrite `/home`, `/features`, and `/architecture` to speak only to developers.
3. [ ] **Backend**: Harden the API Key auth middleware (scopes, environments, fast Redis lookup).
4. [ ] **Backend**: Implement robust request logging/tracing so developers can debug their calls.
5. [ ] **Docs**: Create an SDK and a gorgeous documentation site.
