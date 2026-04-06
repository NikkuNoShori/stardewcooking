import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';

// Shared checkbox SVG
export function Checkmark() {
  return (
    <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

// Collapsible section header
export function SectionHeader({ sectionKey, label, done, total, defaultOpen = true }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  const toggleSection = useCollectionStore((s) => s.toggleSection);
  const isCollapsed = collapsed[sectionKey] ?? !defaultOpen;

  return (
    <div
      className="cc-bundle-hdr"
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
      <span className="cc-bundle-name">{label}</span>
      <span className="cc-bundle-progress">{done}/{total}</span>
    </div>
  );
}

// Search + filter + sort controls
// Pass done/total to show counts in the filter buttons
export function CollectionControls({ page, sortOptions, done = null, total = null }) {
  const searchQueries = useCollectionStore((s) => s.searchQueries);
  const filters = useCollectionStore((s) => s.filters);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const setSearch = useCollectionStore((s) => s.setSearch);
  const setFilter = useCollectionStore((s) => s.setFilter);
  const setSort = useCollectionStore((s) => s.setSort);

  const query = searchQueries[page] || '';
  const filter = filters[page] || 'all';
  const sort = sortModes[page] || (sortOptions?.[0]?.value ?? 'alpha');

  const hasCounts = done !== null && total !== null;
  const rem = hasCounts ? total - done : null;

  const filterLabels = {
    all: hasCounts ? `All (${total})` : 'All',
    remaining: hasCounts ? `Remaining (${rem})` : 'Remaining',
    completed: hasCounts ? `Completed (${done})` : 'Completed',
  };

  return (
    <div className="collection-controls">
      <div className="filter-bar">
        {['all', 'remaining', 'completed'].map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(page, f)}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>
      <div className="controls-bar">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setSearch(page, e.target.value)}
          />
          {query && (
            <button className="search-clear" onClick={() => setSearch(page, '')}>
              &times;
            </button>
          )}
        </div>
        {sortOptions && sortOptions.length > 0 && (
          <div className="sort-wrap">
            <select value={sort} onChange={(e) => setSort(page, e.target.value)}>
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

// Progress header
export function CollectionHeader({ title, done, total, colorClass, icon }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <header className="header">
      <h1>{icon && <span className="header-icon">{icon}</span>}{title}</h1>
      <p className="subtitle">{done} of {total} collected</p>
      <div className="progress-wrap">
        <div className={`progress-bar ${colorClass || ''}`} style={{ width: `${pct}%` }} />
        <div className="progress-text">{done} / {total} — {pct}%</div>
      </div>
    </header>
  );
}

// Single clickable item row
export function CollectionItem({ checked, onClick, name, meta, detail, extra }) {
  return (
    <div className={`cc-item${checked ? ' cc-item-done' : ''}`} onClick={onClick}>
      <div className="cc-item-check">
        <Checkmark />
      </div>
      <div className="cc-item-info">
        <div className="cc-item-top">
          <span className="cc-item-name">{name}</span>
          {extra}
        </div>
        {meta && <div className="cc-item-meta">{meta}</div>}
        {detail && <div className="cc-item-source" style={{ marginTop: 2 }}>{detail}</div>}
      </div>
    </div>
  );
}

// Hook to get filtered items
export function useFilteredItems(items, page, storeKey, getItemId, getSearchText) {
  const searchQueries = useCollectionStore((s) => s.searchQueries);
  const filters = useCollectionStore((s) => s.filters);
  const checked = useCollectionStore((s) => s[storeKey]);

  const query = (searchQueries[page] || '').toLowerCase().trim();
  const filter = filters[page] || 'all';

  return useMemo(() => {
    return items.filter((item) => {
      const id = getItemId(item);
      const isChecked = !!checked[id];

      if (filter === 'completed' && !isChecked) return false;
      if (filter === 'remaining' && isChecked) return false;
      if (query && !getSearchText(item).toLowerCase().includes(query)) return false;

      return true;
    });
  }, [items, query, filter, checked]);
}
