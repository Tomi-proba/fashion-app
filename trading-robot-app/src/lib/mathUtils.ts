export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function avg(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function stdev(values: number[], mean: number): number {
  const variance = avg(values.map((v) => (v - mean) ** 2));
  return Math.sqrt(variance);
}
