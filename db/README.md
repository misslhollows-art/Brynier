# Database Scripts (Render/Postgres)

These scripts align the DB design to the MVP doc and add enforcement constraints.

Recommended run order:
1. `db/01_schema.sql`
2. `db/02_constraints.sql`

Notes:
- Designed for a simple personal deployment.
- Uses Postgres enums and constraints to prevent invalid statuses/difficulties.
- Uses `project_media` as a separate table (matches the design doc).

