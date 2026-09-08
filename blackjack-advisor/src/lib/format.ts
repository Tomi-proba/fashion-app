export function formatEv(ev: number): string {
  const sign = ev > 0 ? '+' : '';
  return `${sign}${ev.toFixed(3)}`;
}

export function formatPct(pct: number): string {
  return `${pct.toFixed(1)}%`;
}

export const ACTION_LABEL: Record<string, string> = {
  stand: 'Megáll (Stand)',
  hit: 'Húz (Hit)',
  double: 'Dupláz (Double)',
  split: 'Szétoszt (Split)',
  surrender: 'Feladja (Surrender)',
};
