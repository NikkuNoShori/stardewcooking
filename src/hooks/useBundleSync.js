import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBundleStore } from './useBundleStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useBundleSync() {
  const { user } = useAuth();
  const bundleChecked = useBundleStore((s) => s.bundleChecked);
  const loadBundlesFromSupabase = useBundleStore((s) => s.loadBundlesFromSupabase);
  const debounceRef = useRef(null);
  const initialLoadDone = useRef(false);

  // Load from Supabase on login
  useEffect(() => {
    if (!user || !isSupabaseConfigured()) {
      initialLoadDone.current = false;
      return;
    }

    const loadProgress = async () => {
      const { data, error } = await supabase.rpc('get_bundle_progress');

      if (!error && data && Object.keys(data).length > 0) {
        loadBundlesFromSupabase(data);
      } else if (!error) {
        await supabase.rpc('save_bundle_progress', { p_checked: bundleChecked });
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
      await supabase.rpc('save_bundle_progress', { p_checked: bundleChecked });
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [bundleChecked, user]);
}
