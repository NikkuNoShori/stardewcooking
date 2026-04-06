import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { CRAFTING, CRAFTING_CATEGORIES } from '../data/crafting';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'category', label: 'By Category' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'unlock', label: 'By Unlock Source' },
];

export default function CraftingPage() {
  useCollectionSync();
  const craftingChecked = useCollectionStore((s) => s.craftingChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const sort = sortModes['crafting'] || 'category';

  const done = Object.keys(craftingChecked).length;
  const total = CRAFTING.length;

  const filtered = useFilteredItems(
    CRAFTING, 'crafting', 'craftingChecked',
    (c) => c.name,
    (c) => `${c.name} ${c.ingredients} ${c.unlock} ${c.category}`,
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];

    if (sort === 'alpha') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      return [['All Recipes', sorted]];
    }

    if (sort === 'unlock') {
      sorted.sort((a, b) => a.unlock.localeCompare(b.unlock));
      return [['All Recipes', sorted]];
    }

    // By category
    const groups = {};
    CRAFTING_CATEGORIES.forEach((cat) => { groups[cat] = []; });
    sorted.forEach((c) => {
      if (groups[c.category]) groups[c.category].push(c);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filtered, sort]);

  return (
    <div className="container">
      <CollectionHeader title="Crafting Recipes" done={done} total={total} colorClass="crafting-progress" icon="🔨" />
      <CollectionControls page="crafting" sortOptions={SORT_OPTIONS} done={done} total={total} />
      <div className="panel">
        {grouped.map(([group, items]) => {
          const groupDone = items.filter((c) => craftingChecked[c.name]).length;
          return (
            <div key={group}>
              <SectionHeader
                sectionKey={`crafting:${group}`}
                label={group}
                done={groupDone}
                total={items.length}
                defaultOpen={true}
              />
              <SectionItems items={items} craftingChecked={craftingChecked} toggleItem={toggleItem} sectionKey={`crafting:${group}`} />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No recipes match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, craftingChecked, toggleItem, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  return items.map((item) => (
    <CollectionItem
      key={item.name}
      checked={!!craftingChecked[item.name]}
      onClick={() => toggleItem('craftingChecked', item.name)}
      name={item.name}
      extra={item.note ? <span className="cc-item-qty">{item.note}</span> : null}
      meta={
        <>
          <span className="cc-item-source">{item.ingredients}</span>
        </>
      }
      detail={`Unlock: ${item.unlock}`}
    />
  ));
}
