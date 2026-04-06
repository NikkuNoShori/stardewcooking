import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { MUSEUM_ITEMS, MUSEUM_REWARDS } from '../data/museum';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'type', label: 'By Type' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'source', label: 'By Source' },
];

function NextReward({ count }) {
  const next = MUSEUM_REWARDS.find((r) => r.count > count);
  if (!next) return <span className="museum-reward-text">All rewards claimed!</span>;
  return (
    <span className="museum-reward-text">
      Next reward at {next.count}: {next.reward}
    </span>
  );
}

export default function MuseumPage() {
  useCollectionSync();
  const museumChecked = useCollectionStore((s) => s.museumChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const sort = sortModes['museum'] || 'type';

  const done = Object.keys(museumChecked).length;
  const total = MUSEUM_ITEMS.length;

  const filtered = useFilteredItems(
    MUSEUM_ITEMS, 'museum', 'museumChecked',
    (m) => m.name,
    (m) => `${m.name} ${m.source} ${m.altSources || ''} ${m.category}`,
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];
    if (sort === 'alpha') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      return [['All Items', sorted]];
    }
    if (sort === 'source') {
      sorted.sort((a, b) => a.source.localeCompare(b.source));
      return [['All Items', sorted]];
    }
    // By type
    const artifacts = sorted.filter((m) => m.category === 'Artifact');
    const minerals = sorted.filter((m) => m.category === 'Mineral');
    const groups = [];
    if (artifacts.length > 0) groups.push(['Artifacts', artifacts]);
    if (minerals.length > 0) groups.push(['Minerals', minerals]);
    return groups;
  }, [filtered, sort]);

  return (
    <div className="container">
      <CollectionHeader title="Museum Collection" done={done} total={total} colorClass="museum-progress" />
      <div className="note">
        <b>{done}/95</b> donated — <NextReward count={done} />
      </div>
      <CollectionControls page="museum" sortOptions={SORT_OPTIONS} done={done} total={total} />
      <div className="panel">
        {grouped.map(([group, items]) => {
          const groupDone = items.filter((m) => museumChecked[m.name]).length;
          return (
            <div key={group}>
              <SectionHeader
                sectionKey={`museum:${group}`}
                label={group}
                done={groupDone}
                total={items.length}
                defaultOpen={true}
              />
              <SectionItems items={items} museumChecked={museumChecked} toggleItem={toggleItem} sectionKey={`museum:${group}`} />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No items match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, museumChecked, toggleItem, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  return items.map((item) => (
    <CollectionItem
      key={item.name}
      checked={!!museumChecked[item.name]}
      onClick={() => toggleItem('museumChecked', item.name)}
      name={item.name}
      extra={
        item.price ? <span className="fish-price">{item.price}g</span> : null
      }
      meta={
        <>
          <span className="cc-item-source">{item.source}</span>
          {item.altSources && <span className="cc-item-source">Also: {item.altSources}</span>}
        </>
      }
      detail={item.tip}
    />
  ));
}
