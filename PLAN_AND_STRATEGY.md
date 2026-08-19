# Plan and strategy (Brynier)

Date: 2026-05-23 (SAST)

This repo is now live on Vercel and working.

The goal from here is NOT “full SaaS architecture”.
The goal is a production-ready core: secure env handling, stable auth, stable data flows, and repeatable releases — with minimal/no UI/UX changes.

## What is already done (completed)

- Vercel production deploy works (https://brynier.vercel.app).
- Supabase client (frontend) uses ONLY `import.meta.env.VITE_*` vars (no secrets in browser).
- Supabase server pieces accept `SUPABASE_*` OR fall back to `VITE_*` names (so Vercel envs work).
- `/projects/new` now renders correctly (parent route renders `<Outlet />`), and the “+ New project” buttons navigate.
- Templates are “Free” and can be loaded from DB (`public.templates`) with a fallback to bundled templates.
- Backup export/import works again.
- Hydration mismatch warning noise reduced (extensions can inject body attrs).
- In-app AI assistant is removed/disabled for now; we use a safe external AI helper flow.

## Current product posture (how we should think about it)

- One codebase: web first.
- Make it production-stable on the web.
- Then make it installable (PWA).
- Only then wrap for desktop/mobile.

## Phase 1 — Production core stabilization (do next)

Note: We are not using Cloudflare for deployment.

1) Production backend (Supabase Cloud)
   - Create a Supabase Cloud project.
   - Apply migrations (tables + policies).
   - Verify RLS and storage buckets.

2) Environment separation and security
   - Frontend must only use `VITE_*` variables.
   - Server-only code may use secrets (service role, etc.) but must never leak into frontend imports.
   - Set Vercel env vars for Production + Preview + Development.

3) Release discipline
   - Protect the `production` branch.
   - Ensure Vercel is correctly connected to the GitHub repo and uses `production` as its Production Branch.

4) “Feels like a real product” hardening (no UI redesign)
   - Consistent loading + error handling.
   - Auth/session checks are consistent.
   - Rate limits / upload limits where needed.
   - Basic logging/analytics (even minimal).

## Phase 2 — PWA (bridge step before native)

- Add `manifest.json`, icons, and a service worker.
- Goal: installable on Android + desktop without maintaining separate native apps yet.

## Phase 3 — Desktop

- Recommended: Tauri (lighter than Electron).
- Wrap the existing web build.

## Phase 4 — Mobile

- Fastest: Capacitor wrapper around the PWA.
- More native: React Native (Expo) later, reusing the same backend/API boundaries.

## Non-goals (for now)

- No microservices.
- No multi-tenant abstraction layers.
- No heavy UI/UX redesign.