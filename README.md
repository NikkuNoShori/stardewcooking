# Stardew Completionist

A comprehensive Stardew Valley completionist tracker. Track your progress across cooking recipes, Community Center bundles, fish, museum artifacts, shipping items, crafting recipes, Ginger Island content, and more — with optional cloud sync via Supabase.

## Features

- **Cooking Recipes** — Track 81 recipes with ingredient lists, energy/health stats, buffs, and unlock conditions
- **Community Center** — Bundle completion tracker organized by room with pick-N-of-M logic
- **Fish Collection** — 80+ fish with location, season, difficulty, and weather info
- **Museum** — Artifacts and minerals with sources and tips
- **Shipping** — Complete shippable items list organized by category
- **Crafting** — All crafting recipes with ingredients and unlock requirements
- **Ginger Island** — Golden Walnut tracker (130 total) and Field Office donations
- **Miscellaneous** — Stardrops, Secret Notes, Journal Scraps, and Monster Eradication goals
- **Spawn Codes** — Item ID reference with search, filters, and copy-to-clipboard
- **Cloud Sync** — Optional Supabase auth (email + Google OAuth) with automatic progress sync
- **Offline-First** — Works fully without an account using localStorage

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) 19
- [Zustand](https://zustand-demo.pmnd.rs/) for state management (with localStorage persistence)
- [Supabase](https://supabase.com/) for auth and database (optional)
- [React Router](https://reactrouter.com/) v7

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone <repo-url>
cd stardewcooking
npm install
cp .env.example .env
```

Edit `.env` with your Supabase credentials (optional — app works without them):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview   # Preview built output
```

### Supabase Setup (optional)

If you want cloud sync:

1. Create a [Supabase](https://supabase.com/) project
2. Run the migrations in `supabase/migrations/` in order
3. Enable Google OAuth in Supabase Auth settings (optional)
4. Add your project URL and anon key to `.env`

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — System overview, state management, auth flow
- [Data Model](docs/DATA_MODEL.md) — Supabase schema and static data file formats
- [Changelog](docs/CHANGELOG.md) — User-visible changes by date
- [Doc Update Procedure](docs/DOC_UPDATE_PROCEDURE.md) — How to update documentation after code changes
