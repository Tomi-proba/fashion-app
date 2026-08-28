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
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
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
          <tbody className="max-h-96">
            {ranked.map((p) => (
              <tr key={p.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-3 py-2 font-medium text-slate-900 dark:text-slate-100">
                  {p.name} <span className="text-xs text-slate-400">({p.team})</span>
                </td>
                <td className="px-3 py-2 text-slate-500 dark:text-slate-400">{p.position}</td>
                <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{p.stats.pts.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{p.stats.reb.toFixed(1)}</td>
                <td className="px-3 py-2 text-right text-slate-700 dark:text-slate-200">{p.stats.ast.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-semibold text-indigo-600 dark:text-indigo-400">{fantasyPointsPerGame(p.stats).toFixed(1)}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => onDraft(p.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
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
