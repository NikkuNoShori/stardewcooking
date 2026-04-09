import { useMemo, useEffect, useCallback } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { WALNUTS, WALNUT_AREAS } from '../data/walnuts';
import { FIELD_OFFICE_ITEMS, FIELD_OFFICE_SURVEYS } from '../data/fieldOffice';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem, Checkmark,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'area', label: 'By Area' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'alpha_desc', label: 'Z-A' },
];

const ALL_WALNUTS = WALNUTS.filter((w) => w.count > 0);
const WALNUT_TOTAL = WALNUTS.reduce((s, w) => s + w.count, 0);

// Category header — sits above sub-sections
function CategoryHeader({ label, done, total, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  const toggleSection = useCollectionStore((s) => s.toggleSection);
  const ensureSectionState = useCollectionStore((s) => s.ensureSectionState);
  const isCollapsed = collapsed[sectionKey] ?? false;

  useEffect(() => {
    ensureSectionState(sectionKey, false);
  }, [ensureSectionState, sectionKey]);

  return (
    <div
      className="island-category-hdr"
      onClick={() => toggleSection(sectionKey)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSection(sectionKey);
        }
      }}
    >
      <span className={`chevron ${isCollapsed ? '' : 'chevron-open'}`}>&#9654;</span>
      <span className="island-category-label">{label}</span>
      <span className="island-category-count">{done}/{total}</span>
    </div>
  );
}

