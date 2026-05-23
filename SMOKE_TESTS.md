# Smoke Tests (Personal MVP)

Use this list after changes to make sure the main flows still work.

## Auth
- Sign up
- Login
- Session/auth working

## Projects
- Open `/projects` and click `New project`.
- Create a project using the wizard (all 4 steps).
- Verify the project shows on Dashboard and Projects list.
- Change project status (idea/building/testing/completed/failed).

## Components / Wiring / Journal
- Add a component (including notes and purchase link).
- Edit that component and save.
- Add wiring notes and confirm they persist.
- Add a journal entry and delete it.

## Files
- Upload multiple files in one go (photo + code/text).
- Filter by `media` and `code`.
- Preview a code file in-app.
- Delete an uploaded file.

## Templates
- Open `/templates`.
- Confirm template cards do not show a $ price (templates should be free).
- Click `Use template` and confirm it goes to `/projects/new?template=...` and pre-fills the wizard.

## AI (external only for now)
- Go to a project, open the `AI` tab.
- Click `Copy build context`.
- Open ChatGPT or Gemini and paste the copied context.

## Backup
- Go to `/backup` and download a backup ZIP.
- Restore from a previously exported ZIP.
- Confirm it restores projects/components/journal/files/ai_messages.