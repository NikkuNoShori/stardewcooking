import { useRecipeStore } from '../hooks/useRecipeStore';

export default function ControlsBar({ inline = false }) {
  const currentTab = useRecipeStore((s) => s.currentTab);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const setSearch = useRecipeStore((s) => s.setSearch);
  const sortMode = useRecipeStore((s) => s.sortMode);
  const setSort = useRecipeStore((s) => s.setSort);
  const viewMode = useRecipeStore((s) => s.viewMode);
  const setViewMode = useRecipeStore((s) => s.setViewMode);

  const controls = (
    <>
      <div className="search-wrap">
        <input
          type="text"
          placeholder="Search recipes or ingredients..."
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => setSearch('')} aria-label="Clear search">
            &times;
          </button>
        )}
      </div>
      <div className="sort-wrap">
        <select value={sortMode} onChange={(e) => setSort(e.target.value)}>
          <option value="alpha">A-Z</option>
          <option value="alpha_desc">Z-A</option>
          <option value="harvest">Ingredient Season</option>
          <option value="harvest_desc">Ingredient Season (Desc)</option>
          <option value="type">Item Type</option>
          <option value="type_desc">Item Type (Desc)</option>
          <option value="source">Recipe Source</option>
          <option value="source_desc">Recipe Source (Desc)</option>
          <option value="energy">Energy</option>
          <option value="energy_asc">Energy (Low-High)</option>
          <option value="health">HP</option>
          <option value="health_asc">HP (Low-High)</option>
          <option value="sell">Sell Price</option>
          <option value="sell_asc">Sell Price (Low-High)</option>
        </select>
      </div>
      {currentTab === 'recipes' && (
        <div className="view-wrap">
          <button className={`view-btn${viewMode === 'table' ? ' active' : ''}`} onClick={() => setViewMode('table')}>
            Table
          </button>
          <button className={`view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')}>
            List
          </button>
        </div>
      )}
    </>
  );

  if (inline) return controls;

  return (
    <div className="controls-bar">
      {controls}
    </div>
  );
}
