export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface PlayerStats {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tpm: number; // 3-pointers made
  tov: number; // turnovers
}

export interface Player {
  id: string;
  name: string;
  team: string;
  position: Position;
  stats: PlayerStats;
}

export interface FantasyTeam {
  id: number;
  name: string;
  isHuman: boolean;
  playerIds: string[];
}

export interface DraftState {
  teams: FantasyTeam[];
  pickOrder: number[]; // team index for each pick, in order
  currentPick: number; // index into pickOrder
  draftedPlayerIds: string[];
  finished: boolean;
}

export interface WeeklyResult {
  teamId: number;
  playerScores: { playerId: string; points: number }[];
  total: number;
}
