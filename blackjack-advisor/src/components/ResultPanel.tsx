import { ACTION_LABEL, formatEv, formatPct } from '../lib/format';
import type { ActionResult } from '../types';

const ACTION_COLOR: Record<string, string> = {
  stand: 'bg-blue-600',
  hit: 'bg-emerald-600',
  double: 'bg-amber-600',
  split: 'bg-purple-600',
  surrender: 'bg-slate-500',
};

export default function ResultPanel({ results, trialsPerAction }: { results: ActionResult[]; trialsPerAction: number }) {
  if (results.length === 0) return null;
  const best = results[0];

  return (
    <div className="flex flex-col gap-4">
      <div className={`rounded-2xl p-5 text-white ${ACTION_COLOR[best.action] ?? 'bg-slate-700'}`}>
        <div className="text-xs font-semibold uppercase tracking-wide opacity-80">Ajánlott lépés</div>
        <div className="mt-1 text-2xl font-bold">{ACTION_LABEL[best.action]}</div>
        <div className="mt-1 text-sm opacity-90">
          Várható érték: {formatEv(best.evPerUnit)} egység/kör ({trialsPerAction.toLocaleString('hu-HU')} szimulált
          kör alapján)
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2">Lépés</th>
              <th className="px-3 py-2">Várható érték</th>
              <th className="px-3 py-2">Nyerés</th>
              <th className="px-3 py-2">Döntetlen</th>
              <th className="px-3 py-2">Vesztés</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.map((r) => (
              <tr key={r.action} className={r.action === best.action ? 'bg-slate-50 dark:bg-slate-800/40' : ''}>
                <td className="px-3 py-2 font-medium text-slate-800 dark:text-slate-200">{ACTION_LABEL[r.action]}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{formatEv(r.evPerUnit)}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{formatPct(r.winPct)}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{formatPct(r.pushPct)}</td>
                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{formatPct(r.lossPct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
