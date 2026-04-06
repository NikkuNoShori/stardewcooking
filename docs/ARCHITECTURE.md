# Stardew Completionist — Architecture Document

**Last reviewed:** 2026-04-06
**Last updated:** 2026-04-06 (full rewrite — expanded from recipe-only to multi-collection tracker)

## Overview

A comprehensive Stardew Valley completionist tracker built with Vite + React. Users can track progress across recipes, Community Center bundles, fish, museum artifacts, shipping items, crafting recipes, Ginger Island content, and miscellaneous collections. Includes a spawn codes reference. All progress syncs to Supabase for authenticated users; anonymous users get localStorage persistence.

## Tech Stack

- **Framework**: Vite 8 + React 19
- **State Management**: Zustand 5 (global store with `persist` middleware → localStorage)
- **Auth**: Supabase Auth (Email/Password + Google OAuth)
- **Database**: Supabase PostgreSQL (unified `collection_progress` table per user)
- **Routing**: React Router DOM v7
- **Styling**: Global CSS + CSS Custom Properties (Stardew pixel-art aesthetic)
- **Icons**: Base64-embedded webp sprites from stardew.app CDN

## Directory Structure

```
src/
├── main.jsx                    # Entry point, wraps app in providers
├── App.jsx                     # Router + layout shell (sidebar + routes)
├── components/
│   ├── Header.jsx              # Title, progress bar, subtitle
│   ├── Sidebar.jsx             # Navigation menu + auth UI (mobile hamburger)
│   ├── TabBar.jsx              # Recipes / Ingredients / Wiki Reference tabs
│   ├── FilterBar.jsx           # All / Remaining / Completed filters
│   ├── ControlsBar.jsx         # Search input + sort dropdown
│   ├── RecipeList.jsx          # Checklist view of recipes with icons
│   ├── IngredientTable.jsx     # Sortable 3-column ingredient aggregation
│   ├── WikiTable.jsx           # Full data table (icon, name, ings, energy, hp, buffs, sell, source)
│   ├── CollectionPage.jsx      # Generic collection UI components (header, controls, items, sections)
│   ├── AuthModal.jsx           # Login/signup modal (email + Google OAuth)
│   ├── UserMenu.jsx            # Logged-in user dropdown (email, sign out)
│   └── ActionButtons.jsx       # Reset All / Complete All buttons
├── context/
│   └── AuthContext.jsx         # React context for Supabase auth session
├── data/
│   ├── recipes.js              # 81 cooking recipes with full metadata
│   ├── bundles.js              # Community Center rooms, bundles, items
│   ├── fish.js                 # Fish with location, season, difficulty
│   ├── museum.js               # Museum artifacts and minerals
│   ├── shipping.js             # Shippable items by category
│   ├── crafting.js             # Crafting recipes with ingredients and unlock conditions
│   ├── spawnCodes.js           # Item spawn codes (cheats reference)
│   ├── walnuts.js              # Golden walnut locations
│   ├── stardrops.js            # Stardrop locations
│   ├── secretNotes.js          # Secret note locations
│   ├── fieldOffice.js          # Island field office items
│   ├── monsters.js             # Monster eradication goals
│   └── icons.js                # Base64-embedded recipe icon sprites
├── hooks/
│   ├── useCollectionStore.js   # Unified Zustand store: all checked state + UI state
│   ├── useCollectionSync.js    # Syncs all collection progress ↔ Supabase
│   ├── useRecipeStore.js       # Recipe page UI state (tabs, sorts, filters)
│   ├── useSupabaseSync.js      # Re-exports useCollectionSync (legacy compat)
│   ├── useBundleStore.js       # Bundle page UI state (rooms, filters)
│   ├── useBundleSync.js        # Re-exports useCollectionSync (legacy compat)
│   └── useMediaQuery.js        # Responsive breakpoint hook
├── lib/
│   └── supabase.js             # Supabase client init (graceful null if unconfigured)
├── pages/
│   ├── Home.jsx                # Recipe tracker (3 tabs: recipes, ingredients, wiki)
│   ├── CommunityCenter.jsx     # Bundle completion tracker by room
│   ├── FishPage.jsx            # Fish collection tracker
│   ├── MuseumPage.jsx          # Museum artifact/mineral tracker
│   ├── ShippingPage.jsx        # Shipping collection tracker
│   ├── CraftingPage.jsx        # Crafting recipe tracker
│   ├── IslandPage.jsx          # Ginger Island tracker (walnuts + field office)
│   ├── MiscPage.jsx            # Miscellaneous (stardrops, secret notes, monsters)
│   └── SpawnCodesPage.jsx      # Spawn codes reference (no tracking, read-only)
└── styles/
    └── index.css               # Global styles, CSS variables, Stardew theme (~37KB)

docs/
├── ARCHITECTURE.md             # This file
├── DATA_MODEL.md               # Supabase schema + static data file schemas
├── CHANGELOG.md                # User-visible changes by date
└── DOC_UPDATE_PROCEDURE.md     # Documentation update instructions

supabase/
└── migrations/                 # Ordered SQL migrations (see DATA_MODEL.md)
```

