-- Templates (curated + user-owned)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  difficulty TEXT DEFAULT 'beginner',
  tags TEXT[] DEFAULT '{}',
  estimated_cost NUMERIC DEFAULT 0,
  components JSONB NOT NULL DEFAULT '[]'::jsonb,
  wiring_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Visible: curated (owner_user_id is null) + your own
DROP POLICY IF EXISTS "templates_select_visible" ON public.templates;
CREATE POLICY "templates_select_visible" ON public.templates
  FOR SELECT
  USING (owner_user_id IS NULL OR owner_user_id = auth.uid());

-- Users can only create/update/delete their own templates
DROP POLICY IF EXISTS "templates_insert_own" ON public.templates;
CREATE POLICY "templates_insert_own" ON public.templates
  FOR INSERT
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "templates_update_own" ON public.templates;
CREATE POLICY "templates_update_own" ON public.templates
  FOR UPDATE
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "templates_delete_own" ON public.templates;
CREATE POLICY "templates_delete_own" ON public.templates
  FOR DELETE
  USING (owner_user_id = auth.uid());

CREATE INDEX IF NOT EXISTS templates_owner_idx ON public.templates(owner_user_id, created_at DESC);