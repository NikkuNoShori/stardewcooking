import { useState, useMemo, useCallback } from 'react';
import { SPAWN_CODES, SPAWN_CATEGORIES } from '../data/spawnCodes';
import { ICONS } from '../data/icons';

const RARITY_ORDER = ['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'];
const RARITY_COLORS = {
  Common: '#9e9e9e',
  Uncommon: '#4caf50',
  Rare: '#2196f3',
  Epic: '#9c27b0',
  Legendary: '#ff9800',
};

const CATEGORY_ICONS = {
  'Crop': '🌾', 'Seed': '🌱', 'Forage': '🍄', 'Fish': '🐟',
  'Mineral': '💎', 'Artifact': '🏺', 'Animal Product': '🥚',
  'Artisan Good': '🧀', 'Cooking': '🍳', 'Resource': '🪨',
  'Bait & Tackle': '🎣', 'Bomb': '💣', 'Furniture': '🪑',
  'Tool': '🧭', 'Ring': '💍', 'Monster Loot': '👹',
  'Special': '✨', 'Misc': '📦', 'Tree Fruit': '🍎', 'Sapling': '🌳',
};

const SORT_OPTIONS = [
  { value: 'id', label: 'By ID' },
  { value: 'alpha', label: 'A-Z' },
  { value: 'rarity', label: 'By Rarity' },
  { value: 'price', label: 'By Price' },
  { value: 'category', label: 'By Category' },
];

const DISCLAIMER_KEY = 'sdv-spawn-codes-acknowledged';
const FAVORITES_KEY = 'sdv-spawn-favorites';

// ─── Disclaimer Modal ───
function DisclaimerModal({ onAccept, onBack }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box spawn-disclaimer">
        <div className="spawn-warn-icon">&#9888;</div>
        <h2 className="modal-title">Spoiler &amp; Cheat Warning</h2>
        <p className="modal-msg">
          This page contains <b>item spawn codes</b> that can be used to spawn any item
          in Stardew Valley. Using these codes is considered cheating and may significantly
          impact your gameplay experience.
        </p>
        <p className="modal-msg">
          This page also contains <b>spoilers</b> — item names, descriptions, and the
          existence of late-game content will be visible.
        </p>
        <p className="modal-msg">By proceeding, you acknowledge that:</p>
        <ul className="spawn-warn-list">
          <li>You understand these are cheat codes, not intended game mechanics</li>
          <li>Viewing this page may spoil surprises and progression rewards</li>
          <li>Using spawn codes cannot be undone and may diminish your enjoyment</li>
          <li>This is best used by experienced players on secondary save files</li>
        </ul>
        <div className="spawn-warn-btns">
          <button className="abtn" onClick={onAccept}>
            I Understand, Show Me The Codes
          </button>
          <button className="abtn dng" onClick={onBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── How-To Section ───
function HowToUse() {
  const [open, setOpen] = useState(false);
  return (
    <div className="spawn-howto">
      <div
        className="cc-bundle-hdr spawn-howto-hdr"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } }}
      >
        <span className={`chevron ${open ? 'chevron-open' : ''}`}>&#9654;</span>
        <span className="cc-bundle-name">How to Use Spawn Codes</span>
      </div>
      {open && (
        <div className="spawn-howto-body">
          <p><b>Method 1 — Animal Naming:</b> Buy an animal from Marnie and name it <code>[ID]</code> (e.g. <code>[74]</code> for Prismatic Shard). You receive the item immediately. Sell the animal and repeat.</p>
          <p><b>Method 2 — Character Naming:</b> Name your character <code>[ID]</code> at game start. Talk to Gus at the Saloon — he says your name and you receive the item.</p>
          <p><b>Combine up to 3 codes:</b> <code>[74][72][166]</code> gives Prismatic Shard + Diamond + Treasure Chest in one name.</p>
          <p><b>Works on all platforms</b> — PC, Switch, PS, Xbox, Mobile. No mods needed.</p>
          <p className="spawn-howto-note"><b>Note:</b> 1.6 introduced string-based IDs for some new items. Numeric IDs still work for all pre-1.6 items listed here.</p>
        </div>
      )}
    </div>
  );
}

