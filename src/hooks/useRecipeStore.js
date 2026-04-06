import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RECIPES_STATIC } from '../data/recipes';
import { useCollectionStore } from './useCollectionStore';

export const useRecipeStore = create(
  persist(
    (set, get) => ({
      // Recipe data — static, hardcoded
      recipes: RECIPES_STATIC,

      // UI state
      currentTab: 'recipes',
      currentFilter: 'all',
      searchQuery: '',
      sortMode: 'alpha',
      ingredientSort: { column: 'name', direction: 'asc' },
      wikiSort: { column: 'name', direction: 'asc' },
      collapsedGroups: {},

      // Actions — delegate toggles to collection store
      toggle: (idx) => {
        useCollectionStore.getState().toggleItem('recipeChecked', idx);
      },

      toggleIngredient: (recipeIdx, ingredientName) => {
        const key = `${recipeIdx}:${ingredientName}`;
        useCollectionStore.getState().toggleItem('ingredientsChecked', key);
      },

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

      resetAll: () => {
        useCollectionStore.getState().resetTracker('recipeChecked');
        useCollectionStore.getState().resetTracker('ingredientsChecked');
      },
      checkAll: () => {
        const checked = {};
        get().recipes.forEach((_, i) => { checked[i] = true; });
        useCollectionStore.setState({ recipeChecked: checked });
      },

      // Derived counts — read from collection store
      doneCount: () => Object.values(useCollectionStore.getState().recipeChecked).filter(Boolean).length,
      totalCount: () => get().recipes.length,
    }),
    {
      name: 'sdv-recipes-store',
      version: 3,
      migrate: () => ({
        currentTab: 'recipes',
        currentFilter: 'all',
        sortMode: 'alpha',
        ingredientSort: { column: 'name', direction: 'asc' },
        wikiSort: { column: 'name', direction: 'asc' },
        collapsedGroups: {},
      }),
      partialize: (state) => ({
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