## Routing

All routes are defined in `src/App.jsx` within a `BrowserRouter`:

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Recipe tracker with tabs |
| `/community-center` | CommunityCenter | Bundle tracker by room |
| `/fish` | FishPage | Fish collection |
| `/museum` | MuseumPage | Artifacts & minerals |
| `/shipping` | ShippingPage | Shipping items |
| `/crafting` | CraftingPage | Crafting recipes |
| `/island` | IslandPage | Ginger Island (walnuts + field office) |
| `/misc` | MiscPage | Stardrops, secret notes, monsters |
| `/spawn-codes` | SpawnCodesPage | Item spawn codes (cheat reference) |

The `Layout` component in `App.jsx` wraps all routes with the `Sidebar` and a hamburger toggle for mobile.

## State Management

### Unified Collection Store (`useCollectionStore`)

Single Zustand store with `persist` middleware (localStorage key: `stardew-completionist`). Manages all checked state and per-page UI state.

**Checked maps** (13 JSONB-backed maps, keys are item identifiers → boolean):
- `recipeChecked`, `ingredientsChecked` — Recipes page
- `bundleChecked` — Community Center
- `fishChecked`, `museumChecked`, `shippingChecked`, `craftingChecked` — Collection pages
- `walnutChecked`, `stardropChecked`, `secretNoteChecked`, `journalScrapChecked`, `fieldOfficeChecked` — Island/Misc
- `monsterChecked` — Misc

**UI state** (per-page, keyed by page name):
- `collapsedSections` — which groups are collapsed
- `searchQueries` — search text per page
- `filters` — `'all' | 'remaining' | 'completed'` per page
- `sortModes` — sort mode per page

**Key actions:** `toggleItem(storeKey, itemId)`, `toggleSection(sectionKey)`, `setSearch/setFilter/setSort(page, value)`, `loadFromSupabase(data)`, `getAllChecked()`, `getCount(storeKey)`

### Page-Specific Stores

- **`useRecipeStore`** — Recipe tab, sort, filter, ingredient sort, wiki sort, collapsed groups. Delegates `toggle()` to collection store.
- **`useBundleStore`** — Active room, season/category filters, bundle collapse state. Delegates `toggleBundleItem()` to collection store.

### Sync Hooks

- **`useCollectionSync`** — Watches all 13 checked maps. On login: loads from `get_collection_progress()` RPC. On change: debounced 1500ms save via `save_collection_progress()` RPC. Skips if Supabase not configured.
- **`useSupabaseSync`** / **`useBundleSync`** — Legacy re-exports of `useCollectionSync`.

## Auth Flow

1. User opens app → anonymous mode (localStorage-only persistence)
2. User clicks "Sign In" in sidebar → `AuthModal` with email/password or Google OAuth
3. On successful auth → `useCollectionSync` loads saved state from `collection_progress` table
4. Every item toggle → debounced 1500ms sync to Supabase via RPC
5. On sign out → state preserved locally, Supabase sync paused
6. If Supabase env vars not set → app works fully offline with localStorage only

Auth is managed by `AuthContext.jsx` which provides `user`, `session`, `loading`, and auth methods via React context.

## Generic Collection Pattern

Most collection pages (Fish, Museum, Shipping, Crafting, Island, Misc) follow the same pattern using components from `CollectionPage.jsx`:

1. **`CollectionHeader`** — progress bar with checked/total counts
2. **`CollectionControls`** — search + sort dropdown (sort options defined per page)
3. **`SectionHeader`** — collapsible group header with group progress
4. **`CollectionItem`** — single toggleable item row (name, meta, detail, badge)
5. **`useFilteredItems()`** — hook that applies search + filter to items list

Each page defines its own data source, sort options, grouping logic, and item rendering.

**Exceptions:**
- **Home (Recipes)** — uses its own components (`RecipeList`, `IngredientTable`, `WikiTable`) with tab-based UI
- **CommunityCenter** — uses `useBundleStore` with room-based navigation and pick-N-of-M bundle logic
- **SpawnCodesPage** — standalone read-only reference table, no progress tracking, no Supabase sync

## Supabase Schema

See [DATA_MODEL.md](DATA_MODEL.md) for full table definitions, RLS policies, and RPC functions.

Summary: All progress is stored in a single `collection_progress` table with 13 JSONB columns (one per tracker) and a `user_id` primary key. Two RPC functions (`get_collection_progress`, `save_collection_progress`) handle all reads and writes. Row-level security ensures users can only access their own data.
