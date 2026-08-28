import { useState } from 'react';
import { getPlayer } from '../data/players';
import { fantasyPointsPerGame } from '../lib/scoring';
import { simulateWeek } from '../lib/weekSim';
import TeamRoster from './TeamRoster';
import type { DraftState, WeeklyResult } from '../types';

export default function ResultsScreen({ state }: { state: DraftState }) {
  const [weekly, setWeekly] = useState<WeeklyResult[] | null>(null);

  const standings = [...state.teams].sort((a, b) => {
    const totalA = a.playerIds.reduce((s, id) => s + (getPlayer(id) ? fantasyPointsPerGame(getPlayer(id)!.stats) : 0), 0);
    const totalB = b.playerIds.reduce((s, id) => s + (getPlayer(id) ? fantasyPointsPerGame(getPlayer(id)!.stats) : 0), 0);
    return totalB - totalA;
  });

  const weeklyRanked = weekly ? [...weekly].sort((a, b) => b.total - a.total) : null;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Eredmények</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        A csapatok rangsora a becsült, meccsenkénti fantasy pontátlag alapján. A "Hét szimulálása" minden
        játékosnál kis véletlen ingadozást tesz az átlagára — nézd meg, ki nyerne egy adott héten.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {standings.map((team, i) => (
          <div key={team.id} className="relative">
            {i === 0 && <span className="absolute -top-2 -left-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-amber-950">🏆 1.</span>}
            <TeamRoster team={team} highlight={team.isHuman} />
          </div>
        ))}
      </div>

      <button
        onClick={() => setWeekly(simulateWeek(state.teams))}
        className="mb-6 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
      >
        Hét szimulálása
      </button>

      {weeklyRanked && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Csapat</th>
                <th className="px-4 py-2 text-right">Heti pontszám</th>
              </tr>
            </thead>
            <tbody>
              {weeklyRanked.map((result, i) => {
                const team = state.teams.find((t) => t.id === result.teamId)!;
                return (
                  <tr key={result.teamId} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-4 py-3 text-slate-400">{i === 0 ? '🏆' : i + 1}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {team.name} {team.isHuman && <span className="text-xs text-indigo-500">(te)</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">{result.total.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
