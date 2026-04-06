import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RECIPES_STATIC } from '../data/recipes';

export const useRecipeStore = create(
  persist(
    (set, get) => ({
      // Recipe data — starts with static, replaced by DB data on load
      recipes: RECIPES_STATIC,

      // Recipe completion state — empty by default, populated from DB
      checked: {},

      // Ingredient gathering state: keyed by "recipeIndex:ingredientName" -> boolean
      ingredientsChecked: {},

      // UI state
      currentTab: 'recipes',
      currentFilter: 'all',
      searchQuery: '',
      sortMode: 'alpha',
      ingredientSort: { column: 'name', direction: 'asc' },
      wikiSort: { column: 'name', direction: 'asc' },
      collapsedGroups: {},

      // Actions
      toggle: (idx) => set((state) => {
        const next = { ...state.checked };
        if (next[idx]) {
          delete next[idx];
        } else {
          next[idx] = true;
        }
        return { checked: next };
      }),

      toggleIngredient: (recipeIdx, ingredientName) => set((state) => {
        const key = `${recipeIdx}:${ingredientName}`;
        const next = { ...state.ingredientsChecked };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = true;
        }
        return { ingredientsChecked: next };
      }),

      setTab: (tab) => set({ currentTab: tab }),
      setFilter: (filter) => set({ currentFilter: filter }),
      setSearch: (query) => set({ searchQuery: query }),
      setSort: (mode) => set({ sortMode: mode }),
      setIngredientSort: (column) => set((state) => {
        const prev = state.ingredientSort;
        if (prev.column === column) {
          return { ingredientSort: { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' } };
        }
        return { ingredientSort: { column, direction: column === 'qty' ? 'desc' : 'asc' } };
      }),
      setWikiSort: (column) => set((state) => {
        const prev = state.wikiSort;
        if (prev.column === column) {
          return { wikiSort: { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' } };
        }
        return { wikiSort: { column, direction: column === 'energy' || column === 'health' || column === 'sell' ? 'desc' : 'asc' } };
      }),
      toggleGroup: (groupKey, isMobile) => set((state) => {
        const key = `${state.sortMode}:${groupKey}`;
        const current = state.collapsedGroups[key] ?? isMobile;
        return { collapsedGroups: { ...state.collapsedGroups, [key]: !current } };
      }),

      resetAll: () => set({ checked: {}, ingredientsChecked: {} }),
      checkAll: () => {
        const checked = {};
        get().recipes.forEach((_, i) => { checked[i] = true; });
        set({ checked });
      },

      // DB data loading
      loadFromSupabase: (data) => {
        const update = {};
        if (data.checked) update.checked = data.checked;
        if (data.ingredients_checked) update.ingredientsChecked = data.ingredients_checked;
        if (Object.keys(update).length > 0) set(update);
      },
      getCheckedObject: () => get().checked,
      getIngredientsChecked: () => get().ingredientsChecked,

      // Derived counts
      doneCount: () => Object.values(get().checked).filter(Boolean).length,
      totalCount: () => get().recipes.length,
    }),
    {
      name: 'sdv-recipes-store',
      version: 2, // bump version to clear stale localStorage with hardcoded checks
      migrate: () => {
        // Fresh start — discard old hardcoded state
        return {
          checked: {},
          ingredientsChecked: {},
          currentTab: 'recipes',
          currentFilter: 'all',
          sortMode: 'alpha',
          ingredientSort: { column: 'name', direction: 'asc' },
          wikiSort: { column: 'name', direction: 'asc' },
          collapsedGroups: {},
        };
      },
      partialize: (state) => ({
        checked: state.checked,
        ingredientsChecked: state.ingredientsChecked,
        currentTab: state.currentTab,
        currentFilter: state.currentFilter,
        sortMode: state.sortMode,
        ingredientSort: state.ingredientSort,
        wikiSort: state.wikiSort,
        collapsedGroups: state.collapsedGroups,
      }),
    }
  )
);
