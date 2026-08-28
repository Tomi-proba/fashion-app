import { getPlayer } from '../data/players';
import { fantasyPointsPerGame } from './scoring';
import type { FantasyTeam, WeeklyResult } from '../types';

function gaussian(): number {
  const u1 = Math.max(Math.random(), 1e-9);
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// A single "game night" for each player: their average with realistic
// night-to-night variance (~22% stdev), never negative.
function simulatedGameScore(avg: number): number {
  const score = avg + gaussian() * avg * 0.22;
  return Math.max(0, score);
}

export function simulateWeek(teams: FantasyTeam[]): WeeklyResult[] {
  return teams.map((team) => {
    const playerScores = team.playerIds.map((playerId) => {
      const player = getPlayer(playerId);
      const avg = player ? fantasyPointsPerGame(player.stats) : 0;
      return { playerId, points: simulatedGameScore(avg) };
    });
    const total = playerScores.reduce((sum, p) => sum + p.points, 0);
    return { teamId: team.id, playerScores, total };
  });
}
