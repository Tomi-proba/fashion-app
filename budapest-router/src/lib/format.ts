export function formatKm(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatMin(min: number): string {
  if (min < 60) return `${Math.round(min)} perc`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m === 0 ? `${h} óra` : `${h} óra ${m} perc`;
}

export function formatHuf(huf: number): string {
  return `${Math.round(huf).toLocaleString('hu-HU')} Ft`;
}
