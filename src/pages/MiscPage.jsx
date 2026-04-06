import { useCollectionStore } from '../hooks/useCollectionStore';
import { useCollectionSync } from '../hooks/useCollectionSync';
import { STARDROPS } from '../data/stardrops';
import { SECRET_NOTES, JOURNAL_SCRAPS } from '../data/secretNotes';
import { MONSTER_GOALS } from '../data/monsters';
import { CollectionHeader, SectionHeader, CollectionItem } from '../components/CollectionPage';

function StardropSection() {
  const stardropChecked = useCollectionStore((s) => s.stardropChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  const done = Object.keys(stardropChecked).length;

  return (
    <>
      <SectionHeader
        sectionKey="misc:stardrops"
        label={`Stardrops — ${done}/7 collected — +${done * 34} bonus energy`}
        done={done}
        total={7}
        defaultOpen={true}
      />
      {!collapsed['misc:stardrops'] && STARDROPS.map((sd) => (
        <CollectionItem
          key={sd.id}
          checked={!!stardropChecked[sd.id]}
          onClick={() => toggleItem('stardropChecked', sd.id)}
          name={sd.name}
          meta={<span className="cc-item-source">{sd.description}</span>}
          detail={sd.howTo}
        />
      ))}
    </>
  );
}

function SecretNotesSection() {
  const secretNoteChecked = useCollectionStore((s) => s.secretNoteChecked);
  const journalScrapChecked = useCollectionStore((s) => s.journalScrapChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const collapsed = useCollectionStore((s) => s.collapsedSections);

  const notesDone = Object.keys(secretNoteChecked).length;
  const scrapsDone = Object.keys(journalScrapChecked).length;

  return (
    <>
      <SectionHeader
        sectionKey="misc:secretnotes"
        label="Secret Notes"
        done={notesDone}
        total={25}
        defaultOpen={true}
      />
      {!collapsed['misc:secretnotes'] && SECRET_NOTES.map((note) => (
        <CollectionItem
          key={`note-${note.id}`}
          checked={!!secretNoteChecked[note.id]}
          onClick={() => toggleItem('secretNoteChecked', note.id)}
          name={`#${note.id} — ${note.description}`}
          meta={<span className="cc-item-source">{note.detail}</span>}
        />
      ))}

      <SectionHeader
        sectionKey="misc:journalscraps"
        label="Journal Scraps"
        done={scrapsDone}
        total={11}
        defaultOpen={true}
      />
      {!collapsed['misc:journalscraps'] && JOURNAL_SCRAPS.map((scrap) => (
        <CollectionItem
          key={`scrap-${scrap.id}`}
          checked={!!journalScrapChecked[scrap.id]}
          onClick={() => toggleItem('journalScrapChecked', scrap.id)}
          name={`Scrap #${scrap.id} — ${scrap.description}`}
          meta={<span className="cc-item-source">{scrap.detail}</span>}
        />
      ))}
    </>
  );
}

function MonsterSection() {
  const monsterChecked = useCollectionStore((s) => s.monsterChecked);
  const toggleItem = useCollectionStore((s) => s.toggleItem);
  const collapsed = useCollectionStore((s) => s.collapsedSections);
  const done = Object.keys(monsterChecked).length;

  return (
    <>
      <SectionHeader
        sectionKey="misc:monsters"
        label="Monster Eradication Goals"
        done={done}
        total={12}
        defaultOpen={true}
      />
      {!collapsed['misc:monsters'] && MONSTER_GOALS.map((goal) => (
        <CollectionItem
          key={goal.id}
          checked={!!monsterChecked[goal.id]}
          onClick={() => toggleItem('monsterChecked', goal.id)}
          name={goal.name}
          extra={<span className="cc-item-qty">Kill {goal.target}</span>}
          meta={
            <>
              <span className="cc-item-source">{goal.monsters}</span>
              <span className="cc-item-source">{goal.location}</span>
            </>
          }
          detail={`Reward: ${goal.reward} — ${goal.tip}`}
        />
      ))}
    </>
  );
}

export default function MiscPage() {
  useCollectionSync();
  const stardropChecked = useCollectionStore((s) => s.stardropChecked);
  const secretNoteChecked = useCollectionStore((s) => s.secretNoteChecked);
  const journalScrapChecked = useCollectionStore((s) => s.journalScrapChecked);
  const monsterChecked = useCollectionStore((s) => s.monsterChecked);

  const totalDone =
    Object.keys(stardropChecked).length +
    Object.keys(secretNoteChecked).length +
    Object.keys(journalScrapChecked).length +
    Object.keys(monsterChecked).length;
  const totalItems = 7 + 25 + 11 + 12;

  return (
    <div className="container">
      <CollectionHeader title="Misc Trackers" done={totalDone} total={totalItems} colorClass="misc-progress" />
      <div className="panel">
        <StardropSection />
        <SecretNotesSection />
        <MonsterSection />
      </div>
    </div>
  );
}
