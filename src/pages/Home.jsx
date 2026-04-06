import { useRecipeStore } from '../hooks/useRecipeStore';
import { useSupabaseSync } from '../hooks/useSupabaseSync';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import FilterBar from '../components/FilterBar';
import ControlsBar from '../components/ControlsBar';
import RecipeList from '../components/RecipeList';
import IngredientTable from '../components/IngredientTable';
import WikiTable from '../components/WikiTable';
import ActionButtons from '../components/ActionButtons';

export default function Home() {
  useSupabaseSync();
  const currentTab = useRecipeStore((s) => s.currentTab);

  return (
    <>
      <div className="container">
        <Header />
        <div className="tab-bar-top">
          <TabBar />
        </div>
        <FilterBar />
        <ControlsBar />
        <div className="panel">
          {currentTab === 'recipes' && <RecipeList />}
          {currentTab === 'ingredients' && <IngredientTable />}
          {currentTab === 'wiki' && <WikiTable />}
        </div>
        <ActionButtons />
      </div>
      {/* Mobile: fixed bottom tab bar — outside container to avoid clipping */}
      <div className="tab-bar-bottom">
        <TabBar />
      </div>
    </>
  );
}
