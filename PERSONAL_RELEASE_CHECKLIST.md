# Personal Release Checklist (TinkerTrack)

## Before You Rely On It

- Can sign up, sign in, sign out.
- Can create a project (wizard) and edit title/description/tags/difficulty/cost.
- Can add components (including notes), add wiring notes, add journal entries.
- Can upload multiple files and delete them again.
- Project search finds by title/tags and by component name.
- Templates show as free and can prefill `/projects/new`.
- AI in-app assistant is currently disabled; external AI flow works (copy build context and open ChatGPT/Gemini).

## Backup / Recovery

- Download a backup ZIP from `/backup`.
- Confirm it contains projects/components/journal/files/ai_messages.
- Restore from a backup ZIP and confirm data comes back.
- Keep at least one backup copy outside the device (cloud drive or external disk).

## Quick Health Checks

- Check Supabase Storage bucket `project-media` is accessible.
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set.
- If using templates from DB in local dev: run Supabase migrations so `public.templates` exists.

Notes:
- Hydration mismatch warnings are commonly caused by browser extensions. We suppress the noisy warning on `<body>`, but still verify in a clean browser profile if needed.