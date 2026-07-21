# Production Implementation Master Prompt

## Role

You are a **Senior Staff Software Engineer**.

Refactor my entire project into production-quality code.

-   Do **NOT** use placeholders.
-   Do **NOT** leave TODOs.
-   Everything should be fully functional.
-   Follow clean architecture, SOLID principles, reusable components,
    and production-grade engineering practices.

------------------------------------------------------------------------

# 1. API Architecture

Create a dedicated service layer.

``` text
services/
    api.ts
    auth.ts
    projects.ts
    metrics.ts
    speech.ts
    sign.ts
    trajectory.ts
```

-   Every request must go through this layer.
-   Never call `fetch()` directly inside UI components.
-   Add centralized request handling, interceptors, authentication,
    retries, caching, logging, and error handling.

------------------------------------------------------------------------

# 2. API Key Management

My API keys currently fail.

Implement:

-   API key validation
-   Automatic retries
-   Timeout handling
-   Rate-limit handling
-   Centralized error logging
-   Graceful fallback

If an API key is invalid, automatically switch to **Demo Mode**.

The UI must never crash.

Display:

``` text
Running in Demo Mode
```

instead of breaking.

------------------------------------------------------------------------

# 3. Copy API Key

Implement:

-   Copy API Key button
-   Copy to clipboard
-   Success toast
-   Animated check icon
-   Hidden key by default
-   Reveal/Hide API key

------------------------------------------------------------------------

# 4. Generate Project

Create a **Generate Project** workflow.

It should:

-   Generate project ID
-   Store creation timestamp
-   Associate project owner
-   Create default configuration
-   Save everything in the database

If generation fails:

-   Roll back the transaction
-   Display an informative error

------------------------------------------------------------------------

# 5. Fix Project Saving

Projects currently are not saved.

Find and fix:

-   Frontend request
-   Backend endpoint
-   Validation
-   Database schema
-   Transaction handling
-   Optimistic UI updates

Refreshing the page must retain the project.

------------------------------------------------------------------------

# 6. Overview Dashboard

Replace all static cards.

Create live system monitoring.

Cards:

-   CPU Usage
-   RAM Usage
-   Disk Usage
-   Network Usage
-   GPU Usage
-   API Calls
-   Response Time
-   Active Sessions
-   Projects
-   Storage

Refresh metrics every 5 seconds.

Include loading skeletons and smooth animations.

------------------------------------------------------------------------

# 7. Analytics

Replace fake graphs.

Implement:

-   Line Charts
-   Area Charts
-   Bar Charts
-   Pie Charts
-   Heatmaps

Support:

-   Hover
-   Zoom
-   Smooth transitions

------------------------------------------------------------------------

# 8. Welcome Section

Replace:

``` text
Hello User
```

with:

``` text
Hello {first_name}
```

Retrieve the first name from the authenticated user.

Fallback:

``` text
Hello there
```

------------------------------------------------------------------------

# 9. Delete Account

Implement fully.

Require typing:

``` text
DELETE
```

before enabling deletion.

Delete:

-   Database record
-   Projects
-   Tokens
-   Sessions
-   Cache

Redirect to Login.

------------------------------------------------------------------------

# 10. Remove Unused Features

Completely remove:

-   Profile page
-   2FA page
-   Routes
-   Navigation links
-   APIs
-   Dead code
-   Unused components

------------------------------------------------------------------------

# 11. Planned Features

Convert static Planned cards into working features.

## Real-Time Audio TTS

Create provider abstraction.

Support:

-   OpenAI
-   ElevenLabs
-   Azure
-   Google

Automatic fallback.

If no valid API key exists:

Return realistic demo responses.

Support:

-   Streaming
-   Pause
-   Resume
-   Download Audio
-   Latency Indicator

------------------------------------------------------------------------

## Video Spatial Trajectory

Create endpoint:

``` http
POST /trajectory
```

Input:

-   Video

Output:

-   Trajectory
-   Bounding Boxes
-   Motion Vectors
-   Tracking Confidence

Display an interactive overlay.

------------------------------------------------------------------------

## Multilingual Sign Avatar

Pipeline:

Camera

↓

Hand Detection

↓

Pose Detection

↓

Landmarks

↓

Gesture Recognition

↓

Sentence Generation

↓

Avatar Animation

Support:

-   English
-   Hindi
-   ASL
-   ISL

Prefer local inference when APIs are unavailable.

------------------------------------------------------------------------

# 12. Sign Recognition

Replace placeholders.

Implement:

Camera

↓

MediaPipe Hands

↓

Gesture Classifier

↓

Sentence Prediction

↓

Speech

↓

Avatar

Display:

-   Confidence Score
-   FPS

------------------------------------------------------------------------

# 13. Error Handling

Every API must support:

-   Retry
-   Loading State
-   Empty State
-   Offline Mode
-   Timeout
-   Error Boundary
-   Logging

------------------------------------------------------------------------

# 14. Database

Audit the entire schema.

Fix:

-   Missing foreign keys
-   Duplicate projects
-   Save failures
-   Cascade deletes
-   Indexes
-   Validation

------------------------------------------------------------------------

# 15. UI

Create a premium SaaS experience.

Requirements:

-   Glassmorphism
-   Smooth animations
-   Dark Mode
-   Responsive
-   Accessible
-   Professional spacing
-   No layout bugs

------------------------------------------------------------------------

# 16. Code Quality

Refactor the entire codebase.

Requirements:

-   No duplicate code
-   Reusable hooks
-   Reusable services
-   Strict typing
-   Environment variables
-   No hardcoded URLs
-   Modular folder structure

------------------------------------------------------------------------

# 17. Deliverables

Return:

-   Every modified file
-   Explanation of changes
-   Database migrations
-   API endpoints
-   Frontend changes
-   Backend changes
-   Testing instructions
-   Performance improvements

Do not stop until every feature works end-to-end.

------------------------------------------------------------------------

# API Fallback Strategy

Since my current API keys are unreliable:

## Text-to-Speech

Priority:

1.  OpenAI
2.  ElevenLabs
3.  Azure
4.  Google
5.  Demo Mode

------------------------------------------------------------------------

## Sign Recognition

Prefer:

-   MediaPipe (local)
-   Optional AI API for language translation

------------------------------------------------------------------------

## Trajectory Tracking

Prefer:

-   MediaPipe
-   OpenCV

Use cloud APIs only as optional enhancements.

The application should remain fully functional even when third-party
APIs are unavailable.
