import type { PlayerStats } from '../types';

// A common "points league" fantasy basketball scoring formula.
const WEIGHTS = {
  pts: 1,
  reb: 1.2,
  ast: 1.5,
  stl: 3,
  blk: 3,
  tpm: 0.5,
  tov: -1,
} as const;

export function fantasyPointsPerGame(stats: PlayerStats): number {
  return (
    stats.pts * WEIGHTS.pts +
    stats.reb * WEIGHTS.reb +
    stats.ast * WEIGHTS.ast +
    stats.stl * WEIGHTS.stl +
    stats.blk * WEIGHTS.blk +
    stats.tpm * WEIGHTS.tpm +
    stats.tov * WEIGHTS.tov
  );
}
