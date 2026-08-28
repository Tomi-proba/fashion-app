import { useMemo, useState } from 'react';
import { fantasyPointsPerGame } from '../lib/scoring';
import type { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  onDraft: (playerId: string) => void;
}

export default function PlayerList({ players, onDraft }: PlayerListProps) {
  const [query, setQuery] = useState('');

  const ranked = useMemo(() => {
    const filtered = query.trim()
      ? players.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
      : players;
    return [...filtered].sort((a, b) => fantasyPointsPerGame(b.stats) - fantasyPointsPerGame(a.stats));
  }, [players, query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Játékos keresése…"
        className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      />

      {/* Narrow screens: a card list where the Draft button always has its own room. */}
      <div className="flex max-h-[28rem] flex-col divide-y divide-slate-100 overflow-auto rounded-2xl border border-slate-200 md:hidden dark:divide-slate-800 dark:border-slate-800">
        {ranked.map((p) => (
          <div key={p.id} className="flex items-center gap-2 bg-white px-3 py-2 dark:bg-slate-900">
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                {p.name} <span className="text-xs text-slate-400">({p.team})</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {p.position} · {fantasyPointsPerGame(p.stats).toFixed(1)} FP
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDraft(p.id)}
              className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
            >
              Draft
            </button>
          </div>
        ))}
      </div>

      {/* Wider screens: full stat table. */}
      <div className="hidden max-h-[28rem] overflow-auto rounded-2xl border border-slate-200 md:block dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Játékos</th>
              <th className="px-3 py-2">Poszt</th>
              <th className="px-3 py-2 text-right">PTS</th>
              <th className="px-3 py-2 text-right">REB</th>
              <th className="px-3 py-2 text-right">AST</th>
              <th className="px-3 py-2 text-right">Fantasy</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {ranked.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium whitespace-nowrap text-slate-900 dark:text-slate-100">
                  {p.name} <span className="text-xs text-slate-400">({p.team})</span>
                </td>
                <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{p.position}</td>
                <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{p.stats.pts.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{p.stats.reb.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{p.stats.ast.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-semibold whitespace-nowrap text-indigo-600 dark:text-indigo-400">{fantasyPointsPerGame(p.stats).toFixed(1)}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => onDraft(p.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium whitespace-nowrap text-white hover:bg-indigo-500"
                  >
                    Draft
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
