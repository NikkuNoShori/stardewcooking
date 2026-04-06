import { useMemo } from 'react';
import { useBundleStore } from '../hooks/useBundleStore';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useBundleSync } from '../hooks/useBundleSync';
import { ROOMS, SEASONS, CATEGORIES, QUALITY_LABELS, QUALITY_COLORS } from '../data/bundles';
import { useIsMobile } from '../hooks/useMediaQuery';

function RoomTabs() {
  const activeRoom = useBundleStore((s) => s.activeRoom);
  const setActiveRoom = useBundleStore((s) => s.setActiveRoom);

  return (
    <div className="cc-room-tabs">
      {ROOMS.map((room) => (
        <button
          key={room.key}
          className={`cc-room-tab${activeRoom === room.key ? ' active' : ''}`}
          onClick={() => setActiveRoom(room.key)}
          style={{
            '--room-color': room.color,
            '--room-color-bg': room.color + '18',
          }}
        >
          <span className="cc-room-name">{room.name}</span>
          <RoomBadge room={room} />
        </button>
      ))}
    </div>
  );
}

function RoomBadge({ room }) {
  const getRoomProgress = useBundleStore((s) => s.getRoomProgress);
  const { completed, total } = getRoomProgress(room);
  const done = completed === total;
  return (
    <span className={`cc-badge${done ? ' cc-badge-done' : ''}`}>
      {completed}/{total}
    </span>
  );
}

function Filters() {
  const seasonFilter = useBundleStore((s) => s.seasonFilter);
  const categoryFilter = useBundleStore((s) => s.categoryFilter);
  const bundleSearch = useBundleStore((s) => s.bundleSearch);
  const setSeasonFilter = useBundleStore((s) => s.setSeasonFilter);
  const setCategoryFilter = useBundleStore((s) => s.setCategoryFilter);
  const setBundleSearch = useBundleStore((s) => s.setBundleSearch);

  return (
    <div className="cc-filters">
      <div className="cc-search-wrap">
        <input
          type="text"
          className="cc-search"
          placeholder="Search items..."
          value={bundleSearch}
          onChange={(e) => setBundleSearch(e.target.value)}
        />
      </div>
      <div className="cc-filter-row">
        <select
          className="cc-select"
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
        >
          <option value="all">All Seasons</option>
          {SEASONS.filter((s) => s !== 'Any').map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="cc-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function BundleCard({ room, bundle }) {
  const bundleChecked = useCollectionStore((s) => s.bundleChecked);
  const toggleBundleItem = useBundleStore((s) => s.toggleBundleItem);
  const collapsedBundles = useBundleStore((s) => s.collapsedBundles);
  const toggleBundleCollapse = useBundleStore((s) => s.toggleBundleCollapse);
  const seasonFilter = useBundleStore((s) => s.seasonFilter);
  const categoryFilter = useBundleStore((s) => s.categoryFilter);
  const bundleSearch = useBundleStore((s) => s.bundleSearch);
  const isMobile = useIsMobile();

  const collapseKey = `${room.key}:${bundle.name}`;
  const isCollapsed = collapsedBundles[collapseKey] ?? false;

  const needed = bundle.pick || bundle.slots;
  const doneCount = bundle.items.filter(
    (item) => !!bundleChecked[`${room.key}:${bundle.name}:${item[0]}`]
  ).length;
  const bundleComplete = doneCount >= needed;

  // Filter items
  const filteredItems = useMemo(() => {
    const q = bundleSearch.toLowerCase().trim();
    return bundle.items.filter((item) => {
      if (seasonFilter !== 'all' && !item[3].includes(seasonFilter) && !item[3].includes('Any')) {
        return false;
      }
      if (categoryFilter !== 'all' && item[5] !== categoryFilter) {
        return false;
      }
      if (q && !item[0].toLowerCase().includes(q) && !item[4].toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [bundle.items, seasonFilter, categoryFilter, bundleSearch]);

  // Hide bundle if no items match filters
  if (filteredItems.length === 0) return null;

  return (
    <div className={`cc-bundle${bundleComplete ? ' cc-bundle-done' : ''}`}>
      <div
        className="cc-bundle-hdr"
        onClick={() => toggleBundleCollapse(room.key, bundle.name, false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleBundleCollapse(room.key, bundle.name, false);
          }
        }}
      >
        <span className={`chevron ${isCollapsed ? '' : 'chevron-open'}`}>&#9654;</span>
        <span className="cc-bundle-name">{bundle.name}</span>
        <span className="cc-bundle-progress">
          {doneCount}/{needed}
          {bundle.pick && <span className="cc-pick-label"> (pick {bundle.pick})</span>}
        </span>
      </div>
      {!isCollapsed && (
        <div className="cc-bundle-items">
          {bundle.reward && (
            <div className="cc-reward">Reward: {bundle.reward}</div>
          )}
          {filteredItems.map((item, idx) => {
            const itemKey = `${room.key}:${bundle.name}:${item[0]}`;
            const checked = !!bundleChecked[itemKey];
            return (
              <div
                key={idx}
                className={`cc-item${checked ? ' cc-item-done' : ''}`}
                onClick={() => toggleBundleItem(room.key, bundle.name, item[0])}
              >
                <div className="cc-item-check">
                  <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="cc-item-info">
                  <div className="cc-item-top">
                    <span className="cc-item-name">{item[0]}</span>
                    {item[1] > 1 && <span className="cc-item-qty">x{item[1]}</span>}
                    {item[2] > 0 && (
                      <span className="cc-item-quality" style={{ color: QUALITY_COLORS[item[2]] }}>
                        {QUALITY_LABELS[item[2]]}
                      </span>
                    )}
                  </div>
                  <div className="cc-item-meta">
                    <span className="cc-item-source">{item[4]}</span>
                    <span className="cc-item-seasons">
                      {item[3].map((s) => (
                        <span key={s} className={`cc-season cc-season-${s.toLowerCase()}`}>{s}</span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OverallProgress() {
  const getRoomProgress = useBundleStore((s) => s.getRoomProgress);
  let totalBundles = 0;
  let completedBundles = 0;
  ROOMS.forEach((room) => {
    const p = getRoomProgress(room);
    totalBundles += p.total;
    completedBundles += p.completed;
  });
  const pct = totalBundles > 0 ? Math.round((completedBundles / totalBundles) * 100) : 0;

  return (
    <header className="header">
      <h1>Community Center</h1>
      <p className="subtitle">{completedBundles} of {totalBundles} bundles completed</p>
      <div className="progress-wrap">
        <div className="progress-bar cc-progress" style={{ width: `${pct}%` }} />
        <div className="progress-text">{completedBundles} / {totalBundles} — {pct}%</div>
      </div>
    </header>
  );
}

export default function CommunityCenter() {
  useBundleSync();
  const activeRoom = useBundleStore((s) => s.activeRoom);
  const room = ROOMS.find((r) => r.key === activeRoom) || ROOMS[0];

  return (
    <div className="container">
      <OverallProgress />
      <RoomTabs />
      <Filters />
      <div className="panel cc-panel">
        {room.bundles.map((bundle) => (
          <BundleCard key={bundle.name} room={room} bundle={bundle} />
        ))}
      </div>
    </div>
  );
}
