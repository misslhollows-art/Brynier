ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS budget_allocated NUMERIC NOT NULL DEFAULT 0;

-- Give existing projects a useful starting budget without changing their estimate.
UPDATE public.projects
SET budget_allocated = COALESCE(estimated_cost, 0)
WHERE budget_allocated = 0;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_budget_allocated_nonnegative CHECK (budget_allocated >= 0);

ALTER TABLE public.components
  ADD COLUMN IF NOT EXISTS actual_unit_price NUMERIC,
  ADD COLUMN IF NOT EXISTS purchased BOOLEAN NOT NULL DEFAULT false,
  ADD CONSTRAINT components_actual_unit_price_nonnegative CHECK (actual_unit_price IS NULL OR actual_unit_price >= 0);
