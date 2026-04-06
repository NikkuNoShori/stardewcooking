import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCollectionStore } from './useCollectionStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useCollectionSync() {
  const { user } = useAuth();
  const getAllChecked = useCollectionStore((s) => s.getAllChecked);
  const loadFromSupabase = useCollectionStore((s) => s.loadFromSupabase);

  // Subscribe to all checked maps for save triggers
  const recipeChecked = useCollectionStore((s) => s.recipeChecked);
  const ingredientsChecked = useCollectionStore((s) => s.ingredientsChecked);
  const bundleChecked = useCollectionStore((s) => s.bundleChecked);
  const fishChecked = useCollectionStore((s) => s.fishChecked);
  const museumChecked = useCollectionStore((s) => s.museumChecked);
  const shippingChecked = useCollectionStore((s) => s.shippingChecked);
  const craftingChecked = useCollectionStore((s) => s.craftingChecked);
  const walnutChecked = useCollectionStore((s) => s.walnutChecked);
  const stardropChecked = useCollectionStore((s) => s.stardropChecked);
  const secretNoteChecked = useCollectionStore((s) => s.secretNoteChecked);
  const journalScrapChecked = useCollectionStore((s) => s.journalScrapChecked);
  const fieldOfficeChecked = useCollectionStore((s) => s.fieldOfficeChecked);
  const monsterChecked = useCollectionStore((s) => s.monsterChecked);

  const debounceRef = useRef(null);
  const initialLoadDone = useRef(false);

  // Load from Supabase on login
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      initialLoadDone.current = false;
      return;
    }

    const loadProgress = async () => {
      const { data, error } = await supabase.rpc('get_collection_progress');

      if (!error && data && Object.keys(data).length > 0) {
        loadFromSupabase(data);
      } else if (!error) {
        // First time — push local state to DB
        await supabase.rpc('save_collection_progress', { p_data: getAllChecked() });
      }
      initialLoadDone.current = true;
    };

    loadProgress();
  }, [user]);

  // Debounced save on changes
  useEffect(() => {
    if (!user || !isSupabaseConfigured() || !initialLoadDone.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.rpc('save_collection_progress', { p_data: getAllChecked() });
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    recipeChecked, ingredientsChecked, bundleChecked,
    fishChecked, museumChecked, shippingChecked, craftingChecked,
    walnutChecked, stardropChecked, secretNoteChecked, journalScrapChecked,
    fieldOfficeChecked, monsterChecked, user,
  ]);
}
