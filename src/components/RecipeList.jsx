import { useMemo } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { SEASON_ORDER, TYPE_ORDER, SOURCE_ORDER, SOURCE_LABELS, seasonLabel } from '../data/recipes';
import { ICONS } from '../data/icons';
import { useIsMobile } from '../hooks/useMediaQuery';

function getIcon(id) {
  return ICONS[String(id)] || '';
}

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
  const toggle = useRecipeStore((s) => s.toggle);
  const toggleIngredient = useRecipeStore((s) => s.toggleIngredient);
  const collapsedGroups = useRecipeStore((s) => s.collapsedGroups);
  const toggleGroup = useRecipeStore((s) => s.toggleGroup);
  const isMobile = useIsMobile();

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
      case 'harvest': copy.sort((a, b) => (SEASON_ORDER[recipes[a][2]] ?? 5) - (SEASON_ORDER[recipes[b][2]] ?? 5) || cmp(a, b)); break;
      case 'type': copy.sort((a, b) => (TYPE_ORDER[recipes[a][3]] ?? 9) - (TYPE_ORDER[recipes[b][3]] ?? 9) || cmp(a, b)); break;
      case 'source': copy.sort((a, b) => (SOURCE_ORDER[recipes[a][4]] ?? 12) - (SOURCE_ORDER[recipes[b][4]] ?? 12) || cmp(a, b)); break;
    }
    return copy;
  }, [filtered, sortMode, recipes]);

  const groups = useMemo(() => {
    if (sortMode === 'alpha') return null;

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

  if (sorted.length === 0) {
    return <div className="empty">No recipes found</div>;
  }

  const renderRecipe = (i) => {
    const r = recipes[i];
    const isChecked = !!checked[i];
    const ic = getIcon(r[5]);
    const meta = sortMode === 'alpha' ? `${seasonLabel(r[2])} · ${r[3]}` : '';
    const sourceDetail = r[11] || '';
    const buffText = r[8];
    const buffDur = r[9];

    return (
      <div key={i} className={`rc${isChecked ? ' chk' : ''}`}>
        <div className="cb" onClick={() => toggle(i)}>
          <svg className="ck" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {ic && <img className="ricon" src={ic} alt="" onClick={() => toggle(i)} />}
        <div className="ri" onClick={() => toggle(i)}>
          <div className="rn">{r[0]}</div>
          <div className="rm">
            {meta && <span>{meta}</span>}
            {sourceDetail && <span className="rm-src">{sourceDetail}</span>}
          </div>
          {buffText && (
            <div className="rm-buff">
              {buffText}{buffDur ? ` (${buffDur})` : ''}
            </div>
          )}
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
                title={ingChecked ? `${ing} — gathered` : `${ing} — click to mark gathered`}
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
  };

  if (!groups) {
    return <>{sorted.map(renderRecipe)}</>;
  }

  return (
    <>
      {Array.from(groups.entries()).map(([gk, indices]) => {
        const key = `${sortMode}:${gk}`;
        const isCollapsed = collapsedGroups[key] ?? isMobile;
        const label = sortMode === 'source' ? (SOURCE_LABELS[gk] || gk) : seasonLabel(gk);
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
                {indices.map(renderRecipe)}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