// ─── Copy Button ───
function CopyButton({ id }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback((e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`[${id}]`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }, [id]);

  return (
    <button className="spawn-copy-btn" onClick={handleCopy} title={`Copy [${id}]`}>
      {copied ? (
        <span className="spawn-copied">Copied!</span>
      ) : (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  );
}

// ─── Favorite Star Button ───
function FavButton({ id, favorites, toggleFavorite }) {
  const isFav = favorites.has(id);
  return (
    <button
      className={`spawn-fav-btn${isFav ? ' spawn-fav-active' : ''}`}
      onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFav ? '\u2605' : '\u2606'}
    </button>
  );
}

// ─── Item Icon ───
function ItemIcon({ item }) {
  const iconData = ICONS[String(item.id)];
  if (iconData) {
    return <img className="spawn-item-icon" src={iconData} alt={item.name} />;
  }
  const emoji = CATEGORY_ICONS[item.category] || '?';
  return <span className="spawn-cat-icon">{emoji}</span>;
}

// ─── Main Page ───
export default function SpawnCodesPage() {
  const [acknowledged, setAcknowledged] = useState(
    () => localStorage.getItem(DISCLAIMER_KEY) === 'true'
  );
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('id');
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [filter, setFilter] = useState('all'); // 'all' | 'favorites'
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  if (!acknowledged) {
    return (
      <DisclaimerModal
        onAccept={() => {
          localStorage.setItem(DISCLAIMER_KEY, 'true');
          setAcknowledged(true);
        }}
        onBack={() => window.history.back()}
      />
    );
  }

  const toggleCategory = (cat) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    let items = SPAWN_CODES.filter((item) => {
      if (filter === 'favorites' && !favorites.has(item.id)) return false;
      if (activeCategories.size > 0 && !activeCategories.has(item.category)) return false;
      if (q) {
        const idMatch = String(item.id).includes(q);
        const nameMatch = item.name.toLowerCase().includes(q);
        if (!idMatch && !nameMatch) return false;
      }
      return true;
    });

    switch (sort) {
      case 'alpha':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rarity':
        items.sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity));
        break;
      case 'price':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'category':
        items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
        break;
      default: // id
        items.sort((a, b) => a.id - b.id);
    }
    return items;
  }, [search, sort, activeCategories, filter, favorites]);

  return (
    <div className="container">
      <header className="header">
        <h1><span className="header-icon">{'</>'}</span>Spawn Codes</h1>
        <p className="subtitle">{SPAWN_CODES.length} items — searchable reference</p>
      </header>

      <HowToUse />

      {/* All / Favorites filter bar */}
      <div className="filter-bar collection-controls-top">
        <button
          className={`filter-btn${filter === 'all' ? ' active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({SPAWN_CODES.length})
        </button>
        <button
          className={`filter-btn${filter === 'favorites' ? ' active' : ''}`}
          onClick={() => setFilter('favorites')}
        >
          Favorites ({favorites.size})
        </button>
      </div>

      {/* Category filter pills */}
      <div className="spawn-cat-filters">
        {SPAWN_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`spawn-cat-pill${activeCategories.has(cat) ? ' active' : ''}`}
            onClick={() => toggleCategory(cat)}
          >
            <span className="spawn-pill-icon">{CATEGORY_ICONS[cat] || ''}</span>
            {cat}
          </button>
        ))}
        {activeCategories.size > 0 && (
          <button className="spawn-cat-pill spawn-cat-clear" onClick={() => setActiveCategories(new Set())}>
            Clear
          </button>
        )}
      </div>

      {/* Search + Sort */}
      <div className="controls-bar">
        <div className="search-wrap">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>&times;</button>
          )}
        </div>
        <div className="sort-wrap">
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="panel spawn-panel">
        <table className="spawn-table">
          <thead>
            <tr>
              <th className="spawn-th-fav"></th>
              <th className="spawn-th-icon"></th>
              <th className="spawn-th-id">ID</th>
              <th className="spawn-th-name">Item</th>
              <th className="spawn-th-cat">Category</th>
              <th className="spawn-th-rarity">Rarity</th>
              <th className="spawn-th-price">Price</th>
              <th className="spawn-th-copy"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className={`spawn-row${favorites.has(item.id) ? ' spawn-row-fav' : ''}`}>
                <td><FavButton id={item.id} favorites={favorites} toggleFavorite={toggleFavorite} /></td>
                <td className="spawn-icon-cell"><ItemIcon item={item} /></td>
                <td className="spawn-id">
                  <code>[{item.id}]</code>
                </td>
                <td className="spawn-name">{item.name}</td>
                <td className="spawn-cat">{item.category}</td>
                <td>
                  <span
                    className={`spawn-rarity spawn-rarity-${item.rarity.toLowerCase()}`}
                    style={{ color: RARITY_COLORS[item.rarity] }}
                  >
                    {item.rarity}
                  </span>
                </td>
                <td className="spawn-price">{item.price > 0 ? `${item.price}g` : '—'}</td>
                <td><CopyButton id={item.id} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty">{filter === 'favorites' ? 'No favorites yet — star some items!' : 'No items match your search'}</div>}
        <div className="spawn-count">{filtered.length} items shown</div>
      </div>
    </div>
  );
}
