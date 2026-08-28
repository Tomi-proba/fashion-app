import { availablePlayers, currentTeamId } from '../lib/draft';
import DraftBoard from './DraftBoard';
import PlayerList from './PlayerList';
import type { DraftState } from '../types';

interface DraftScreenProps {
  state: DraftState;
  onPick: (playerId: string) => void;
}

export default function DraftScreen({ state, onPick }: DraftScreenProps) {
  const teamId = currentTeamId(state);
  const team = teamId !== null ? state.teams[teamId] : null;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Draft</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Snake draft, 4 csapat, 5 kör. A statisztikák realisztikus, de nem élő szezon-átlagok — a játékhoz készültek.
      </p>

      {team && (
        <div className="mb-4 rounded-xl bg-indigo-600 px-4 py-3 text-white">
          {team.isHuman ? 'Te választasz — válassz egy játékost lentről!' : `${team.name} választ…`}
        </div>
      )}

      <div className="mb-6">
        <DraftBoard state={state} />
      </div>

      {team?.isHuman && <PlayerList players={availablePlayers(state)} onDraft={onPick} />}
    </div>
  );
}
