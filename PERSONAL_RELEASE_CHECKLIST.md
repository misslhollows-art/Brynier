# Personal Release Checklist (TinkerTrack)

## Before You Rely On It

- Can sign up, sign in, sign out.
- Can create a project, edit title/description/tags/difficulty/cost.
- Can add components (including notes), add wiring notes, add journal entries.
- Can upload multiple files and delete them again.
- Project search finds by title/tags and by component name.
- AI assistant answers with project context and keeps working across multiple messages.

## Backup / Recovery

- Download a backup JSON from `/backup`.
- Confirm the JSON contains your projects/components/journal/files/ai_messages.
- Keep at least one backup copy outside the device (cloud drive or external disk).

## Quick Health Checks

- Check Supabase Storage bucket `project-media` is accessible.
- Check `LOVABLE_API_KEY` is set (AI chat).
- Check `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set.

