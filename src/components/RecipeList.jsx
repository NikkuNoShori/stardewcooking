import { useMemo } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { SEASON_ORDER, TYPE_ORDER, SOURCE_ORDER, SOURCE_LABELS, seasonLabel } from '../data/recipes';
import { useIsMobile } from '../hooks/useMediaQuery';
import { useProfession } from '../context/ProfessionContext';
import { getPriceDisplay } from '../utils/professionPricing';
import PriceWithTooltip from './PriceWithTooltip';

function dotClass(key, mode) {
  if (mode === 'harvest') {
    return { Spring: 'dot-spring', Summer: 'dot-summer', Fall: 'dot-fall', Winter: 'dot-winter', Any: 'dot-any', Island: 'dot-island' }[key] || 'dot-any';
  }
  if (mode === 'type') {
    return { Farming: 'dot-crop', Fishing: 'dot-fish', 'Crab Pot': 'dot-crabpot', Foraging: 'dot-forage', Animal: 'dot-animal', Artisan: 'dot-artisan', 'Store-Bought': 'dot-store', 'Monster Drop': 'dot-monster', Island: 'dot-island', Mixed: 'dot-other' }[key] || 'dot-other';
  }
  return 'dot-any';
}

export default function RecipeList() {
  const recipes = useRecipeStore((s) => s.recipes);
  const checked = useCollectionStore((s) => s.recipeChecked);
  const ingredientsChecked = useCollectionStore((s) => s.ingredientsChecked);
  const currentFilter = useRecipeStore((s) => s.currentFilter);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const sortMode = useRecipeStore((s) => s.sortMode);
  const setSort = useRecipeStore((s) => s.setSort);
  const viewMode = useRecipeStore((s) => s.viewMode);
  const toggle = useRecipeStore((s) => s.toggle);
  const toggleIngredient = useRecipeStore((s) => s.toggleIngredient);
  const collapsedGroups = useRecipeStore((s) => s.collapsedGroups);
  const toggleGroup = useRecipeStore((s) => s.toggleGroup);
  const setAllGroupsCollapsed = useRecipeStore((s) => s.setAllGroupsCollapsed);
  const isMobile = useIsMobile();
  const { selection } = useProfession();

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return recipes.map((_, i) => i).filter((i) => {
      const isChecked = !!checked[i];
      if (currentFilter === 'remaining' && isChecked) return false;
      if (currentFilter === 'completed' && !isChecked) return false;
      if (q) {
        const r = recipes[i];
        const txt = (r[0] + ' ' + r[1].join(' ') + ' ' + r[2] + ' ' + r[3] + ' ' + r[4] + ' ' + r[8]).toLowerCase();
        if (!txt.includes(q)) return false;
      }
      return true;
    });
  }, [recipes, checked, currentFilter, searchQuery]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    const cmp = (a, b) => recipes[a][0].localeCompare(recipes[b][0]);
    switch (sortMode) {
      case 'alpha': copy.sort(cmp); break;
      case 'alpha_desc': copy.sort((a, b) => cmp(b, a)); break;
      case 'harvest': copy.sort((a, b) => (SEASON_ORDER[recipes[a][2]] ?? 5) - (SEASON_ORDER[recipes[b][2]] ?? 5) || cmp(a, b)); break;
      case 'harvest_desc': copy.sort((a, b) => (SEASON_ORDER[recipes[b][2]] ?? 5) - (SEASON_ORDER[recipes[a][2]] ?? 5) || cmp(a, b)); break;
      case 'type': copy.sort((a, b) => (TYPE_ORDER[recipes[a][3]] ?? 9) - (TYPE_ORDER[recipes[b][3]] ?? 9) || cmp(a, b)); break;
      case 'type_desc': copy.sort((a, b) => (TYPE_ORDER[recipes[b][3]] ?? 9) - (TYPE_ORDER[recipes[a][3]] ?? 9) || cmp(a, b)); break;
      case 'source': copy.sort((a, b) => (SOURCE_ORDER[recipes[a][4]] ?? 12) - (SOURCE_ORDER[recipes[b][4]] ?? 12) || cmp(a, b)); break;
      case 'source_desc': copy.sort((a, b) => (SOURCE_ORDER[recipes[b][4]] ?? 12) - (SOURCE_ORDER[recipes[a][4]] ?? 12) || cmp(a, b)); break;
      case 'energy': copy.sort((a, b) => recipes[b][6] - recipes[a][6] || cmp(a, b)); break;
      case 'energy_asc': copy.sort((a, b) => recipes[a][6] - recipes[b][6] || cmp(a, b)); break;
      case 'health': copy.sort((a, b) => recipes[b][7] - recipes[a][7] || cmp(a, b)); break;
      case 'health_asc': copy.sort((a, b) => recipes[a][7] - recipes[b][7] || cmp(a, b)); break;
      case 'sell': copy.sort((a, b) => {
        const pa = getPriceDisplay(recipes[a][10], { name: recipes[a][0], category: 'Cooking' }, selection);
        const pb = getPriceDisplay(recipes[b][10], { name: recipes[b][0], category: 'Cooking' }, selection);
        return pb.adjustedPrice - pa.adjustedPrice || cmp(a, b);
      }); break;
      case 'sell_asc': copy.sort((a, b) => {
        const pa = getPriceDisplay(recipes[a][10], { name: recipes[a][0], category: 'Cooking' }, selection);
        const pb = getPriceDisplay(recipes[b][10], { name: recipes[b][0], category: 'Cooking' }, selection);
        return pa.adjustedPrice - pb.adjustedPrice || cmp(a, b);
      }); break;
    }
    return copy;
  }, [filtered, sortMode, recipes, selection]);

  const groups = useMemo(() => {
    if (['alpha', 'alpha_desc', 'energy', 'energy_asc', 'health', 'health_asc', 'sell', 'sell_asc'].includes(sortMode)) return null;

    const groupMap = new Map();
    sorted.forEach((i) => {
      let gk;
      if (sortMode === 'harvest') gk = recipes[i][2];
      else if (sortMode === 'type') gk = recipes[i][3];
      else if (sortMode === 'source') gk = recipes[i][4];
      if (!groupMap.has(gk)) groupMap.set(gk, []);
      groupMap.get(gk).push(i);
    });
    return groupMap;
  }, [sorted, sortMode, recipes]);

  const groupEntries = groups ? Array.from(groups.entries()) : [];
  const groupKeys = groupEntries.map(([gk]) => gk);

  if (sorted.length === 0) {
    return <div className="empty">No recipes found</div>;
  }

  const renderRecipeRow = (i) => {
    const r = recipes[i];
    const isChecked = !!checked[i];
    const buffText = r[8] ? (r[9] ? `${r[8]} (${r[9]})` : r[8]) : '—';

    return (
      <tr key={i} className={isChecked ? 'chk' : ''} onClick={() => toggle(i)} style={{ cursor: 'pointer' }}>
        <td>
          <div className={`recipe-grid-check${isChecked ? ' checked' : ''}`}>
            <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </td>
        <td className="wname">{r[0]}</td>
        <td className="wsrc">{r[11] || SOURCE_LABELS[r[4]] || r[4]}</td>
        <td className="recipe-grid-ings wings">
          {r[1].map((ing, j) => {
            const ingKey = `${i}:${ing}`;
            const ingChecked = !!ingredientsChecked[ingKey];
            return (
              <span
                key={j}
                className={`rg-item${ingChecked ? ' rg-done' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleIngredient(i, ing); }}
                title={ingChecked ? `${ing} — gathered` : `${ing} — click to mark gathered`}
              >
                <span className={`rg-check${ingChecked ? ' rg-check-on' : ''}`}>
                  {ingChecked ? '\u2713' : ''}
                </span>
                {ing}
              </span>
            );
          })}
        </td>
        <td className="wenergy">{r[6]}</td>
        <td className="whealth">{r[7]}</td>
        <td className="wbuff">{buffText}</td>
        <td className="wsell">
          <PriceWithTooltip
            value={r[10]}
            item={{ name: r[0], category: 'Cooking' }}
            selection={selection}
            className="wsell"
          />
        </td>
      </tr>
    );
  };

  const renderRecipeTable = (indices) => (
    <table className="wiki-tbl cooking-unified-tbl">
      <thead>
        <tr>
          <th></th>
          <th className="wiki-th-sort" onClick={() => toggleSortMode('alpha', 'alpha_desc')}>Name{sortArrow('alpha', 'alpha_desc')}</th>
          <th className="wiki-th-sort" onClick={() => toggleSortMode('source', 'source_desc')}>Source{sortArrow('source', 'source_desc')}</th>
          <th>Ingredients</th>
          <th className="wiki-th-sort" onClick={() => toggleSortMode('energy_asc', 'energy')}>Energy{sortArrow('energy_asc', 'energy')}</th>
          <th className="wiki-th-sort" onClick={() => toggleSortMode('health_asc', 'health')}>HP{sortArrow('health_asc', 'health')}</th>
          <th>Buffs</th>
          <th className="wiki-th-sort" onClick={() => toggleSortMode('sell_asc', 'sell')}>Sell{sortArrow('sell_asc', 'sell')}</th>
        </tr>
      </thead>
      <tbody>
        {indices.map(renderRecipeRow)}
      </tbody>
    </table>
  );

  const renderRecipeList = (indices) => indices.map((i) => {
    const r = recipes[i];
    const isChecked = !!checked[i];
    const sourceDetail = r[11] || SOURCE_LABELS[r[4]] || r[4];
    const buffText = r[8] ? (r[9] ? `${r[8]} (${r[9]})` : r[8]) : '';

    return (
      <div key={i} className={`rc${isChecked ? ' chk' : ''}`}>
        <div className="cb" onClick={() => toggle(i)}>
          <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ri" onClick={() => toggle(i)}>
          <div className="rn">{r[0]}</div>
          <div className="rm">
            <span>{seasonLabel(r[2])} · {r[3]}</span>
            <span className="rm-src">{sourceDetail}</span>
          </div>
          {buffText && <div className="rm-buff">{buffText}</div>}
        </div>
        <div className="rg-wrap">
          {r[1].map((ing, j) => {
            const ingKey = `${i}:${ing}`;
            const ingChecked = !!ingredientsChecked[ingKey];
            return (
              <span
                key={j}
                className={`rg-item${ingChecked ? ' rg-done' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleIngredient(i, ing); }}
              >
                <span className={`rg-check${ingChecked ? ' rg-check-on' : ''}`}>
                  {ingChecked ? '\u2713' : ''}
                </span>
                {ing}
              </span>
            );
          })}
        </div>
      </div>
    );
  });

  const toggleSortMode = (ascMode, descMode) => {
    if (sortMode === ascMode) return setSort(descMode);
    if (sortMode === descMode) return setSort(ascMode);
    return setSort(ascMode);
  };

  const sortArrow = (ascMode, descMode) => {
    if (sortMode === ascMode) return ' \u2191';
    if (sortMode === descMode) return ' \u2193';
    return ' \u21D5';
  };

  if (!groups) {
    return viewMode === 'table' ? renderRecipeTable(sorted) : <>{renderRecipeList(sorted)}</>;
  }

  return (
    <>
      {viewMode === 'list' && (
        <div className="list-expand-row">
          <button className="view-btn" onClick={() => setAllGroupsCollapsed(groupKeys, false)}>Expand all</button>
          <button className="view-btn" onClick={() => setAllGroupsCollapsed(groupKeys, true)}>Collapse all</button>
        </div>
      )}
      {Array.from(groups.entries()).map(([gk, indices]) => {
        const key = `${sortMode}:${gk}`;
        const isCollapsed = collapsedGroups[key] ?? isMobile;
        const label = sortMode === 'source'
          ? (SOURCE_LABELS[gk] || gk)
          : (sortMode === 'type' ? gk : seasonLabel(gk));
        const doneInGroup = indices.filter((i) => !!checked[i]).length;

        return (
          <div key={key} className="collapsible-group">
            <div
              className="group-hdr"
              onClick={() => toggleGroup(gk, isMobile)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGroup(gk, isMobile); } }}
            >
              <span className={`chevron ${isCollapsed ? '' : 'chevron-open'}`}>&#9654;</span>
              <span className={`sdot ${dotClass(gk, sortMode)}`} />
              <span className="group-label">{label}</span>
              <span className="group-count">{doneInGroup}/{indices.length}</span>
            </div>
            {!isCollapsed && (
              <div className="group-items">
                {viewMode === 'table' ? renderRecipeTable(indices) : renderRecipeList(indices)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
