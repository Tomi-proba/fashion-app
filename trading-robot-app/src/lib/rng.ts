// Deterministic, persistable PRNG (mulberry32) so the simulated market can
// resume exactly where it left off after a page reload.
export function nextRandom(state: number): { value: number; nextState: number } {
  let t = (state + 0x6d2b79f5) >>> 0;
  const nextState = t;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, nextState };
}

export function nextGaussian(state: number): { value: number; nextState: number } {
  const r1 = nextRandom(state);
  const r2 = nextRandom(r1.nextState);
  const u1 = Math.max(r1.value, 1e-9);
  const u2 = r2.value;
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return { value: z, nextState: r2.nextState };
}
