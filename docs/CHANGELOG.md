# Changelog

All notable user-visible changes to Stardew Completionist.

---

## 2026-04-06 (Unified progress & collection expansion) — enhancements/additional-lists

- **Unified progress tracking:** Merged recipe, bundle, and collection progress into a single `collection_progress` Supabase table with 13 JSONB columns. Old `recipe_progress`, `bundle_progress`, and `recipes` tables dropped after data migration.
- **7 new collection pages:** Fish, Museum, Shipping, Crafting, Island (Ginger Island), Misc (Stardrops, Secret Notes, Monsters), and Spawn Codes reference.
- **Generic `CollectionPage` components:** Reusable header, controls, section, and item components shared across all new collection pages.
- **New `useCollectionStore`:** Single Zustand store managing all checked state and per-page UI (search, filter, sort, collapsed sections).
- **New `useCollectionSync`:** Unified Supabase sync hook replacing separate recipe and bundle sync hooks.
- **11 new static data files:** fish, museum, shipping, crafting, walnuts, stardrops, secretNotes, fieldOffice, monsters, spawnCodes, and expanded bundles data.
- **Sidebar navigation:** Full nav menu with icons for all 9 pages, mobile hamburger menu.
- **Spawn Codes page:** Read-only cheat reference with search, category filters, sort options, copy-to-clipboard, and spoiler disclaimer.
- **Island page:** Dual-section tracker for Golden Walnuts (130 total) and Field Office items.

## 2026-04-05 (Community Center bundles) — main

- **Community Center page:** Bundle completion tracker organized by room (Crafts, Pantry, Fish Tank, Boiler, Bulletin, Vault).
- **Bundle progress sync:** Supabase integration for bundle checked state.
- **Sidebar navigation:** Added sidebar with route-based navigation replacing single-page layout.
- **Ingredient tracking:** Per-ingredient checkboxes within recipes, synced to Supabase.

## 2026-04-05 (Recipe enhancements) — main

- **81 recipes with metadata:** Full recipe data including energy, health, buffs, sell price, and unlock conditions.
- **Source detail column:** Added `sourceDetail` field showing exactly how to obtain each recipe.
- **Collapsible recipe groups:** Recipes grouped by sort mode with expandable/collapsible sections.

## 2026-04-05 (Supabase integration) — main

- **User authentication:** Email/password and Google OAuth via Supabase Auth.
- **Cloud progress sync:** Recipe completion state synced to Supabase with debounced saves.
- **Offline-first:** App works fully without Supabase; localStorage persistence for anonymous users.

## 2026-04-05 (Initial release) — main

- **Recipe tracker:** Track 81 Stardew Valley cooking recipes with checkboxes.
- **Three views:** Recipe checklist, ingredient shopping list, wiki reference table.
- **Search & sort:** Filter by completion status, search by name, sort by A-Z/season/type/source.
- **Stardew pixel-art theme:** Custom CSS with Stardew Valley aesthetic.
- **Mobile responsive:** Hamburger menu, responsive tables, touch-friendly controls.
