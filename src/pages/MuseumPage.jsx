import { useMemo, useCallback } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { MUSEUM_ITEMS } from '../data/museum';
import { useProfession } from '../context/ProfessionContext';
import {
  createProfessionPricePredicate,
  getPriceDisplay,
} from '../utils/professionPricing';
import PriceWithTooltip from '../components/PriceWithTooltip';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, Checkmark, useFilteredItems,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'type', label: 'By Type' },
  { value: 'type_desc', label: 'By Type (Desc)' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'alpha_desc', label: 'Z-A' },
  { value: 'source', label: 'By Source' },
  { value: 'source_desc', label: 'By Source (Z-A)' },
  { value: 'price', label: 'By Sell (High-Low)' },
  { value: 'price_asc', label: 'By Sell (Low-High)' },
];


export default function MuseumPage() {
  useCollectionSync();
  const museumChecked = useCollectionStore((s) => s.museumChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const viewModes = useCollectionStore((s) => s.viewModes);
  const setSort = useCollectionStore((s) => s.setSort);
  const sort = sortModes['museum'] || 'type';
  const viewMode = viewModes['museum'] || 'list';
  const { selection, priceFilterMode } = useProfession();
  const professionPredicate = useMemo(
    () => createProfessionPricePredicate(
      priceFilterMode,
      (item) => getPriceDisplay(item.price ?? 0, item, selection),
    ),
    [priceFilterMode, selection],
  );

  const done = Object.keys(museumChecked).length;
  const total = MUSEUM_ITEMS.length;

  const filtered = useFilteredItems(
    MUSEUM_ITEMS, 'museum', 'museumChecked',
    (m) => m.name,
    (m) => `${m.name} ${m.source} ${m.altSources || ''} ${m.category}`,
    { extraPredicate: professionPredicate },
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
    if (sort === 'price' || sort === 'price_asc') {
      sorted.sort((a, b) => {
        const pa = getPriceDisplay(a.price ?? 0, a, selection);
        const pb = getPriceDisplay(b.price ?? 0, b, selection);
        return pa.adjustedPrice - pb.adjustedPrice;
      });
      if (sort === 'price') sorted.reverse();
      return [['All Items', sorted]];
    }
    // By type
    const artifacts = sorted.filter((m) => m.category === 'Artifact');
    const minerals = sorted.filter((m) => m.category === 'Mineral');
    const groups = sort === 'type_desc'
      ? [['Minerals', minerals], ['Artifacts', artifacts]]
      : [['Artifacts', artifacts], ['Minerals', minerals]];
    const filteredGroups = [];
    groups.forEach(([label, list]) => {
      if (list.length > 0) filteredGroups.push([label, list]);
    });
    return filteredGroups;
  }, [filtered, sort, selection]);

  const toggleSortMode = useCallback((ascMode, descMode = null) => {
    const nextDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return setSort('museum', nextDescMode);
    if (sort === nextDescMode) return setSort('museum', ascMode);
    return setSort('museum', ascMode);
  }, [setSort, sort]);

  const sortArrow = useCallback((ascMode, descMode = null) => {
    const activeDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return ' \u2191';
    if (sort === activeDescMode) return ' \u2193';
    return ' \u21D5';
  }, [sort]);

  return (
    <div className="container">
      <CollectionHeader title="Museum Collection" done={done} total={total} colorClass="museum-progress" icon="🏛️" />
      <CollectionControls
        page="museum"
        sortOptions={SORT_OPTIONS}
        done={done}
        total={total}
        enableViewToggle={true}
        defaultViewMode="list"
        showExpandCollapse={true}
        collapsePrefix="museum:"
      />
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
              <SectionItems
                items={items}
                museumChecked={museumChecked}
                toggleItem={toggleItem}
                sectionKey={`museum:${group}`}
                professionSelection={selection}
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

function SectionItems({ items, museumChecked, toggleItem, sectionKey, professionSelection, viewMode, onSortClick, sortArrow }) {
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
            <th className="fish-th-sort" onClick={() => onSortClick('type', 'type_desc')}>Category{sortArrow('type', 'type_desc')}</th>
            <th className="fish-th-sort" onClick={() => onSortClick('price', 'price_asc')}>Sell{sortArrow('price_asc', 'price')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.name}
              className={museumChecked[item.name] ? 'chk' : ''}
              onClick={() => toggleItem('museumChecked', item.name)}
              style={{ cursor: 'pointer' }}
            >
              <td><div className={`fish-grid-check${museumChecked[item.name] ? ' checked' : ''}`}><Checkmark /></div></td>
              <td className="fish-grid-name">{item.name}</td>
              <td>{item.source}</td>
              <td>{item.category}</td>
              <td>{item.price ? <PriceWithTooltip value={item.price} item={item} selection={professionSelection} className="fish-price" /> : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return items.map((item) => {
    return (
    <CollectionItem
      key={item.name}
      checked={!!museumChecked[item.name]}
      onClick={() => toggleItem('museumChecked', item.name)}
      name={item.name}
      extra={
        item.price ? (
          <PriceWithTooltip
            value={item.price}
            item={item}
            selection={professionSelection}
            className="fish-price"
          />
        ) : null
      }
      meta={
        <>
          <span className="cc-item-source">{item.source}</span>
          {item.altSources && <span className="cc-item-source">Also: {item.altSources}</span>}
        </>
      }
      detail={item.tip}
    />
    );
  });
}
