import { useRecipeStore } from '../hooks/useRecipeStore';
import { useCollectionStore } from '../hooks/useCollectionStore';

export default function Header() {
  const checked = useCollectionStore((s) => s.recipeChecked);
  const recipes = useRecipeStore((s) => s.recipes);
  const done = Object.values(checked).filter(Boolean).length;
  const total = recipes.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <header className="header">
      <h1><span className="header-icon">🍳</span>Cooking</h1>
      <p className="subtitle">{done} of {total} recipes cooked</p>
      <div className="progress-wrap">
        <div className="progress-bar" style={{ width: `${pct}%` }} />
        <div className="progress-text">{done} / {total} — {pct}%</div>
      </div>
    </header>
  );
}
