export function formatCredits(value: number): string {
  return `${Math.round(value).toLocaleString('hu-HU')} kredit`;
}

export function formatPct(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatDays(days: number): string {
  return `${days}. nap`;
}
