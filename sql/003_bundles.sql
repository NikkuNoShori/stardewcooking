-- ============================================
-- 003_bundles.sql — Community Center Tables & RPCs
-- ============================================

-- Bundle progress: one row per user
CREATE TABLE IF NOT EXISTS public.bundle_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  checked JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bundle_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON public.bundle_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own" ON public.bundle_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON public.bundle_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Get the calling user's bundle progress
CREATE OR REPLACE FUNCTION public.get_bundle_progress()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT checked FROM bundle_progress WHERE user_id = auth.uid()),
    '{}'::jsonb
  );
$$;

-- Upsert the calling user's bundle progress
CREATE OR REPLACE FUNCTION public.save_bundle_progress(p_checked JSONB)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO bundle_progress (user_id, checked, updated_at)
  VALUES (auth.uid(), p_checked, now())
  ON CONFLICT (user_id)
  DO UPDATE SET checked = EXCLUDED.checked, updated_at = EXCLUDED.updated_at;
$$;
