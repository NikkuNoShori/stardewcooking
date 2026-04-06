import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCollectionStore = create(
  persist(
    (set, get) => ({
      // Checked states for each tracker — keyed by unique item identifier
      recipeChecked: {},
      ingredientsChecked: {},
      bundleChecked: {},
      fishChecked: {},
      museumChecked: {},
      shippingChecked: {},
      craftingChecked: {},
      walnutChecked: {},
      stardropChecked: {},
      secretNoteChecked: {},
      journalScrapChecked: {},
      fieldOfficeChecked: {},
      monsterChecked: {},

      // UI state
      collapsedSections: {},
      searchQueries: {},   // keyed by page name
      filters: {},         // keyed by page name -> 'all' | 'remaining' | 'completed'
      sortModes: {},       // keyed by page name

      // Toggle actions — generic toggle for any checked map
      toggleItem: (storeKey, itemId) => set((state) => {
        const map = { ...state[storeKey] };
        if (map[itemId]) {
          delete map[itemId];
        } else {
          map[itemId] = true;
        }
        return { [storeKey]: map };
      }),

      // UI actions
      toggleSection: (sectionKey) => set((state) => {
        const next = { ...state.collapsedSections };
        next[sectionKey] = !next[sectionKey];
        return { collapsedSections: next };
      }),

      setSearch: (page, query) => set((state) => ({
        searchQueries: { ...state.searchQueries, [page]: query },
      })),

      setFilter: (page, filter) => set((state) => ({
        filters: { ...state.filters, [page]: filter },
      })),

      setSort: (page, mode) => set((state) => ({
        sortModes: { ...state.sortModes, [page]: mode },
      })),

      // Reset a specific tracker
      resetTracker: (storeKey) => set({ [storeKey]: {} }),

      // Helpers
      getCount: (storeKey) => Object.keys(get()[storeKey]).length,

      // Supabase sync — load all progress from DB
      loadFromSupabase: (data) => {
        const update = {};
        const keys = [
          'recipeChecked', 'ingredientsChecked', 'bundleChecked',
          'fishChecked', 'museumChecked', 'shippingChecked', 'craftingChecked',
          'walnutChecked', 'stardropChecked', 'secretNoteChecked', 'journalScrapChecked',
          'fieldOfficeChecked', 'monsterChecked',
        ];
        keys.forEach((k) => {
          if (data[k] && Object.keys(data[k]).length > 0) update[k] = data[k];
        });
        if (Object.keys(update).length > 0) set(update);
      },

      getAllChecked: () => {
        const s = get();
        return {
          recipeChecked: s.recipeChecked,
          ingredientsChecked: s.ingredientsChecked,
          bundleChecked: s.bundleChecked,
          fishChecked: s.fishChecked,
          museumChecked: s.museumChecked,
          shippingChecked: s.shippingChecked,
          craftingChecked: s.craftingChecked,
          walnutChecked: s.walnutChecked,
          stardropChecked: s.stardropChecked,
          secretNoteChecked: s.secretNoteChecked,
          journalScrapChecked: s.journalScrapChecked,
          fieldOfficeChecked: s.fieldOfficeChecked,
          monsterChecked: s.monsterChecked,
        };
      },
    }),
    {
      name: 'sdv-collections-store',
      partialize: (state) => ({
        recipeChecked: state.recipeChecked,
        ingredientsChecked: state.ingredientsChecked,
        bundleChecked: state.bundleChecked,
        fishChecked: state.fishChecked,
        museumChecked: state.museumChecked,
        shippingChecked: state.shippingChecked,
        craftingChecked: state.craftingChecked,
        walnutChecked: state.walnutChecked,
        stardropChecked: state.stardropChecked,
        secretNoteChecked: state.secretNoteChecked,
        journalScrapChecked: state.journalScrapChecked,
        fieldOfficeChecked: state.fieldOfficeChecked,
        monsterChecked: state.monsterChecked,
        collapsedSections: state.collapsedSections,
        searchQueries: state.searchQueries,
        filters: state.filters,
        sortModes: state.sortModes,
      }),
    }
  )
);
