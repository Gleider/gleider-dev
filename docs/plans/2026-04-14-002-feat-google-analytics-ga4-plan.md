---
title: "feat: Integrate Google Analytics 4 (GA4)"
type: feat
status: active
date: 2026-04-14
---

# feat: Integrate Google Analytics 4 (GA4)

## Overview

Add Google Analytics 4 tracking to gleider.dev to collect pageview and engagement metrics. The GA4 measurement ID is stored as an environment variable so each environment (local, production) can use its own property. The script loads only when the measurement ID is present, making it safe for development.

## Problem Frame

The site has no analytics — there's no visibility into how many people visit, which pages are popular, or where traffic comes from. GA4 provides this for free with minimal integration effort and scales naturally as new projects are added in the future.

## Requirements Trace

- R1. GA4 script loads on every public page
- R2. Measurement ID is not hardcoded — stored in environment variable
- R3. Script does not load when measurement ID is absent (local dev by default)
- R4. Production deployment passes the measurement ID to the web container
- R5. No impact on page load performance (script loads after interactive)

## Scope Boundaries

- No custom event tracking (can be added later)
- No server-side analytics or GA4 API integration
- No admin dashboard for analytics (user accesses analytics.google.com directly)
- No cookie consent banner (site is personal, can be added later if needed)

## Context & Research

### Relevant Code and Patterns

- `apps/web/app/layout.tsx` — root layout, no existing Script imports or third-party tags
- `apps/web/next.config.ts` — minimal config with `output: 'standalone'`
- `.env.example` — uses `NEXT_PUBLIC_` prefix for client-exposed vars
- `.github/workflows/deploy.yml` — deploy workflow already creates `.env` on EC2 with secrets
- `docker-compose.yml` — web service environment section needs the new var

### Institutional Learnings

No prior analytics-related learnings documented.

## Key Technical Decisions

- **`next/script` with `afterInteractive` strategy**: Loads GA4 after the page is interactive, avoiding any impact on First Contentful Paint or LCP. This is the standard Next.js approach for third-party analytics scripts.
- **Conditional rendering**: Only render the Script tags when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. This keeps local dev clean without needing a separate config.
- **Environment variable, not hardcoded**: The measurement ID varies per environment and should not be in source code.

## Implementation Units

- [ ] **Unit 1: Add GA4 script to root layout**

**Goal:** Load the GA4 gtag.js script on every page via the root layout.

**Requirements:** R1, R2, R3, R5

**Dependencies:** None

**Files:**
- Modify: `apps/web/app/layout.tsx`

**Approach:**
- Import `Script` from `next/script`
- Read `process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Conditionally render two `<Script>` tags inside the body (after the main content, before closing `</body>`):
  - External gtag.js loader with `strategy="afterInteractive"`
  - Inline init script with `strategy="afterInteractive"` that calls `gtag('config', measurementId)`
- Wrap in a conditional so nothing renders when the env var is absent

**Patterns to follow:**
- `apps/web/app/layout.tsx` — existing layout structure with metadata export

**Test scenarios:**
- Happy path: When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set, the two Script tags are present in the rendered HTML
- Edge case: When `NEXT_PUBLIC_GA_MEASUREMENT_ID` is undefined or empty, no Script tags are rendered
- Happy path: Script uses `afterInteractive` strategy (verified by inspecting component props)

**Verification:**
- `pnpm --filter @gleider-dev/web build` succeeds
- Running locally without the env var shows no GA script in the page source
- Running locally with the env var shows the gtag.js script loading

- [ ] **Unit 2: Configure environment variables for production**

**Goal:** Ensure the GA4 measurement ID reaches the production web container.

**Requirements:** R2, R4

**Dependencies:** Unit 1

**Files:**
- Modify: `.github/workflows/deploy.yml`
- Modify: `docker-compose.yml`

**Approach:**
- Add `GA_MEASUREMENT_ID` to GitHub Actions secrets
- Pass it through the deploy workflow's `.env` file creation as `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Add `NEXT_PUBLIC_GA_MEASUREMENT_ID: ${NEXT_PUBLIC_GA_MEASUREMENT_ID}` to the web service's `environment` in `docker-compose.yml`
- Note: Since this is a `NEXT_PUBLIC_` var, it needs to be available at **build time** in the Docker build, not just runtime. The Dockerfile `ARG`/`ENV` or the docker-compose `build.args` must pass it during `next build`.

**Patterns to follow:**
- `.github/workflows/deploy.yml` — existing pattern for passing secrets via `envs` and `.env` file
- `docker-compose.yml` — existing `environment` section on web service

**Test scenarios:**
- Test expectation: none — infrastructure configuration, verified by deployment

**Verification:**
- After deploy, viewing page source on gleider.dev shows the gtag.js script with the correct measurement ID
- Google Analytics real-time dashboard shows the visit

## System-Wide Impact

- **Interaction graph:** Script tags are added to the root layout — affects all public pages. No interaction with admin routes beyond normal page loads.
- **Error propagation:** If GA4 script fails to load (CDN down), it has no effect on site functionality — gtag.js is a fire-and-forget external script.
- **State lifecycle risks:** None — no server-side state involved.
- **API surface parity:** N/A
- **Integration coverage:** Verified manually by checking page source and GA4 real-time dashboard.
- **Unchanged invariants:** No existing functionality is modified. The layout structure, metadata, Header/Footer components remain the same.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `NEXT_PUBLIC_` var needs build-time availability in Docker | Pass as `ARG` in Dockerfile or ensure `.env` is present during `docker build` |
| GA4 property not created yet | User must create a GA4 property at analytics.google.com and get the measurement ID (G-XXXXXXXXXX) before deploying |

## Documentation / Operational Notes

- User needs to create a GA4 property at [analytics.google.com](https://analytics.google.com) before deploying
- Add `GA_MEASUREMENT_ID` to GitHub Actions secrets
- The measurement ID format is `G-XXXXXXXXXX`

## Sources & References

- Related plan: `docs/plans/2026-04-14-001-feat-admin-dashboard-projects-plan.md`
