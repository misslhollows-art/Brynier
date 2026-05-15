-- Enforcement constraints for the MVP schema (Render/Postgres)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
    CREATE TYPE project_status AS ENUM ('idea', 'building', 'testing', 'completed', 'failed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_difficulty') THEN
    CREATE TYPE project_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_file_type') THEN
    CREATE TYPE project_file_type AS ENUM ('media', 'code');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_media_type') THEN
    CREATE TYPE project_media_type AS ENUM ('photo', 'video', 'screenshot');
  END IF;
END $$;

-- Cast columns to enums where possible (safe if current values match)
ALTER TABLE projects
  ALTER COLUMN status TYPE project_status USING status::project_status,
  ALTER COLUMN difficulty TYPE project_difficulty USING difficulty::project_difficulty;

ALTER TABLE project_files
  ALTER COLUMN file_type TYPE project_file_type USING file_type::project_file_type;

ALTER TABLE project_media
  ALTER COLUMN media_type TYPE project_media_type USING media_type::project_media_type;

-- Basic sanity constraints
ALTER TABLE components
  ADD CONSTRAINT components_quantity_positive CHECK (quantity >= 1);

ALTER TABLE projects
  ADD CONSTRAINT projects_estimated_cost_nonnegative CHECK (estimated_cost >= 0);

