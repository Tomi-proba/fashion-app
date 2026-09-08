import { RANKS, type Rank } from '../types';

export function rankValue(r: Rank): number {
  if (r === 'A') return 11;
  if (r === '10') return 10;
  return Number(r);
}

export interface HandValue {
  total: number;
  soft: boolean;
}

export function handValue(cards: Rank[]): HandValue {
  let total = 0;
  let aces = 0;
  for (const r of cards) {
    if (r === 'A') {
      total += 11;
      aces++;
    } else {
      total += rankValue(r);
    }
  }
  let softAces = aces;
  while (total > 21 && softAces > 0) {
    total -= 10;
    softAces--;
  }
  return { total, soft: softAces > 0 };
}

export function isBlackjack(cards: Rank[]): boolean {
  return cards.length === 2 && handValue(cards).total === 21;
}

export function isBust(cards: Rank[]): boolean {
  return handValue(cards).total > 21;
}

// Egy pakli (52 lap) tényleges összetétele rang szerint: 4-4 az A-tól 9-ig,
// 16 a "10 értékű" csoportból (10, J, Q, K).
export function baseComposition(numDecks: number): Record<Rank, number> {
  const comp = {} as Record<Rank, number>;
  for (const r of RANKS) comp[r] = (r === '10' ? 16 : 4) * numDecks;
  return comp;
}

export function removeKnownCards(comp: Record<Rank, number>, cards: Rank[]): void {
  for (const c of cards) comp[c] = Math.max(0, comp[c] - 1);
}

export function drawCard(comp: Record<Rank, number>, rng: () => number): Rank {
  const total = RANKS.reduce((sum, r) => sum + comp[r], 0);
  let x = rng() * total;
  for (const r of RANKS) {
    if (x < comp[r]) {
      comp[r]--;
      return r;
    }
    x -= comp[r];
  }
  const fallback = RANKS[RANKS.length - 1];
  comp[fallback] = Math.max(0, comp[fallback] - 1);
  return fallback;
}