function CollapsibleItems({ items, sectionKey, checkedMap, storeKey, toggleItem, viewMode, onSortClick, sortArrow }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  if (viewMode === 'table') {
    return (
      <table className="fish-grid-tbl">
        <thead>
          <tr>
            <th></th>
            <th className="fish-th-sort" onClick={() => onSortClick('alpha')}>Name{sortArrow('alpha')}</th>
            <th className="fish-th-sort" onClick={() => onSortClick('area', 'area')}>Source{sortArrow('area', 'area')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            const itemId = item.id || item.name;
            return (
              <tr
                key={item.id || `${item.name}-${idx}`}
                className={checkedMap[itemId] ? 'chk' : ''}
                onClick={() => toggleItem(storeKey, itemId)}
                style={{ cursor: 'pointer' }}
              >
                <td><div className={`fish-grid-check${checkedMap[itemId] ? ' checked' : ''}`}><Checkmark /></div></td>
                <td className="fish-grid-name">{item.description || item.name}</td>
                <td>{item.area || item.source}{item.tip ? ` — ${item.tip}` : ''}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return items.map((item, idx) => (
    <CollectionItem
      key={item.id || `${item.name}-${idx}`}
      checked={!!checkedMap[item.id || item.name]}
      onClick={() => toggleItem(storeKey, item.id || item.name)}
      name={item.description || item.name}
      extra={item.count > 1 ? <span className="cc-item-qty">x{item.count}</span> : null}
      meta={
        <span className="cc-item-source">
          {item.area || item.source}
          {item.tip ? ` — ${item.tip}` : ''}
        </span>
      }
    />
  ));
}

export default function IslandPage() {
  useCollectionSync();
  const walnutChecked = useCollectionStore((s) => s.walnutChecked);
  const fieldOfficeChecked = useCollectionStore((s) => s.fieldOfficeChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const setSort = useCollectionStore((s) => s.setSort);
  const searchQueries = useCollectionStore((s) => s.searchQueries);
  const filters = useCollectionStore((s) => s.filters);
  const viewModes = useCollectionStore((s) => s.viewModes);
  const sort = sortModes['island'] || 'area';
  const viewMode = viewModes['island'] || 'list';
  const query = (searchQueries['island'] || '').toLowerCase().trim();
  const filter = filters['island'] || 'all';

  const walnutDone = ALL_WALNUTS.filter((w) => walnutChecked[w.id]).reduce((s, w) => s + w.count, 0);
  const foDone = Object.keys(fieldOfficeChecked).length;
  const foTotal = FIELD_OFFICE_ITEMS.length;

  // Filter walnuts
  const filteredWalnuts = useMemo(() => {
    return ALL_WALNUTS.filter((w) => {
      const isChecked = !!walnutChecked[w.id];
      if (filter === 'completed' && !isChecked) return false;
      if (filter === 'remaining' && isChecked) return false;
      if (query && !`${w.description} ${w.area}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [walnutChecked, query, filter]);

  // Filter field office
  const filteredFO = useMemo(() => {
    return FIELD_OFFICE_ITEMS.filter((item) => {
      const isChecked = !!fieldOfficeChecked[item.name];
      if (filter === 'completed' && !isChecked) return false;
      if (filter === 'remaining' && isChecked) return false;
      if (query && !`${item.name} ${item.source} ${item.survey}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [fieldOfficeChecked, query, filter]);

  // Group walnuts by area
  const walnutGroups = useMemo(() => {
    if (sort === 'alpha' || sort === 'alpha_desc') {
      const sorted = [...filteredWalnuts].sort((a, b) => a.description.localeCompare(b.description));
      if (sort === 'alpha_desc') sorted.reverse();
      return [['All Walnuts', sorted]];
    }
    const groups = {};
    WALNUT_AREAS.forEach((a) => { groups[a] = []; });
    filteredWalnuts.forEach((w) => {
      if (groups[w.area]) groups[w.area].push(w);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filteredWalnuts, sort]);

  // Group field office by survey
  const foGroups = useMemo(() => {
    const groups = [];
    FIELD_OFFICE_SURVEYS.forEach((survey) => {
      const items = filteredFO.filter((i) => i.survey === survey.name);
      if (items.length > 0) groups.push([survey.name, items]);
    });
    return groups;
  }, [filteredFO]);

  const walnutsCategoryCollapsed = collapsed['island:cat:walnuts'] ?? false;
  const foCategoryCollapsed = collapsed['island:cat:fieldoffice'] ?? false;

  const toggleSortMode = useCallback((ascMode, descMode = null) => {
    const nextDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return setSort('island', nextDescMode);
    if (sort === nextDescMode) return setSort('island', ascMode);
    return setSort('island', ascMode);
  }, [setSort, sort]);

  const sortArrow = useCallback((ascMode, descMode = null) => {
    const activeDescMode = descMode || `${ascMode}_desc`;
    if (sort === ascMode) return ' \u2191';
    if (sort === activeDescMode) return ' \u2193';
    return ' \u21D5';
  }, [sort]);

  return (
    <div className="container">
      <CollectionHeader
        title="Ginger Island"
        done={walnutDone + foDone}
        total={WALNUT_TOTAL + foTotal}
        colorClass="island-progress"
        icon="🌴"
      />
      <CollectionControls
        page="island"
        sortOptions={SORT_OPTIONS}
        done={walnutDone + foDone}
        total={WALNUT_TOTAL + foTotal}
        enableViewToggle={true}
        defaultViewMode="list"
        showExpandCollapse={true}
        collapsePrefix="island:"
      />
      <div className="panel">
        {/* Golden Walnuts category */}
        {filteredWalnuts.length > 0 && (
          <>
            <CategoryHeader
              label="Golden Walnuts"
              done={walnutDone}
              total={WALNUT_TOTAL}
              sectionKey="island:cat:walnuts"
            />
            {!walnutsCategoryCollapsed && walnutGroups.map(([group, items]) => {
              const gDone = items.filter((w) => walnutChecked[w.id]).length;
              return (
                <div key={group}>
                  <SectionHeader
                    sectionKey={`island:${group}`}
                    label={group}
                    done={gDone}
                    total={items.length}
                    defaultOpen={true}
                  />
                  <CollapsibleItems
                    items={items}
                    sectionKey={`island:${group}`}
                    checkedMap={walnutChecked}
                    storeKey="walnutChecked"
                    toggleItem={toggleItem}
                    viewMode={viewMode}
                    onSortClick={toggleSortMode}
                    sortArrow={sortArrow}
                  />
                </div>
              );
            })}
          </>
        )}

        {/* Field Office category */}
        {filteredFO.length > 0 && (
          <>
            <CategoryHeader
              label="Field Office"
              done={foDone}
              total={foTotal}
              sectionKey="island:cat:fieldoffice"
            />
            {!foCategoryCollapsed && foGroups.map(([survey, items]) => {
              const sDone = items.filter((i) => fieldOfficeChecked[i.name]).length;
              return (
                <div key={survey}>
                  <SectionHeader
                    sectionKey={`island:fo:${survey}`}
                    label={survey}
                    done={sDone}
                    total={items.length}
                    defaultOpen={true}
                  />
                  <CollapsibleItems
                    items={items}
                    sectionKey={`island:fo:${survey}`}
                    checkedMap={fieldOfficeChecked}
                    storeKey="fieldOfficeChecked"
                    toggleItem={toggleItem}
                    viewMode={viewMode}
                    onSortClick={toggleSortMode}
                    sortArrow={sortArrow}
                  />
                </div>
              );
            })}
          </>
        )}

        {filteredWalnuts.length === 0 && filteredFO.length === 0 && (
          <div className="empty">No items match your filters</div>
        )}
      </div>
    </div>
  );
}
