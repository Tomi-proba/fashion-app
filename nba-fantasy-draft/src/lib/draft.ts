import { PLAYERS } from '../data/players';
import { fantasyPointsPerGame } from './scoring';
import type { DraftState, Player } from '../types';

export const NUM_TEAMS = 4;
export const ROUNDS = 5;
export const TEAM_NAMES = ['A csapatod', 'Bot Sasok', 'Bot Viharok', 'Bot Óriások'];

function buildPickOrder(): number[] {
  const order: number[] = [];
  for (let round = 0; round < ROUNDS; round++) {
    const seq = round % 2 === 0 ? [0, 1, 2, 3] : [3, 2, 1, 0];
    order.push(...seq);
  }
  return order;
}

export function createInitialDraft(): DraftState {
  return {
    teams: TEAM_NAMES.map((name, id) => ({ id, name, isHuman: id === 0, playerIds: [] })),
    pickOrder: buildPickOrder(),
    currentPick: 0,
    draftedPlayerIds: [],
    finished: false,
  };
}

export function availablePlayers(state: DraftState): Player[] {
  const drafted = new Set(state.draftedPlayerIds);
  return PLAYERS.filter((p) => !drafted.has(p.id));
}

export function currentTeamId(state: DraftState): number | null {
  if (state.finished) return null;
  return state.pickOrder[state.currentPick] ?? null;
}

export function draftPlayer(state: DraftState, playerId: string): DraftState {
  const teamId = currentTeamId(state);
  if (teamId === null) return state;
  const teams = state.teams.map((t) => (t.id === teamId ? { ...t, playerIds: [...t.playerIds, playerId] } : t));
  const draftedPlayerIds = [...state.draftedPlayerIds, playerId];
  const nextPick = state.currentPick + 1;
  const finished = nextPick >= state.pickOrder.length;
  return { ...state, teams, draftedPlayerIds, currentPick: nextPick, finished };
}

// Mostly takes the best available player, but not deterministically the same
// pick every time — a bit of variety across replays.
function pickBotPlayer(available: Player[]): Player {
  const ranked = [...available].sort((a, b) => fantasyPointsPerGame(b.stats) - fantasyPointsPerGame(a.stats));
  const r = Math.random();
  const idx = r < 0.7 ? 0 : r < 0.9 ? 1 : 2;
  return ranked[Math.min(idx, ranked.length - 1)];
}

// Advances through consecutive bot turns automatically, stopping when it's
// the human's turn again or the draft is over.
export function autoAdvanceBotPicks(state: DraftState): DraftState {
  let next = state;
  while (!next.finished) {
    const teamId = currentTeamId(next);
    if (teamId === null) break;
    const team = next.teams[teamId];
    if (team.isHuman) break;
    const available = availablePlayers(next);
    if (available.length === 0) break;
    next = draftPlayer(next, pickBotPlayer(available).id);
  }
  return next;
}
