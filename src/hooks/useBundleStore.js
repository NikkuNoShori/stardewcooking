import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCollectionStore } from './useCollectionStore';

export const useBundleStore = create(
  persist(
    (set, get) => ({
      // UI state
      activeRoom: 'crafts',
      seasonFilter: 'all',
      categoryFilter: 'all',
      bundleSearch: '',
      collapsedBundles: {},

      // Checked state — delegates to collection store
      get bundleChecked() {
        return useCollectionStore.getState().bundleChecked;
      },

      // Actions — delegate toggle to collection store
      toggleBundleItem: (roomKey, bundleName, itemName) => {
        const key = `${roomKey}:${bundleName}:${itemName}`;
        useCollectionStore.getState().toggleItem('bundleChecked', key);
      },

      setActiveRoom: (room) => set({ activeRoom: room }),
      setSeasonFilter: (season) => set({ seasonFilter: season }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setBundleSearch: (query) => set({ bundleSearch: query }),

      toggleBundleCollapse: (roomKey, bundleName, defaultCollapsed) => set((state) => {
        const key = `${roomKey}:${bundleName}`;
        const current = state.collapsedBundles[key] ?? defaultCollapsed;
        return { collapsedBundles: { ...state.collapsedBundles, [key]: !current } };
      }),

      resetBundles: () => {
        useCollectionStore.getState().resetTracker('bundleChecked');
      },

      // Derived helpers
      getBundleProgress: (roomKey, bundleName, items, pick) => {
        const bundleChecked = useCollectionStore.getState().bundleChecked;
        const done = items.filter((item) =>
          !!bundleChecked[`${roomKey}:${bundleName}:${item[0]}`]
        ).length;
        const needed = pick || items.length;
        return { done, needed, complete: done >= needed };
      },

      getRoomProgress: (room) => {
        const bundleChecked = useCollectionStore.getState().bundleChecked;
        let completed = 0;
        room.bundles.forEach((bundle) => {
          const needed = bundle.pick || bundle.items.length;
          const done = bundle.items.filter((item) =>
            !!bundleChecked[`${room.key}:${bundle.name}:${item[0]}`]
          ).length;
          if (done >= needed) completed++;
        });
        return { completed, total: room.bundles.length };
      },
    }),
    {
      name: 'sdv-bundles-store',
      version: 2,
      migrate: () => ({
        activeRoom: 'crafts',
        collapsedBundles: {},
      }),
      partialize: (state) => ({
        activeRoom: state.activeRoom,
        collapsedBundles: state.collapsedBundles,
      }),
    }
  )
);
