# Immediate next steps (Brynier)

Date: 2026-05-23 (SAST)

Status: complete.

## Completed (done)

- [x] Remove “Powered by Lovable Cloud” from the landing page footer.
- [x] Switch Google sign-in on `/login` and `/signup` to Supabase OAuth (no Lovable auth).
- [x] Add branch protection for `production` (PR required, no force push, no deletion).
- [x] Set Vercel environment variables.
- [x] Redeploy production after env changes.
- [x] Run a smoke test on production (passed).
- [x] Supabase Cloud is set up and working in production (migrations/RLS/storage verified).
- [x] Review `npm audit` output and choose what to fix vs defer.

Notes:
- Browser-extension console warnings (chext/clickup etc.) are not app bugs.

## What’s next (recommended)

### Phase 2 — PWA (installable app)

Goal: make the web app installable on Android/desktop before doing native apps.

Next tasks:
- Add `manifest.webmanifest` (name, icons, theme colors).
- Add proper app icons (192/512 + maskable).
- Add a service worker (cache the app shell).
- Verify install prompt + basic offline “shell” behavior.

### Phase 3 — Desktop/mobile wrappers (later)

- Desktop: Tauri.
- Mobile: Capacitor (fastest) or React Native (more native).