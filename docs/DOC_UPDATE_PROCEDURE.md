# Documentation Update Procedure

**Purpose:** Self-contained instructions for performing a canonical documentation update after code changes are merged. This document contains all context needed — point an AI assistant here and say "follow these instructions" to execute a full documentation audit and update.

**Last updated:** 2026-04-06

---

## Step 0: Identify the requester

Before starting any documentation work, ask the user:

> "Who is requesting this documentation update? Please provide your name or identifier so I can record it in the update log."

Record the response. You will use this identity in:
- The **Updated by** field in the update log entry (Step 7)
- Commit messages (if committing)

---

## Step 1: Determine scope

Ask the user or determine from context:

1. **Which branches/PRs were merged since the last doc update?**
   - Run: `git log main --merges --oneline -10` to see recent merges
   - Compare the most recent merge date against the `Last reviewed` dates in the canonical docs
   - Any merge newer than the oldest `Last reviewed` date is in scope

2. **What changed in each branch?**
   - For each in-scope branch: `git diff main~N..BRANCH_NAME --stat` (where N is the merge position)
   - If the branch was deleted or squash-merged, use the merge commit instead:
     - `git log --oneline main~N..main` to identify merge commits
     - `git diff <merge-commit>^...<merge-commit> --stat` to see what changed in that merge
   - Pay special attention to changes in:
     - `supabase/migrations/` — new tables, columns, RPC functions, RLS policies
     - `src/data/` — new or modified game data files
     - `src/hooks/` — new stores, sync hooks, state management changes
     - `src/pages/` — new pages or page restructuring
     - `src/components/` — new reusable components
     - `src/context/` — auth or context provider changes
     - `src/styles/index.css` — significant styling/theming changes

---

## Step 2: Canonical document inventory

These are the documents that must be checked and potentially updated. Each has a specific responsibility:

| Document | Path | Responsibility | Update when... |
|----------|------|----------------|----------------|
| ARCHITECTURE.md | `docs/ARCHITECTURE.md` | System overview, tech stack, directory structure, state management, auth flow | New subsystems, auth changes, state management changes, new architectural patterns, directory structure changes |
| DATA_MODEL.md | `docs/DATA_MODEL.md` | Supabase tables, columns, RLS policies, RPC functions, static data file schemas | New tables, new columns, new RLS policies, new RPC functions, changes to static data format |
| CHANGELOG.md | `docs/CHANGELOG.md` | User-visible changes by date | Every merge to main (always) |
| README.md | `README.md` | Project overview, setup instructions, feature list | New features, new setup steps, new environment variables |

**Create these documents if they don't exist yet.** Use the format conventions in Step 4.

### Secondary documents (create/update only if directly impacted):

| Document | Path | Update when... |
|----------|------|----------------|
| Game Data Reference | `docs/GAME_DATA.md` | New data files added to `src/data/`, changes to data schemas or icon sources |
| Deployment Guide | `docs/DEPLOYMENT.md` | New deployment steps, Supabase migration procedures, environment changes |

---

## Step 3: Read each canonical doc

For every document in the inventory:

1. Read the file (or note that it needs to be created)
2. Note the `Last reviewed` and `Last updated` dates
3. Compare against the changes identified in Step 1
4. Flag sections that are:
   - **Missing:** The change introduced something not mentioned at all
   - **Stale:** The doc describes behavior that was changed
   - **Incomplete:** The doc mentions the area but doesn't cover the new aspects

---

## Step 4: Apply updates

For each flagged document, make targeted edits:

### Header updates (always):
- Update `Last reviewed` to today's date
- Update `Last updated` with a brief parenthetical describing what changed

### Content rules:
- Match the existing style of each document. Don't introduce new formatting patterns.
- Be concise. The canonical docs are meant to be scannable reference material, not tutorials.
- Include implementation references (file paths, migration names) so developers can find the code.
- Don't remove or rewrite existing content unless it's factually wrong. Add new sections instead.

### When to create new docs:
If a change introduces an entirely new subsystem that doesn't fit cleanly into an existing canonical doc, create a new document:
- Place it under `docs/`
- Add it to the inventory table in Step 2 of this procedure
- Follow the same header format (`Last reviewed`, `Last updated`) as existing canonical docs

### CHANGELOG rules:
- Group by date and PR/branch name
- Format: `## YYYY-MM-DD (Short description) — branch-name`
- Use bullet points for individual changes
- Keep entries concise (1-2 sentences per bullet)
- Place newest entries at the top (below the header)

### ARCHITECTURE.md conventions:
- Keep the directory tree up to date with actual `src/` structure
- Document each Zustand store's shape and actions
- Document each sync hook's behavior
- Keep the Supabase schema section current with latest migrations
- Document routing structure (React Router paths → pages)

### DATA_MODEL.md conventions:
- One section per Supabase table with full CREATE TABLE statement
- Document all RLS policies per table
- Document all RPC functions with parameter/return types
- One section per static data file (`src/data/*.js`) with field schema
- Include example entries for each data format

---

## Step 5: Verify consistency

After all edits, verify:

1. **Cross-references are valid:** If ARCHITECTURE.md references a section in DATA_MODEL.md, confirm the section exists
2. **No contradictions:** If a behavior is described in multiple docs, ensure they agree
3. **Migration names are correct:** Any referenced migration file name should match an actual file in `supabase/migrations/`
4. **Component/page paths are correct:** Any referenced source file should exist at the stated path
5. **Data file references are correct:** Any referenced data file in `src/data/` should exist

### Commit strategy:
- Commit documentation updates in a dedicated commit (separate from code changes) so they can be reverted independently if an error is found.

---

## Step 6: Summary diff

Before finishing, provide the user with a summary of all changes made:

```
## Documentation Update Summary

**Requested by:** [requester identity from Step 0]
**Date:** YYYY-MM-DD
**Scope:** [branches/PRs covered]

### Documents updated:
- `docs/ARCHITECTURE.md` — [what was added/changed]
- `docs/DATA_MODEL.md` — [what was added/changed]
- ... (for each modified file)

### Documents created:
- `docs/CHANGELOG.md` — [initial creation with N entries]
- ... (for each new file)

### Documents reviewed (no changes needed):
- `README.md` — [reason no change needed]
- ... (for each reviewed-but-unchanged file)
```

---

## Step 7: Update the update log

Append to the update log at the bottom of this document:

| Date | Requester | Branches covered | Docs modified |
|------|-----------|------------------|---------------|
| YYYY-MM-DD | [name] | branch1, branch2 | ARCHITECTURE, DATA_MODEL, ... |

---

## Checklist (quick reference)

- [ ] Identified requester
- [ ] Identified in-scope branches/PRs
- [ ] Read each canonical doc, noted `Last reviewed` dates
- [ ] Flagged missing/stale/incomplete sections
- [ ] Updated ARCHITECTURE.md (if applicable)
- [ ] Updated DATA_MODEL.md (if applicable)
- [ ] Updated CHANGELOG.md (always)
- [ ] Updated README.md (if applicable)
- [ ] Updated secondary docs (if applicable)
- [ ] Verified cross-references and file paths
- [ ] Provided summary to user
- [ ] Appended to update log

---

## Update Log

> Note: If this log grows beyond ~20 entries, consider migrating it to a separate `docs/update_log.md` file and linking to it from here.

| Date | Requester | Branches covered | Docs modified |
|------|-----------|------------------|---------------|
| 2026-04-06 | (initial creation) | — | DOC_UPDATE_PROCEDURE |
