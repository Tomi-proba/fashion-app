import { getPlayer } from '../data/players';
import { fantasyPointsPerGame } from '../lib/scoring';
import type { FantasyTeam } from '../types';

export default function TeamRoster({ team, highlight }: { team: FantasyTeam; highlight?: boolean }) {
  const players = team.playerIds.map((id) => getPlayer(id)).filter((p) => p !== undefined);
  const total = players.reduce((sum, p) => sum + fantasyPointsPerGame(p.stats), 0);

  return (
    <div className={`rounded-2xl border p-4 ${highlight ? 'border-indigo-400 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          {team.name} {team.isHuman && <span className="ml-1 text-xs text-indigo-500">(te)</span>}
        </h3>
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{total.toFixed(1)} FP/meccs</span>
      </div>
      <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {players.map((p) => (
          <li key={p.id} className="flex items-center justify-between">
            <span>{p.name} <span className="text-xs text-slate-400">({p.position}, {p.team})</span></span>
            <span className="text-slate-400">{fantasyPointsPerGame(p.stats).toFixed(1)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
