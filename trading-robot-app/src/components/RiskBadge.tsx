import type { RiskLevel } from '../types';

const STYLES: Record<RiskLevel, string> = {
  alacsony: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
  közepes: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  magas: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
};

export default function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STYLES[level]}`}>
      {level} kockázat
    </span>
  );
}
