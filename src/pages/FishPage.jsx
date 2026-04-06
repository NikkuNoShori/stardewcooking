import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { FISH, FISH_CATEGORIES } from '../data/fish';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'alpha', label: 'A-Z' },
  { value: 'category', label: 'By Category' },
  { value: 'season', label: 'By Season' },
  { value: 'location', label: 'By Location' },
  { value: 'difficulty', label: 'By Difficulty' },
];

function DifficultyBadge({ difficulty }) {
  if (difficulty === 0) return null;
  let cls = 'diff-easy';
  if (difficulty > 85) cls = 'diff-extreme';
  else if (difficulty > 65) cls = 'diff-hard';
  else if (difficulty > 40) cls = 'diff-medium';
  return <span className={`fish-diff ${cls}`}>{difficulty}</span>;
}

function SeasonTags({ seasons }) {
  if (!seasons) return null;
  return (
    <span className="cc-item-seasons">
      {seasons.map((s) => (
        <span key={s} className={`cc-season cc-season-${s.toLowerCase()}`}>{s}</span>
      ))}
    </span>
  );
}

export default function FishPage() {
  useCollectionSync();
  const fishChecked = useCollectionStore((s) => s.fishChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const sort = sortModes['fish'] || 'category';

  const done = Object.keys(fishChecked).length;
  const total = FISH.length;

  const filtered = useFilteredItems(
    FISH, 'fish', 'fishChecked',
    (f) => f.name,
    (f) => `${f.name} ${f.location} ${f.category} ${f.season?.join(' ') || ''}`,
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];
    if (sort === 'alpha') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'difficulty') sorted.sort((a, b) => b.difficulty - a.difficulty);
    else if (sort === 'location') sorted.sort((a, b) => a.location.localeCompare(b.location));

    if (sort === 'category') {
      const groups = {};
      FISH_CATEGORIES.forEach((cat) => { groups[cat] = []; });
      sorted.forEach((f) => {
        if (groups[f.category]) groups[f.category].push(f);
      });
      return Object.entries(groups).filter(([, items]) => items.length > 0);
    }

    if (sort === 'season') {
      const groups = { Spring: [], Summer: [], Fall: [], Winter: [], Any: [] };
      sorted.forEach((f) => {
        const seasons = f.season || ['Any'];
        seasons.forEach((s) => {
          if (groups[s]) groups[s].push(f);
          else if (groups['Any']) groups['Any'].push(f);
        });
      });
      return Object.entries(groups).filter(([, items]) => items.length > 0);
    }

    return [['All Fish', sorted]];
  }, [filtered, sort]);

  return (
    <div className="container">
      <CollectionHeader title="Fish Collection" done={done} total={total} colorClass="fish-progress" icon="🐟" />
      <CollectionControls page="fish" sortOptions={SORT_OPTIONS} done={done} total={total} />
      <div className="panel">
        {grouped.map(([group, items]) => {
          const groupDone = items.filter((f) => fishChecked[f.name]).length;
          return (
            <div key={group}>
              <SectionHeader
                sectionKey={`fish:${group}`}
                label={group}
                done={groupDone}
                total={items.length}
                defaultOpen={true}
              />
              <SectionItems items={items} fishChecked={fishChecked} toggleItem={toggleItem} sectionKey={`fish:${group}`} />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No fish match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, fishChecked, toggleItem, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  return items.map((fish) => (
    <CollectionItem
      key={fish.name}
      checked={!!fishChecked[fish.name]}
      onClick={() => toggleItem('fishChecked', fish.name)}
      name={fish.name}
      extra={<DifficultyBadge difficulty={fish.difficulty} />}
      meta={
        <>
          <span className="cc-item-source">{fish.location}</span>
          <SeasonTags seasons={fish.season} />
          {fish.weather !== 'Any' && (
            <span className="fish-weather">{fish.weather}</span>
          )}
          {fish.time !== 'Any' && (
            <span className="cc-item-source">{fish.time}</span>
          )}
          <span className="fish-price">{fish.price}g</span>
        </>
      }
      detail={fish.note}
    />
  ));
}
