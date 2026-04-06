-- ============================================
-- Add ingredients_checked column to recipe_progress
-- (the frontend saves this but the column may be missing)
-- ============================================

ALTER TABLE public.recipe_progress
  ADD COLUMN IF NOT EXISTS ingredients_checked JSONB NOT NULL DEFAULT '{}';

-- Update save_progress to handle ingredients_checked
CREATE OR REPLACE FUNCTION public.save_progress(
  p_checked JSONB,
  p_ingredients_checked JSONB DEFAULT '{}'
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO recipe_progress (user_id, checked, ingredients_checked, updated_at)
  VALUES (auth.uid(), p_checked, p_ingredients_checked, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    checked = EXCLUDED.checked,
    ingredients_checked = EXCLUDED.ingredients_checked,
    updated_at = EXCLUDED.updated_at;
$$;

-- Update get_progress to return ingredients_checked too
CREATE OR REPLACE FUNCTION public.get_progress()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'checked', COALESCE(checked, '{}'::jsonb),
      'ingredients_checked', COALESCE(ingredients_checked, '{}'::jsonb)
    )
    FROM recipe_progress
    WHERE user_id = auth.uid()),
    '{}'::jsonb
  );
$$;
