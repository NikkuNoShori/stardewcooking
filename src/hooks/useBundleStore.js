import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useBundleStore = create(
  persist(
    (set, get) => ({
      // Bundle item completion: keyed by "roomKey:bundleName:itemName" -> boolean
      bundleChecked: {},

      // UI state
      activeRoom: 'crafts',
      seasonFilter: 'all',       // 'all' | 'Spring' | 'Summer' | 'Fall' | 'Winter'
      categoryFilter: 'all',     // 'all' | 'Farming' | 'Foraging' | etc.
      bundleSearch: '',
      collapsedBundles: {},      // keyed by "roomKey:bundleName" -> boolean

      // Actions
      toggleBundleItem: (roomKey, bundleName, itemName) => set((state) => {
        const key = `${roomKey}:${bundleName}:${itemName}`;
        const next = { ...state.bundleChecked };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = true;
        }
        return { bundleChecked: next };
      }),

      setActiveRoom: (room) => set({ activeRoom: room }),
      setSeasonFilter: (season) => set({ seasonFilter: season }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setBundleSearch: (query) => set({ bundleSearch: query }),

      toggleBundleCollapse: (roomKey, bundleName, defaultCollapsed) => set((state) => {
        const key = `${roomKey}:${bundleName}`;
        const current = state.collapsedBundles[key] ?? defaultCollapsed;
        return { collapsedBundles: { ...state.collapsedBundles, [key]: !current } };
      }),

      resetBundles: () => set({ bundleChecked: {} }),

      // Supabase sync
      loadBundlesFromSupabase: (data) => set({ bundleChecked: data }),

      // Derived helpers
      getBundleProgress: (roomKey, bundleName, items, pick) => {
        const state = get();
        const done = items.filter((item) =>
          !!state.bundleChecked[`${roomKey}:${bundleName}:${item[0]}`]
        ).length;
        const needed = pick || items.length;
        return { done, needed, complete: done >= needed };
      },

      getRoomProgress: (room) => {
        const state = get();
        let completed = 0;
        room.bundles.forEach((bundle) => {
          const needed = bundle.pick || bundle.items.length;
          const done = bundle.items.filter((item) =>
            !!state.bundleChecked[`${room.key}:${bundle.name}:${item[0]}`]
          ).length;
          if (done >= needed) completed++;
        });
        return { completed, total: room.bundles.length };
      },
    }),
    {
      name: 'sdv-bundles-store',
      partialize: (state) => ({
        bundleChecked: state.bundleChecked,
        activeRoom: state.activeRoom,
        collapsedBundles: state.collapsedBundles,
      }),
    }
  )
);
