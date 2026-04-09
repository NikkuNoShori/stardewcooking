import { useMemo, useCallback } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { SHIPPING, SHIPPING_CATEGORIES } from '../data/shipping';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, Checkmark, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'category', label: 'By Category' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'alpha_desc', label: 'Z-A' },
  { value: 'source', label: 'By Source' },
  { value: 'source_desc', label: 'By Source (Z-A)' },
  { value: 'season', label: 'By Season' },
];

export default function ShippingPage() {
  useCollectionSync();
  const shippingChecked = useCollectionStore((s) => s.shippingChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const viewModes = useCollectionStore((s) => s.viewModes);
  const setSort = useCollectionStore((s) => s.setSort);
  const sort = sortModes['shipping'] || 'category';
  const viewMode = viewModes['shipping'] || 'list';

  const done = Object.keys(shippingChecked).length;
  const total = SHIPPING.length;

  const filtered = useFilteredItems(
    SHIPPING, 'shipping', 'shippingChecked',
    (s) => s.name,
    (s) => `${s.name} ${s.category} ${s.source} ${s.season?.join(' ') || ''}`,
  );

  const grouped = useMemo(() => {
    let sorted = [...filtered];

    if (sort === 'alpha' || sort === 'alpha_desc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      if (sort === 'alpha_desc') sorted.reverse();
      return [['All Items', sorted]];
    }

    if (sort === 'source' || sort === 'source_desc') {
      sorted.sort((a, b) => a.source.localeCompare(b.source));
      if (sort === 'source_desc') sorted.reverse();
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

  const toggleSortMode = useCallback((ascMode, descMode = null) => {
    const nextDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return setSort('shipping', nextDescMode);
    if (sort === nextDescMode) return setSort('shipping', ascMode);
    return setSort('shipping', ascMode);
  }, [setSort, sort]);

  const sortArrow = useCallback((ascMode, descMode = null) => {
    const activeDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return ' \u2191';
    if (sort === activeDescMode) return ' \u2193';
    return ' \u21D5';
  }, [sort]);

  return (
    <div className="container">
      <CollectionHeader title="Shipping Collection" done={done} total={total} colorClass="shipping-progress" icon="📦" />
      <CollectionControls
        page="shipping"
        sortOptions={SORT_OPTIONS}
        done={done}
        total={total}
        enableViewToggle={true}
        defaultViewMode="list"
        showExpandCollapse={true}
        collapsePrefix="shipping:"
      />
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
              <SectionItems
                items={items}
                shippingChecked={shippingChecked}
                toggleItem={toggleItem}
                sectionKey={`shipping:${group}`}
                viewMode={viewMode}
                onSortClick={toggleSortMode}
                sortArrow={sortArrow}
              />
            </div>
          );
        })}
        {grouped.length === 0 && <div className="empty">No items match your filters</div>}
      </div>
    </div>
  );
}

function SectionItems({ items, shippingChecked, toggleItem, sectionKey, viewMode, onSortClick, sortArrow }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  if (viewMode === 'table') {
    return (
      <table className="fish-grid-tbl">
        <thead>
          <tr>
            <th></th>
            <th className="fish-th-sort" onClick={() => onSortClick('alpha')}>Name{sortArrow('alpha')}</th>
            <th className="fish-th-sort" onClick={() => onSortClick('source')}>Source{sortArrow('source')}</th>
            <th className="fish-th-sort" onClick={() => onSortClick('season')}>Season{sortArrow('season')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.name}
              className={shippingChecked[item.name] ? 'chk' : ''}
              onClick={() => toggleItem('shippingChecked', item.name)}
              style={{ cursor: 'pointer' }}
            >
              <td><div className={`fish-grid-check${shippingChecked[item.name] ? ' checked' : ''}`}><Checkmark /></div></td>
              <td className="fish-grid-name">{item.name}</td>
              <td>{item.source}</td>
              <td><span className="cc-item-seasons">{item.season?.map((s) => <span key={s} className={`cc-season cc-season-${s.toLowerCase()}`}>{s}</span>)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

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
