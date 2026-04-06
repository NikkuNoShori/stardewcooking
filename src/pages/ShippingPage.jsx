import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { SHIPPING, SHIPPING_CATEGORIES } from '../data/shipping';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'category', label: 'By Category' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'season', label: 'By Season' },
];

export default function ShippingPage() {
  useCollectionSync();
  const shippingChecked = useCollectionStore((s) => s.shippingChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const sort = sortModes['shipping'] || 'category';

  const done = Object.keys(shippingChecked).length;
  const total = SHIPPING.length;

  const filtered = useFilteredItems(
    SHIPPING, 'shipping', 'shippingChecked',
    (s) => s.name,
    (s) => `${s.name} ${s.category} ${s.source} ${s.season?.join(' ') || ''}`,
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];

    if (sort === 'alpha') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      return [['All Items', sorted]];
    }

    if (sort === 'season') {
      const groups = { Spring: [], Summer: [], Fall: [], Winter: [], 'No Season': [] };
      sorted.forEach((s) => {
        if (!s.season || s.season.length === 0) {
          groups['No Season'].push(s);
        } else {
          s.season.forEach((sn) => {
            if (groups[sn]) groups[sn].push(s);
          });
        }
      });
      return Object.entries(groups).filter(([, items]) => items.length > 0);
    }

    // By category
    const groups = {};
    SHIPPING_CATEGORIES.forEach((cat) => { groups[cat] = []; });
    sorted.forEach((s) => {
      if (groups[s.category]) groups[s.category].push(s);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filtered, sort]);

  return (
    <div className="container">
      <CollectionHeader title="Shipping Collection" done={done} total={total} colorClass="shipping-progress" icon="📦" />
      <CollectionControls page="shipping" sortOptions={SORT_OPTIONS} done={done} total={total} />
      <div className="panel">
        {grouped.map(([group, items]) => {
          const groupDone = items.filter((s) => shippingChecked[s.name]).length;
          return (
            <div key={group}>
              <SectionHeader
                sectionKey={`shipping:${group}`}
                label={group}
                done={groupDone}
                total={items.length}
                defaultOpen={true}
              />
              <SectionItems items={items} shippingChecked={shippingChecked} toggleItem={toggleItem} sectionKey={`shipping:${group}`} />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No items match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, shippingChecked, toggleItem, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  return items.map((item) => (
    <CollectionItem
      key={item.name}
      checked={!!shippingChecked[item.name]}
      onClick={() => toggleItem('shippingChecked', item.name)}
      name={item.name}
      meta={
        <>
          <span className="cc-item-source">{item.source}</span>
          {item.season && (
            <span className="cc-item-seasons">
              {item.season.map((s) => (
                <span key={s} className={`cc-season cc-season-${s.toLowerCase()}`}>{s}</span>
              ))}
            </span>
          )}
        </>
      }
    />
  ));
}
