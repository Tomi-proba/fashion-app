import type { ScoreResult } from '../data/types'

const verdictStyles: Record<ScoreResult['verdict'], string> = {
  great: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  good: 'bg-lime-100 text-lime-800 border-lime-300 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800',
  risky: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  poor: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
}

const verdictLabel: Record<ScoreResult['verdict'], string> = {
  great: 'Great match',
  good: 'Good match',
  risky: 'Risky choice',
  poor: 'Not appropriate',
}

export default function ScoreBadge({ result }: { result: ScoreResult }) {
  return (
    <div className={`rounded-xl border p-3 ${verdictStyles[result.verdict]}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{verdictLabel[result.verdict]}</span>
        <span className="text-lg font-bold tabular-nums">{result.score.toFixed(1)}/10</span>
      </div>
      <ul className="mt-1.5 space-y-1 text-left text-xs leading-snug">
        {result.reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  )
}
