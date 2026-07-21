# AccessOS AI -- Complete Product Transformation Specification

## Vision

Transform the existing repository into a **developer-first AI API
platform** inspired by the UX of Resend (layout, spacing, typography,
dashboard quality, documentation experience, dark theme), while keeping
AccessOS AI branding.

## Public Website

### Navigation (Not Logged In)

-   Home
-   Features
-   Documentation
-   Playground
-   About Us
-   Get API Key
-   Login
-   Sign Up

> Do **not** show the Developer Dashboard before login.

### Navigation (Logged In)

-   Home
-   Features
-   Documentation
-   Playground
-   About Us
-   Dashboard
-   Profile Avatar

Login & Sign Up disappear after authentication.

------------------------------------------------------------------------

# Authentication

Keep: - Developer Signup - Developer Login - Forgot Password - Reset
Password - Email Verification - Logout

Remove: - End User accounts - End User dashboard - Role selection -
Accessibility dashboard - Companion UI

------------------------------------------------------------------------

# Home Page

Include: - Hero - Announcement badge - Large heading - Short
description - Interactive code snippet - Get API Key CTA - Documentation
CTA - Trusted by Developers - API showcase - Security - Rate Limiting -
Footer

Get API Key: - Logged out → Login/Signup - Logged in → Developer
Dashboard

------------------------------------------------------------------------

# Features

Every API must have an interactive live demo.

Each API includes: - Description - Request example - Response example -
Upload/input - Live result - Loading state - Success state - Copy
response - Documentation button

Examples: - OCR - Vision - Accessibility - Text Simplification - Sign
Language

Future APIs: Coming Soon.

------------------------------------------------------------------------

# Documentation

Resend-style docs.

Sections: - Introduction - Authentication - Quick Start - Errors - Rate
Limits - API Reference - SDKs - Versioning - Changelog

Every API includes: - Endpoint - Method - Headers - Parameters -
Request - Response - Status Codes

Languages: JavaScript, TypeScript, Node.js, React, Next.js, Angular,
Vue, Express, Python, Go, Java, C#, PHP, Ruby, Rust, Kotlin, Swift,
cURL.

Each snippet has syntax highlighting and Copy button.

------------------------------------------------------------------------

# Playground

Public page.

Features: - API Key input - Endpoint selector - Request editor - Execute
request - JSON response - Latency - Headers - History - Copy response

------------------------------------------------------------------------

# About Us

Include: - Mission - Vision - Why AccessOS AI - Our APIs - Technology -
Security & Privacy - Team placeholders - Contact - FAQ

------------------------------------------------------------------------

# Developer Dashboard (Protected)

Visible **only after login**.

Protected routes: - /dashboard - /dashboard/projects -
/dashboard/projects/:projectId - /dashboard/settings -
/dashboard/profile

Redirect unauthenticated users to Login.

## Sidebar

-   Overview
-   Projects
-   Settings
-   Profile

------------------------------------------------------------------------

# Projects

Projects own API Keys, Logs, Webhooks and Metrics.

Project list: - Name - Description - Environment - Status - Total
Requests - API Key Count - Created - Updated

Actions: - New Project - Open - Edit - Delete

------------------------------------------------------------------------

# Project Workspace

Tabs: - Overview - API Keys - Logs - Webhooks - Metrics

## API Keys

-   Generate API Key
-   Rotate
-   Revoke
-   Rename
-   Copy
-   Last Used
-   Usage
-   Rate Limits

Display: - Masked Key - Environment - Created - Last Used - Status -
Requests Today - Total Requests

## Logs

-   Timestamp
-   Endpoint
-   Method
-   Status
-   Latency
-   API Key
-   Project
-   Errors

Filters: - Date - Endpoint - Project - Status

## Webhooks

-   Create/Edit/Delete
-   Enable/Disable
-   Secret
-   Retry policy
-   Delivery history

## Metrics

-   Requests Today
-   Weekly
-   Monthly
-   Success Rate
-   Error Rate
-   Average Latency
-   Top Endpoints
-   Usage by Project
-   Rate Limit Usage

------------------------------------------------------------------------

# Settings

-   Profile
-   Company
-   Password
-   Email Verification
-   Notifications
-   Theme
-   API Preferences
-   Delete Account
-   Future-ready 2FA

------------------------------------------------------------------------

# Backend

Remove: - End User system - Roles - Pricing - Billing - Plans -
Checkout - Application model

Keep: - JWT - Developer accounts - Password reset - Email verification -
API Keys - Usage - Rate limiting

API Keys belong directly to Projects.

Routes:

``` text
POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/refresh

GET /developer/profile
PUT /developer/profile

GET /projects
POST /projects
PUT /projects/:id
DELETE /projects/:id

GET /projects/:id/api-keys
POST /projects/:id/api-keys
POST /projects/:id/api-keys/:keyId/rotate
DELETE /projects/:id/api-keys/:keyId

GET /projects/:id/logs
GET /projects/:id/webhooks
POST /projects/:id/webhooks
GET /projects/:id/metrics

POST /ocr
POST /vision
POST /simplify
POST /accessibility
POST /sign-language

POST /demo/ocr
POST /demo/vision
POST /demo/accessibility
POST /demo/simplify
POST /demo/sign-language
```

------------------------------------------------------------------------

# Database

Collections/Tables: - Developer - Project - APIKey - Usage -
RequestLog - Webhook

Remove: - Plans - Billing - Applications

------------------------------------------------------------------------

# UI

Follow Resend's design language: - Dark theme - Premium typography -
Smooth animations - Rounded cards - Sticky navbar - Beautiful
documentation - Responsive - Accessible - Production-ready
