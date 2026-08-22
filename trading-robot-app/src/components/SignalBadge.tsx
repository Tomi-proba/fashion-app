import type { SignalTone } from '../lib/signal';

const STYLES: Record<SignalTone, string> = {
  'strong-buy': 'bg-emerald-600 text-white',
  buy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  hold: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  sell: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
  'strong-sell': 'bg-rose-600 text-white',
};

export default function SignalBadge({ tone, label }: { tone: SignalTone; label: string }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${STYLES[tone]}`}>{label}</span>;
}
