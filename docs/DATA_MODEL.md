# Stardew Completionist — Data Model

**Last reviewed:** 2026-04-06
**Last updated:** 2026-04-06 (initial creation — documents unified collection_progress table and all static data files)

---

## Supabase Schema

### Table: `collection_progress`

Single table storing all user progress. One row per user with 13 JSONB columns (one per tracker). Created across migrations `20260406180003` and `20260406180004`.

```sql
CREATE TABLE public.collection_progress (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_checked        JSONB NOT NULL DEFAULT '{}',
  ingredients_checked   JSONB NOT NULL DEFAULT '{}',
  bundle_checked        JSONB NOT NULL DEFAULT '{}',
  fish_checked          JSONB NOT NULL DEFAULT '{}',
  museum_checked        JSONB NOT NULL DEFAULT '{}',
  shipping_checked      JSONB NOT NULL DEFAULT '{}',
  crafting_checked      JSONB NOT NULL DEFAULT '{}',
  walnut_checked        JSONB NOT NULL DEFAULT '{}',
  stardrop_checked      JSONB NOT NULL DEFAULT '{}',
  secret_note_checked   JSONB NOT NULL DEFAULT '{}',
  journal_scrap_checked JSONB NOT NULL DEFAULT '{}',
  field_office_checked  JSONB NOT NULL DEFAULT '{}',
  monster_checked       JSONB NOT NULL DEFAULT '{}',
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Each JSONB column stores `{ "itemKey": true }` for checked items. The key format varies by tracker (recipe index, item name, walnut ID, etc.).

#### RLS Policies

```sql
ALTER TABLE public.collection_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own" ON public.collection_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "insert_own" ON public.collection_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own" ON public.collection_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

### RPC Functions

#### `get_collection_progress() → JSONB`

Returns all 13 checked maps as a single JSONB object with camelCase keys. Returns `'{}'` if no row exists for the calling user.

```sql
-- Response shape:
{
  "recipeChecked": {},
  "ingredientsChecked": {},
  "bundleChecked": {},
  "fishChecked": {},
  "museumChecked": {},
  "shippingChecked": {},
  "craftingChecked": {},
  "walnutChecked": {},
  "stardropChecked": {},
  "secretNoteChecked": {},
  "journalScrapChecked": {},
  "fieldOfficeChecked": {},
  "monsterChecked": {}
}
```

- Language: SQL, `STABLE`, `SECURITY DEFINER`
- Auth: Uses `auth.uid()` — requires authenticated session

#### `save_collection_progress(p_data JSONB) → void`

Upserts all 13 checked maps from a single JSONB parameter. Uses `INSERT ... ON CONFLICT` to create or update. Preserves existing data for any key not present in `p_data`.

- Language: PL/pgSQL, `SECURITY DEFINER`
- Auth: Uses `auth.uid()` — requires authenticated session

### Migration History

| Migration | Description |
|-----------|-------------|
| `20260405180001_create_recipe_progress_table.sql` | Original `recipe_progress` table (now dropped) |
| `20260405180002_add_progress_rpc_functions.sql` | Original recipe RPCs (now dropped) |
| `20260405180003_create_recipes_table_and_seed_data.sql` | Server-side `recipes` table with 81 seeded rows (now dropped — data moved to static JS) |
| `20260405180004_add_source_detail_column.sql` | Added `source_detail` to recipes table (now dropped) |
| `20260406180001_add_ingredients_checked_column.sql` | Added `ingredients_checked` JSONB to `recipe_progress` |
| `20260406180002_create_bundle_progress_table.sql` | Created `bundle_progress` table (now dropped) |
| `20260406180003_create_collection_progress_table.sql` | Created `collection_progress` with 10 tracker columns |
| `20260406180004_unify_progress_tables.sql` | Added recipe/bundle columns, migrated data, dropped old tables and RPCs |

> **Current state:** Only `collection_progress` exists. All prior tables (`recipe_progress`, `bundle_progress`, `recipes`) were migrated and dropped in `20260406180004`.

---

## Static Data Files (`src/data/`)

All game data is stored as static JavaScript arrays/objects. These are read-only — user progress is tracked separately in Supabase.

### `recipes.js` — Cooking Recipes (81 items)

Export: `RECIPES_STATIC` (array of arrays)

```js
// [name, [ingredients], harvestSeason, itemType, recipeSource, objectId, energy, health, buffs, buffDuration, sellPrice, sourceDetail]
// Index:  0     1              2            3          4           5        6       7       8        9            10          11
["Fried Egg", ["Egg"], "Any", "Animal", "Starter", "194", 50, 22, "", "", "35g", "Default Recipe"]
```

| Index | Field | Type | Values |
|-------|-------|------|--------|
| 0 | name | string | Recipe name |
| 1 | ingredients | string[] | Ingredient names (may include "Name x2" for quantity) |
| 2 | harvestSeason | string | `Spring`, `Summer`, `Fall`, `Winter`, `Any`, `Island` |
| 3 | itemType | string | `Farming`, `Fishing`, `Crab Pot`, `Foraging`, `Animal`, `Artisan`, `Store-Bought`, `Monster Drop`, `Island`, `Mixed` |
| 4 | recipeSource | string | `Starter`, `QoS Y1 Spring`, `QoS Y2 Fall`, `Friendship`, `Skill`, `Shop` |
| 5 | objectId | string | Game object ID |
| 6 | energy | number | Energy restored |
| 7 | health | number | Health restored |
| 8 | buffs | string | Buff description (empty string if none) |
| 9 | buffDuration | string | Duration (empty string if none) |
| 10 | sellPrice | string | e.g., `"35g"` |
| 11 | sourceDetail | string | How to obtain the recipe |

