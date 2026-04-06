-- ============================================
-- Collection progress: one row per user
-- Stores all collection tracker checked states
-- (Fish, Museum, Shipping, Crafting, Walnuts,
--  Stardrops, Secret Notes, Journal Scraps,
--  Field Office, Monster Goals)
-- ============================================

CREATE TABLE IF NOT EXISTS public.collection_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fish_checked JSONB NOT NULL DEFAULT '{}',
  museum_checked JSONB NOT NULL DEFAULT '{}',
  shipping_checked JSONB NOT NULL DEFAULT '{}',
  crafting_checked JSONB NOT NULL DEFAULT '{}',
  walnut_checked JSONB NOT NULL DEFAULT '{}',
  stardrop_checked JSONB NOT NULL DEFAULT '{}',
  secret_note_checked JSONB NOT NULL DEFAULT '{}',
  journal_scrap_checked JSONB NOT NULL DEFAULT '{}',
  field_office_checked JSONB NOT NULL DEFAULT '{}',
  monster_checked JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.collection_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON public.collection_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own" ON public.collection_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON public.collection_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Get all collection progress for the calling user
CREATE OR REPLACE FUNCTION public.get_collection_progress()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'fishChecked',         COALESCE(fish_checked, '{}'::jsonb),
      'museumChecked',       COALESCE(museum_checked, '{}'::jsonb),
      'shippingChecked',     COALESCE(shipping_checked, '{}'::jsonb),
      'craftingChecked',     COALESCE(crafting_checked, '{}'::jsonb),
      'walnutChecked',       COALESCE(walnut_checked, '{}'::jsonb),
      'stardropChecked',     COALESCE(stardrop_checked, '{}'::jsonb),
      'secretNoteChecked',   COALESCE(secret_note_checked, '{}'::jsonb),
      'journalScrapChecked', COALESCE(journal_scrap_checked, '{}'::jsonb),
      'fieldOfficeChecked',  COALESCE(field_office_checked, '{}'::jsonb),
      'monsterChecked',      COALESCE(monster_checked, '{}'::jsonb)
    )
    FROM collection_progress
    WHERE user_id = auth.uid()),
    '{}'::jsonb
  );
$$;

-- Upsert all collection progress for the calling user
CREATE OR REPLACE FUNCTION public.save_collection_progress(p_data JSONB)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO collection_progress (
    user_id,
    fish_checked,
    museum_checked,
    shipping_checked,
    crafting_checked,
    walnut_checked,
    stardrop_checked,
    secret_note_checked,
    journal_scrap_checked,
    field_office_checked,
    monster_checked,
    updated_at
  ) VALUES (
    auth.uid(),
    COALESCE(p_data->'fishChecked',         '{}'::jsonb),
    COALESCE(p_data->'museumChecked',       '{}'::jsonb),
    COALESCE(p_data->'shippingChecked',     '{}'::jsonb),
    COALESCE(p_data->'craftingChecked',     '{}'::jsonb),
    COALESCE(p_data->'walnutChecked',       '{}'::jsonb),
    COALESCE(p_data->'stardropChecked',     '{}'::jsonb),
    COALESCE(p_data->'secretNoteChecked',   '{}'::jsonb),
    COALESCE(p_data->'journalScrapChecked', '{}'::jsonb),
    COALESCE(p_data->'fieldOfficeChecked',  '{}'::jsonb),
    COALESCE(p_data->'monsterChecked',      '{}'::jsonb),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    fish_checked         = COALESCE(p_data->'fishChecked',         collection_progress.fish_checked),
    museum_checked       = COALESCE(p_data->'museumChecked',       collection_progress.museum_checked),
    shipping_checked     = COALESCE(p_data->'shippingChecked',     collection_progress.shipping_checked),
    crafting_checked     = COALESCE(p_data->'craftingChecked',     collection_progress.crafting_checked),
    walnut_checked       = COALESCE(p_data->'walnutChecked',       collection_progress.walnut_checked),
    stardrop_checked     = COALESCE(p_data->'stardropChecked',     collection_progress.stardrop_checked),
    secret_note_checked  = COALESCE(p_data->'secretNoteChecked',   collection_progress.secret_note_checked),
    journal_scrap_checked = COALESCE(p_data->'journalScrapChecked', collection_progress.journal_scrap_checked),
    field_office_checked = COALESCE(p_data->'fieldOfficeChecked',  collection_progress.field_office_checked),
    monster_checked      = COALESCE(p_data->'monsterChecked',      collection_progress.monster_checked),
    updated_at           = now();
END;
$$;
