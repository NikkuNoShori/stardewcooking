import { useRecipeStore } from '../hooks/useRecipeStore';
import { useCollectionStore } from '../hooks/useCollectionStore';

export default function FilterBar() {
  const currentFilter = useRecipeStore((s) => s.currentFilter);
  const setFilter = useRecipeStore((s) => s.setFilter);
  const checked = useCollectionStore((s) => s.recipeChecked);
  const recipes = useRecipeStore((s) => s.recipes);

  const done = Object.values(checked).filter(Boolean).length;
  const total = recipes.length;
  const rem = total - done;

  const filters = [
    { key: 'all', label: `All (${total})` },
    { key: 'remaining', label: `Remaining (${rem})` },
    { key: 'completed', label: `Completed (${done})` },
  ];

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f.key}
          className={`filter-btn${currentFilter === f.key ? ' active' : ''}`}
          onClick={() => setFilter(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
