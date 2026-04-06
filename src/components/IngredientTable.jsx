import { useMemo } from 'react';
import { useRecipeStore } from '../hooks/useRecipeStore';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { parseIngredient } from '../data/recipes';

export default function IngredientTable() {
  const recipes = useRecipeStore((s) => s.recipes);
  const checked = useCollectionStore((s) => s.recipeChecked);
  const ingredientsChecked = useCollectionStore((s) => s.ingredientsChecked);
  const currentFilter = useRecipeStore((s) => s.currentFilter);
  const searchQuery = useRecipeStore((s) => s.searchQuery);
  const ingredientSort = useRecipeStore((s) => s.ingredientSort);
  const setIngredientSort = useRecipeStore((s) => s.setIngredientSort);
  const toggleIngredient = useRecipeStore((s) => s.toggleIngredient);

  const data = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const indices = recipes.map((_, i) => i).filter((i) => {
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

    // Aggregate ingredients
    const map = {};
    indices.forEach((i) => {
      recipes[i][1].forEach((raw) => {
        const { name, qty } = parseIngredient(raw);
        if (!map[name]) map[name] = { total: 0, recipes: [], recipeIndices: [] };
        map[name].total += qty;
        map[name].recipes.push(recipes[i][0]);
        map[name].recipeIndices.push({ idx: i, raw });
      });
    });

    let entries = Object.entries(map).map(([name, d]) => ({
      name,
      qty: d.total,
      recipes: d.recipes,
      recipeIndices: d.recipeIndices,
      recipesStr: d.recipes.join(', '),
    }));

    if (q) {
      entries = entries.filter((e) =>
        e.name.toLowerCase().includes(q) ||
        e.recipes.some((r) => r.toLowerCase().includes(q))
      );
    }

    const { column, direction } = ingredientSort;
    const dir = direction === 'asc' ? 1 : -1;
    entries.sort((a, b) => {
      if (column === 'name') return dir * a.name.localeCompare(b.name);
      if (column === 'qty') return dir * (a.qty - b.qty);
      if (column === 'recipes') return dir * a.recipesStr.localeCompare(b.recipesStr);
      return 0;
    });

    return entries;
  }, [recipes, checked, currentFilter, searchQuery, ingredientSort]);

  const sortArrow = (col) => {
    if (ingredientSort.column !== col) return ' \u21D5';
    return ingredientSort.direction === 'asc' ? ' \u2191' : ' \u2193';
  };

  // Check if all instances of this ingredient across recipes are gathered
  const isIngredientFullyGathered = (entry) => {
    return entry.recipeIndices.every(({ idx, raw }) => !!ingredientsChecked[`${idx}:${raw}`]);
  };

  const toggleAllInstances = (entry) => {
    const allGathered = isIngredientFullyGathered(entry);
    entry.recipeIndices.forEach(({ idx, raw }) => {
      const key = `${idx}:${raw}`;
      const isChecked = !!ingredientsChecked[key];
      // If all gathered, uncheck all; if not all gathered, check the unchecked ones
      if (allGathered ? isChecked : !isChecked) {
        toggleIngredient(idx, raw);
      }
    });
  };

  if (data.length === 0) {
    return <div className="empty">No ingredients to show</div>;
  }

  return (
    <>
      {currentFilter === 'remaining' && (
        <div className="note">
          <b>Shopping List:</b> Total ingredients for remaining unchecked recipes. Click an ingredient to mark it gathered.
        </div>
      )}
      <table className="ing-table">
        <thead>
          <tr>
            <th className="ing-th ing-th-check"></th>
            <th className="ing-th clickable" onClick={() => setIngredientSort('name')}>
              Ingredient{sortArrow('name')}
            </th>
            <th className="ing-th ing-th-qty clickable" onClick={() => setIngredientSort('qty')}>
              Qty{sortArrow('qty')}
            </th>
            <th className="ing-th ing-th-recipes clickable" onClick={() => setIngredientSort('recipes')}>
              Used In{sortArrow('recipes')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => {
            const gathered = isIngredientFullyGathered(entry);
            return (
              <tr key={entry.name} className={`ig-row-tr${gathered ? ' ig-gathered' : ''}`}>
                <td className="ig-check-cell">
                  <div
                    className={`ig-check${gathered ? ' ig-check-on' : ''}`}
                    onClick={() => toggleAllInstances(entry)}
                    title={gathered ? 'Mark as not gathered' : 'Mark all as gathered'}
                  >
                    {gathered && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </td>
                <td className="iname">{entry.name}</td>
                <td className="iqty-cell"><span className="iqty">{entry.qty}</span></td>
                <td className="irec">{entry.recipesStr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
