import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { STARDROPS } from '../data/stardrops';
import { SECRET_NOTES, JOURNAL_SCRAPS } from '../data/secretNotes';
import { MONSTER_GOALS } from '../data/monsters';
import { CollectionHeader, CollectionControls, SectionHeader, CollectionItem } from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'category', label: 'By Category' },
  { value: 'alpha', label: 'A-Z' },
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
    if (sort === 'alpha') {
      const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      return [['All Items', sorted]];
    }
    const groups = {};
    CATEGORY_ORDER.forEach((c) => { groups[c] = []; });
    filtered.forEach((item) => {
      if (groups[item.category]) groups[item.category].push(item);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filtered, sort]);

  return (
    <div className="container">
      <CollectionHeader title="Misc Trackers" done={totalDone} total={totalItems} colorClass="misc-progress" icon="⭐" />
      <CollectionControls page="misc" sortOptions={SORT_OPTIONS} done={totalDone} total={totalItems} />
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
              <MiscSectionItems items={items} checkedMaps={checkedMaps} toggleItem={toggleItem} sectionKey={`misc:${group}`} />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No items match your filters</div>}
      </div>
    </div>
  );
}

function MiscSectionItems({ items, checkedMaps, toggleItem, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

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
