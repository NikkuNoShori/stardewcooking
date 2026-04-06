import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRecipeStore } from './useRecipeStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useSupabaseSync() {
  const { user } = useAuth();
  const checked = useRecipeStore((s) => s.checked);
  const ingredientsChecked = useRecipeStore((s) => s.ingredientsChecked);
  const loadFromSupabase = useRecipeStore((s) => s.loadFromSupabase);
  const debounceRef = useRef(null);
  const initialLoadDone = useRef(false);

  // Load user progress from Supabase on login — DB is source of truth
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      initialLoadDone.current = false;
      return;
    }

    const loadProgress = async () => {
      const { data, error } = await supabase.rpc('get_progress');

      if (!error && data) {
        // Always load from DB — even if empty (means user hasn't checked anything yet)
        loadFromSupabase(data);
      }
      initialLoadDone.current = true;
    };

    loadProgress();
  }, [user]);

  // Debounced save to Supabase on changes
  useEffect(() => {
    if (!user || !isSupabaseConfigured() || !initialLoadDone.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      await supabase.rpc('save_progress', {
        p_checked: checked,
        p_ingredients_checked: ingredientsChecked,
      });
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [checked, ingredientsChecked, user]);
}
