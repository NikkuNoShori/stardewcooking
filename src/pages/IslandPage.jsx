import { useMemo } from 'react';
import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { WALNUTS, WALNUT_AREAS } from '../data/walnuts';
import { FIELD_OFFICE_ITEMS, FIELD_OFFICE_SURVEYS } from '../data/fieldOffice';
import {
  CollectionHeader, CollectionControls, SectionHeader,
  CollectionItem,
} from '../components/CollectionPage';

const SORT_OPTIONS = [
  { value: 'area', label: 'By Area' },
  { value: 'alpha', label: 'A-Z' },
];

function WalnutSection({ walnutChecked, toggleItem, sort }) {
  const searchQueries = useCollectionStore((s) => s.searchQueries);
  const filters = useCollectionStore((s) => s.filters);
  const query = (searchQueries['island'] || '').toLowerCase().trim();
  const filter = filters['island'] || 'all';

  const filtered = useMemo(() => {
    return WALNUTS.filter((w) => {
      if (w.count === 0) return false; // Skip non-collectible entries
      const isChecked = !!walnutChecked[w.id];
      if (filter === 'completed' && !isChecked) return false;
      if (filter === 'remaining' && isChecked) return false;
      if (query && !`${w.description} ${w.area}`.toLowerCase().includes(query)) return false;
      return true;
    });
  }, [walnutChecked, query, filter]);

  const walnutTotal = WALNUTS.reduce((s, w) => s + w.count, 0);
  const walnutDone = WALNUTS.filter((w) => walnutChecked[w.id]).reduce((s, w) => s + w.count, 0);

  const grouped = useMemo(() => {
    if (sort === 'alpha') {
      const sorted = [...filtered].sort((a, b) => a.description.localeCompare(b.description));
      return [['All Walnuts', sorted]];
    }
    const groups = {};
    WALNUT_AREAS.forEach((a) => { groups[a] = []; });
    filtered.forEach((w) => {
      if (groups[w.area]) groups[w.area].push(w);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filtered, sort]);

  return (
    <>
      <div className="cc-bundle-hdr" style={{ background: '#2e7d32', cursor: 'default' }}>
        <span className="cc-bundle-name">Golden Walnuts</span>
        <span className="cc-bundle-progress">{walnutDone}/{walnutTotal}</span>
      </div>
      {grouped.map(([group, items]) => {
        const gDone = items.filter((w) => walnutChecked[w.id]).length;
        return (
          <div key={group}>
            <SectionHeader
              sectionKey={`island:walnut:${group}`}
              label={group}
              done={gDone}
              total={items.length}
              defaultOpen={true}
            />
            <WalnutItems items={items} walnutChecked={walnutChecked} toggleItem={toggleItem} sectionKey={`island:walnut:${group}`} />
          </div>
        );
      })}
    </>
  );
}

function WalnutItems({ items, walnutChecked, toggleItem, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  return items.map((w) => (
    <CollectionItem
      key={w.id}
      checked={!!walnutChecked[w.id]}
      onClick={() => toggleItem('walnutChecked', w.id)}
      name={w.description}
      extra={w.count > 1 ? <span className="cc-item-qty">x{w.count}</span> : null}
      meta={<span className="cc-item-source">{w.area}</span>}
    />
  ));
}

function FieldOfficeSection({ fieldOfficeChecked, toggleItem }) {
  const done = Object.keys(fieldOfficeChecked).length;
  const total = FIELD_OFFICE_ITEMS.length;

  return (
    <>
      <div className="cc-bundle-hdr" style={{ background: '#795548', cursor: 'default' }}>
        <span className="cc-bundle-name">Field Office</span>
        <span className="cc-bundle-progress">{done}/{total}</span>
      </div>
      {FIELD_OFFICE_SURVEYS.map((survey) => {
        const surveyItems = FIELD_OFFICE_ITEMS.filter((i) => i.survey === survey.name);
        const surveyDone = surveyItems.filter((i) => fieldOfficeChecked[i.name]).length;
        return (
          <div key={survey.name}>
            <SectionHeader
              sectionKey={`island:fo:${survey.name}`}
              label={`${survey.name} — ${survey.reward}`}
              done={surveyDone}
              total={surveyItems.length}
              defaultOpen={true}
            />
            <FieldOfficeItems items={surveyItems} fieldOfficeChecked={fieldOfficeChecked} toggleItem={toggleItem} sectionKey={`island:fo:${survey.name}`} />
          </div>
        );
      })}
    </>
  );
}

function FieldOfficeItems({ items, fieldOfficeChecked, toggleItem, sectionKey }) {
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  if (collapsed[sectionKey]) return null;

  return items.map((item, idx) => (
    <CollectionItem
      key={`${item.name}-${idx}`}
      checked={!!fieldOfficeChecked[item.name]}
      onClick={() => toggleItem('fieldOfficeChecked', item.name)}
      name={item.name}
      extra={item.count > 1 ? <span className="cc-item-qty">x{item.count}</span> : null}
      meta={<span className="cc-item-source">{item.source}</span>}
      detail={item.tip}
    />
  ));
}

export default function IslandPage() {
  useCollectionSync();
  const walnutChecked = useCollectionStore((s) => s.walnutChecked);
  const fieldOfficeChecked = useCollectionStore((s) => s.fieldOfficeChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const sortModes = useCollectionStore((s) => s.sortModes);
  const sort = sortModes['island'] || 'area';

  const walnutTotal = WALNUTS.reduce((s, w) => s + w.count, 0);
  const walnutDone = WALNUTS.filter((w) => walnutChecked[w.id]).reduce((s, w) => s + w.count, 0);
  const foDone = Object.keys(fieldOfficeChecked).length;
  const foTotal = FIELD_OFFICE_ITEMS.length;

  return (
    <div className="container">
      <CollectionHeader
        title="Ginger Island"
        done={walnutDone + foDone}
        total={walnutTotal + foTotal}
        colorClass="island-progress"
      />
      <CollectionControls page="island" sortOptions={SORT_OPTIONS} done={walnutDone + foDone} total={walnutTotal + foTotal} />
      <div className="panel">
        <WalnutSection walnutChecked={walnutChecked} toggleItem={toggleItem} sort={sort} />
        <FieldOfficeSection fieldOfficeChecked={fieldOfficeChecked} toggleItem={toggleItem} />
      </div>
    </div>
  );
}
