# Immediate next steps (Brynier)

Date: 2026-05-23 (SAST)

This is the short list to finish the production-ready core.
No UI/UX redesign — only safe, necessary changes.

## P0 — Cleanup already completed

- [x] Remove “Powered by Lovable Cloud” from the landing page footer.
- [x] Switch Google sign-in on `/login` and `/signup` to Supabase OAuth (no Lovable auth).

Notes:
- You may still see console logs from browser extensions (chext/clickup etc.). Those are not app bugs.

## P0 — Vercel + GitHub stability (manual)

1) Branch protection
   - GitHub → Settings → Branches
   - Add a protection rule for `production`:
     - Require pull request before merging
     - Prevent force pushes
     - Prevent deletion

2) Connect GitHub repo to Vercel
   - Vercel → Project `brynier` → Settings → Git
   - Connect repository: `misslhollows-art/Brynier`
   - Set Production Branch = `production`

## P0 — Environment variables (must be correct)

Set these in Vercel for Production + Preview + Development:

Client-safe (required):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Server-only (only if you use admin/service-role server functions):
- `SUPABASE_SERVICE_ROLE_KEY`

Rules:
- Frontend code must ONLY use `VITE_*`.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## P1 — Production Supabase (Cloud)

1) Create Supabase Cloud project.
2) Apply migrations.
3) Verify:
   - Auth works (email + Google if enabled)
   - RLS is correct
   - Storage buckets exist and rules are correct

## P1 — Smoke test (run after each production change)

Auth
- Sign up
- Login
- Logout
- Refresh page: session still works

Projects
- Open `/projects`
- Click “New project”
- Complete wizard and create a project
- Project shows on Dashboard + Projects list

Components / Wiring / Journal
- Add/edit a component
- Add wiring notes
- Add/delete a journal entry

Files
- Upload multiple files
- Preview code file
- Delete an uploaded file

Templates
- Open `/templates`
- Use a template → `/projects/new?template=...` should prefill

Backup
- Export a backup ZIP
- Restore from that ZIP

AI
- External-only for now (copy build context, open ChatGPT/Gemini)

## P2 — Code health (optional)

- [x] Remove unused Lovable integration code (Lovable auth + AI gateway).
- [ ] Run `npm audit` and decide what to fix vs. defer.