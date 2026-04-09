import { useMemo, useCallback } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { STARDROPS } from '../data/stardrops';
import { SECRET_NOTES, JOURNAL_SCRAPS } from '../data/secretNotes';
import { MONSTER_GOALS } from '../data/monsters';
import { CollectionHeader, CollectionControls, SectionHeader, CollectionItem, Checkmark } from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'category', label: 'By Category' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'alpha_desc', label: 'Z-A' },
];

// Build a flat list of all misc items with a unified shape
const ALL_MISC_ITEMS = [
  ...STARDROPS.map((sd) => ({
    id: sd.id, name: sd.name, category: 'Stardrops', storeKey: 'stardropChecked',
    meta: sd.description, detail: sd.howTo, extra: null,
  })),
  ...SECRET_NOTES.map((n) => ({
    id: n.id, name: `#${n.id} — ${n.description}`, category: 'Secret Notes', storeKey: 'secretNoteChecked',
    meta: n.detail, detail: null, extra: null,
  })),
  ...JOURNAL_SCRAPS.map((s) => ({
    id: s.id, name: `Scrap #${s.id} — ${s.description}`, category: 'Journal Scraps', storeKey: 'journalScrapChecked',
    meta: s.detail, detail: null, extra: null,
  })),
  ...MONSTER_GOALS.map((g) => ({
    id: g.id, name: g.name, category: 'Monster Goals', storeKey: 'monsterChecked',
    meta: `${g.monsters} — ${g.location}`, detail: `Reward: ${g.reward} — ${g.tip}`,
    extra: <span className="cc-item-qty">Kill {g.target}</span>,
  })),
];

const CATEGORY_ORDER = ['Stardrops', 'Secret Notes', 'Journal Scraps', 'Monster Goals'];

function isItemChecked(item, store) {
  return !!store[item.storeKey]?.[item.id];
}

export default function MiscPage() {
  useCollectionSync();
  const stardropChecked = useCollectionStore((s) => s.stardropChecked);
  const secretNoteChecked = useCollectionStore((s) => s.secretNoteChecked);
  const journalScrapChecked = useCollectionStore((s) => s.journalScrapChecked);
  const monsterChecked = useCollectionStore((s) => s.monsterChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const searchQueries = useCollectionStore((s) => s.searchQueries);
  const filters = useCollectionStore((s) => s.filters);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const viewModes = useCollectionStore((s) => s.viewModes);
  const setSort = useCollectionStore((s) => s.setSort);

  const checkedMaps = { stardropChecked, secretNoteChecked, journalScrapChecked, monsterChecked };

  const totalDone =
    Object.keys(stardropChecked).length +
    Object.keys(secretNoteChecked).length +
    Object.keys(journalScrapChecked).length +
    Object.keys(monsterChecked).length;
  const totalItems = ALL_MISC_ITEMS.length;

  const query = (searchQueries['misc'] || '').toLowerCase().trim();
  const filter = filters['misc'] || 'all';
  const sort = sortModes['misc'] || 'category';
  const viewMode = viewModes['misc'] || 'list';

  const filtered = useMemo(() => {
    return ALL_MISC_ITEMS.filter((item) => {
      const checked = isItemChecked(item, checkedMaps);
      if (filter === 'completed' && !checked) return false;
      if (filter === 'remaining' && checked) return false;
      if (query && !`${item.name} ${item.meta || ''} ${item.category}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [query, filter, stardropChecked, secretNoteChecked, journalScrapChecked, monsterChecked]);

  const grouped = useMemo(() => {
    if (sort === 'alpha' || sort === 'alpha_desc') {
      const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      if (sort === 'alpha_desc') sorted.reverse();
      return [['All Items', sorted]];
    }
    const groups = {};
    CATEGORY_ORDER.forEach((c) => { groups[c] = []; });
    filtered.forEach((item) => {
      if (groups[item.category]) groups[item.category].push(item);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filtered, sort]);

  const toggleSortMode = useCallback((ascMode, descMode = null) => {
    const nextDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return setSort('misc', nextDescMode);
    if (sort === nextDescMode) return setSort('misc', ascMode);
    return setSort('misc', ascMode);
  }, [setSort, sort]);

  const sortArrow = useCallback((ascMode, descMode = null) => {
    const activeDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return ' \u2191';
    if (sort === activeDescMode) return ' \u2193';
    return ' \u21D5';
  }, [sort]);

  return (
    <div className="container">
      <CollectionHeader title="Misc Trackers" done={totalDone} total={totalItems} colorClass="misc-progress" icon="⭐" />
      <CollectionControls
        page="misc"
        sortOptions={SORT_OPTIONS}
        done={totalDone}
        total={totalItems}
        enableViewToggle={true}
        defaultViewMode="list"
        showExpandCollapse={true}
        collapsePrefix="misc:"
      />
      <div className="panel">
        {grouped.map(([group, items]) => {
          const groupDone = items.filter((i) => isItemChecked(i, checkedMaps)).length;
          return (
            <div key={group}>
              <SectionHeader
                sectionKey={`misc:${group}`}
                label={group === 'Stardrops' ? `Stardrops — +${Object.keys(stardropChecked).length * 34} bonus energy` : group}
                done={groupDone}
                total={items.length}
                defaultOpen={true}
              />
              <MiscSectionItems
                items={items}
                checkedMaps={checkedMaps}
                toggleItem={toggleItem}
                sectionKey={`misc:${group}`}
                viewMode={viewMode}
                onSortClick={toggleSortMode}
                sortArrow={sortArrow}
                onCategorySort={() => setSort('misc', 'category')}
              />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No items match your filters</div>}
      </div>
    </div>
  );
}

function MiscSectionItems({ items, checkedMaps, toggleItem, sectionKey, viewMode, onSortClick, sortArrow, onCategorySort }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  if (viewMode === 'table') {
    return (
      <table className="fish-grid-tbl">
        <thead>
          <tr>
            <th></th>
            <th className="fish-th-sort" onClick={() => onSortClick('alpha')}>Name{sortArrow('alpha')}</th>
            <th className="fish-th-sort" onClick={onCategorySort}>Category{sortArrow('category')}</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={`${item.storeKey}-${item.id}`}
              className={isItemChecked(item, checkedMaps) ? 'chk' : ''}
              onClick={() => toggleItem(item.storeKey, item.id)}
              style={{ cursor: 'pointer' }}
            >
              <td><div className={`fish-grid-check${isItemChecked(item, checkedMaps) ? ' checked' : ''}`}><Checkmark /></div></td>
              <td className="fish-grid-name">{item.name}</td>
              <td>{item.category}</td>
              <td>{item.meta || item.detail || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return items.map((item) => (
    <CollectionItem
      key={`${item.storeKey}-${item.id}`}
      checked={isItemChecked(item, checkedMaps)}
      onClick={() => toggleItem(item.storeKey, item.id)}
      name={item.name}
      extra={item.extra}
      meta={item.meta ? <span className="cc-item-source">{item.meta}</span> : null}
      detail={item.detail}
    />
  ));
}
