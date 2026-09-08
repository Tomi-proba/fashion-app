import type { Rules } from '../types';

const DECK_OPTIONS = [1, 2, 4, 6, 8];

export default function RulesPanel({ rules, onChange }: { rules: Rules; onChange: (rules: Rules) => void }) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
      <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">Szabályok</summary>
      <div className="mt-3 flex flex-col gap-3">
        <label className="flex items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
          Paklik száma
          <select
            value={rules.numDecks}
            onChange={(e) => onChange({ ...rules, numDecks: Number(e.target.value) })}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-slate-800"
          >
            {DECK_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={rules.dealerHitsSoft17}
            onChange={(e) => onChange({ ...rules, dealerHitsSoft17: e.target.checked })}
          />
          Osztó húz lágy 17-re (H17)
        </label>
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={rules.doubleAnyTwo}
            onChange={(e) => onChange({ ...rules, doubleAnyTwo: e.target.checked })}
          />
          Duplázás bármely 2 lapnál engedélyezett
        </label>
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={rules.surrenderAllowed}
            onChange={(e) => onChange({ ...rules, surrenderAllowed: e.target.checked })}
          />
          Feladás (surrender) engedélyezett
        </label>
      </div>
    </details>
  );
}
