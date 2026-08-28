import { getPlayer } from '../data/players';
import { NUM_TEAMS, ROUNDS } from '../lib/draft';
import type { DraftState } from '../types';

export default function DraftBoard({ state }: { state: DraftState }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2">Kör</th>
            {state.teams.map((t) => (
              <th key={t.id} className="px-3 py-2">{t.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: ROUNDS }).map((_, round) => (
            <tr key={round} className="border-t border-slate-100 dark:border-slate-800">
              <td className="px-3 py-2 text-slate-400">{round + 1}.</td>
              {Array.from({ length: NUM_TEAMS }).map((_, teamId) => {
                const pickIndexInRound = round % 2 === 0 ? teamId : NUM_TEAMS - 1 - teamId;
                const globalPickIndex = round * NUM_TEAMS + pickIndexInRound;
                const playerId = state.draftedPlayerIds[globalPickIndex];
                const player = playerId ? getPlayer(playerId) : undefined;
                const isCurrent = !state.finished && state.currentPick === globalPickIndex;
                return (
                  <td key={teamId} className={`px-3 py-2 ${isCurrent ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    {player ? player.name : isCurrent ? '…' : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