### `bundles.js` — Community Center Bundles

Export: `ROOMS` (array of room objects)

```js
{
  key: 'crafts',          // Room identifier
  name: 'Crafts Room',    // Display name
  color: '#8bc34a',       // Theme color
  icon: 'crafts',         // Icon key
  bundles: [
    {
      name: 'Spring Foraging Bundle',
      slots: 4,             // Items needed to complete (pick N)
      reward: '30 Spring Seeds',
      items: [
        // [name, qty, quality, seasons[], source, category]
        ['Wild Horseradish', 1, 0, ['Spring'], 'Foraging', 'Foraging'],
      ]
    }
  ]
}
```

Quality values: `0` = normal, `1` = silver, `2` = gold, `3` = iridium

### `fish.js` — Fish Collection (80+ items)

Exports: `FISH` (array), `FISH_CATEGORIES` (array of category strings)

```js
{
  name: "Smallmouth Bass",
  location: "River",
  season: ["Spring", "Fall"],    // Array of seasons
  time: "Any",                   // "Any" or time range like "6am-7pm"
  weather: "Any",                // "Any", "Sunny", "Rain"
  difficulty: 28,                // 0-110 (0 = crab pot)
  price: 50,                     // Gold value
  category: "Regular",           // Regular, Mines, Crab Pot, Legendary, Night Market, Ginger Island, Other
  note: ""                       // Optional tip
}
```

Categories: `Regular`, `Mines`, `Crab Pot`, `Legendary`, `Night Market`, `Ginger Island`, `Other`

### `museum.js` — Museum Artifacts & Minerals

Export: `ARTIFACTS` (array), `MINERALS` (array)

```js
// Artifact
{
  name: "Dwarf Scroll I",
  source: "Mines (Floors 1-40)",
  altSources: "Blue Slime drops, artifact spots",
  tip: "Common drop from Blue Slimes",
  category: "Artifact"
}

// Mineral
{
  name: "Quartz",
  source: "Mines (Floors 1-40)",
  altSources: "",
  tip: "",
  category: "Mineral"
}
```

### `shipping.js` — Shippable Items

Export: `SHIPPING` (array)

```js
{
  name: "Parsnip",
  category: "Crops - Spring",   // Grouping category
  season: ["Spring"],           // Nullable for non-seasonal items
  source: "Farming"             // How to obtain
}
```

### `crafting.js` — Crafting Recipes

Exports: `CRAFTING` (array), `CRAFTING_CATEGORIES` (array)

```js
{
  name: "Scarecrow",
  ingredients: "Wood (50), Coal (1), Fiber (20)",  // String, not array
  unlock: "Farming Level 1",
  category: "Farming"           // Farming, Fishing, Bombs & Tools, Lighting & Furniture, Rings, Machines, Fencing
}
```

### `walnuts.js` — Golden Walnuts (130 total)

Exports: `WALNUTS` (array), `WALNUT_AREAS` (array of area strings)

```js
{
  id: "n1",
  area: "Island North",
  description: "Volcano Dungeon floor 5 chest",
  count: 1               // Number of walnuts (1 or 5)
}
```

### `stardrops.js` — Stardrops (7 total)

Export: `STARDROPS` (array)

```js
{
  id: "stardrop-cannoli",
  name: "Old Master Cannoli",
  description: "Bring a Sweet Gem Berry to the Old Master Cannoli statue...",
  howTo: "Grow a Sweet Gem Berry from Rare Seeds..."
}
```

### `secretNotes.js` — Secret Notes (25) & Journal Scraps (11)

Exports: `SECRET_NOTES` (array), `JOURNAL_SCRAPS` (array)

```js
// Secret Note
{ id: 1, description: "Gift preferences hint", detail: "Reveals Abigail's loved gifts" }

// Journal Scrap (same shape)
{ id: 1, description: "...", detail: "..." }
```

### `monsters.js` — Monster Eradication Goals (12 total)

Export: `MONSTER_GOALS` (array)

```js
{
  id: "slimes",
  name: "Slimes",
  target: 1000,                    // Kill count needed
  monsters: "Green Slime, Frost Jelly, Sludge...",
  location: "Mines (all floors), Secret Woods, Skull Cavern",
  reward: "Slime Charmer Ring",
  tip: "Slimes are everywhere — focus on Mines floors 1-40..."
}
```

### `fieldOffice.js` — Island Field Office

Exports: `FIELD_OFFICE_ITEMS` (array), `FIELD_OFFICE_SURVEYS` (array)

```js
// Item
{ name: "Snake Vertebrae", count: 1, survey: "Snake", source: "Dig Site", tip: "..." }

// Survey
{ name: "Snake", reward: "Ostrich Incubator" }
```

### `spawnCodes.js` — Item Spawn Codes (~680 items)

Export: `SPAWN_CODES` (array)

```js
{
  id: 0,
  name: "Rusty Sword",
  category: "Tool",
  rarity: "Common",        // Common, Uncommon, Rare, Epic, Legendary
  price: 50
}
```

### `icons.js` — Recipe Icons

Export: `ICONS` (object mapping recipe names → base64 data URIs)

```js
{ "Fried Egg": "data:image/webp;base64,...", ... }
```
