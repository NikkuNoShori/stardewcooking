import { useMemo, useCallback } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { CRAFTING, CRAFTING_CATEGORIES } from '../data/crafting';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, Checkmark, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'category', label: 'By Category' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'alpha_desc', label: 'Z-A' },
  { value: 'unlock', label: 'By Unlock Source' },
  { value: 'unlock_desc', label: 'By Unlock Source (Z-A)' },
];

export default function CraftingPage() {
  useCollectionSync();
  const craftingChecked = useCollectionStore((s) => s.craftingChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const viewModes = useCollectionStore((s) => s.viewModes);
  const setSort = useCollectionStore((s) => s.setSort);
  const sort = sortModes['crafting'] || 'category';
  const viewMode = viewModes['crafting'] || 'list';

  const done = Object.keys(craftingChecked).length;
  const total = CRAFTING.length;

  const filtered = useFilteredItems(
    CRAFTING, 'crafting', 'craftingChecked',
    (c) => c.name,
    (c) => `${c.name} ${c.ingredients} ${c.unlock} ${c.category}`,
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];

    if (sort === 'alpha' || sort === 'alpha_desc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === 'alpha_desc') sorted.reverse();
      return [['All Recipes', sorted]];
    }

    if (sort === 'unlock' || sort === 'unlock_desc') {
      sorted.sort((a, b) => a.unlock.localeCompare(b.unlock));
      if (sort === 'unlock_desc') sorted.reverse();
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

  const toggleSortMode = useCallback((ascMode, descMode = null) => {
    const nextDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return setSort('crafting', nextDescMode);
    if (sort === nextDescMode) return setSort('crafting', ascMode);
    return setSort('crafting', ascMode);
  }, [setSort, sort]);

  const sortArrow = useCallback((ascMode, descMode = null) => {
    const activeDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return ' \u2191';
    if (sort === activeDescMode) return ' \u2193';
    return ' \u21D5';
  }, [sort]);

  return (
    <div className="container">
      <CollectionHeader title="Crafting Recipes" done={done} total={total} colorClass="crafting-progress" icon="🔨" />
      <CollectionControls
        page="crafting"
        sortOptions={SORT_OPTIONS}
        done={done}
        total={total}
        enableViewToggle={true}
        defaultViewMode="list"
        showExpandCollapse={true}
        collapsePrefix="crafting:"
      />
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
              <SectionItems
                items={items}
                craftingChecked={craftingChecked}
                toggleItem={toggleItem}
                sectionKey={`crafting:${group}`}
                viewMode={viewMode}
                onSortClick={toggleSortMode}
                sortArrow={sortArrow}
              />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No recipes match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, craftingChecked, toggleItem, sectionKey, viewMode, onSortClick, sortArrow }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  if (viewMode === 'table') {
    return (
      <table className="fish-grid-tbl">
        <thead>
          <tr>
            <th></th>
            <th className="fish-th-sort" onClick={() => onSortClick('alpha')}>Name{sortArrow('alpha')}</th>
            <th>Ingredients</th>
            <th className="fish-th-sort" onClick={() => onSortClick('unlock')}>Unlock{sortArrow('unlock')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.name}
              className={craftingChecked[item.name] ? 'chk' : ''}
              onClick={() => toggleItem('craftingChecked', item.name)}
              style={{ cursor: 'pointer' }}
            >
              <td><div className={`fish-grid-check${craftingChecked[item.name] ? ' checked' : ''}`}><Checkmark /></div></td>
              <td className="fish-grid-name">{item.name}</td>
              <td>{item.ingredients}</td>
              <td>{item.unlock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

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
