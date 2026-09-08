import { baseComposition, drawCard, handValue, removeKnownCards } from './deck';
import type { Action, ActionResult, Rank, Rules } from '../types';

const TRIALS_PER_ACTION = 100000;

// Egyszerű, gyors, jó statisztikai tulajdonságú pszeudovéletlen-generátor
// (mulberry32) — determinisztikus seeddel is használható, de itt csak a
// Math.random()-nál valamivel olcsóbb hívás miatt van.
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function compare(playerTotal: number, dealerTotal: number): number {
  if (playerTotal > 21) return -1;
  if (dealerTotal > 21) return 1;
  if (playerTotal > dealerTotal) return 1;
  if (playerTotal < dealerTotal) return -1;
  return 0;
}

function playDealer(comp: Record<Rank, number>, upCard: Rank, rules: Rules, rng: () => number): number {
  const cards: Rank[] = [upCard, drawCard(comp, rng)];
  let { total, soft } = handValue(cards);
  while (total < 17 || (total === 17 && soft && rules.dealerHitsSoft17)) {
    cards.push(drawCard(comp, rng));
    ({ total, soft } = handValue(cards));
    if (total > 21) break;
  }
  return total;
}

// A "hit" utáni további lapkérést egyszerűsítve, a lehetséges legjobb
// folytatás helyett egy óvatos, az osztóéhoz hasonló megállási szabállyal
// modellezzük (kemény 17-ig, illetve a beállítástól függően lágy 17-ig húz).
// Ez nem teljesen egyenértékű a tökéletes, minden további döntést is
// újraszámoló optimális stratégiával, de jó közelítés, és így a szimuláció
// gyors marad.
function continueHitting(comp: Record<Rank, number>, startCards: Rank[], rules: Rules, rng: () => number): Rank[] {
  const cards = [...startCards];
  let { total, soft } = handValue(cards);
  while (total < 17 || (total === 17 && soft && rules.dealerHitsSoft17)) {
    cards.push(drawCard(comp, rng));
    ({ total, soft } = handValue(cards));
    if (total > 21) break;
  }
  return cards;
}

function freshComp(rules: Rules, knownCards: Rank[]): Record<Rank, number> {
  const comp = baseComposition(rules.numDecks);
  removeKnownCards(comp, knownCards);
  return comp;
}

function simulateStand(playerCards: Rank[], dealerUp: Rank, rules: Rules, rng: () => number, trials: number): number[] {
  const playerTotal = handValue(playerCards).total;
  const outcomes: number[] = [];
  for (let i = 0; i < trials; i++) {
    const comp = freshComp(rules, [...playerCards, dealerUp]);
    const dealerTotal = playDealer(comp, dealerUp, rules, rng);
    outcomes.push(compare(playerTotal, dealerTotal));
  }
  return outcomes;
}

function simulateHit(playerCards: Rank[], dealerUp: Rank, rules: Rules, rng: () => number, trials: number): number[] {
  const outcomes: number[] = [];
  for (let i = 0; i < trials; i++) {
    const comp = freshComp(rules, [...playerCards, dealerUp]);
    let cards = [...playerCards, drawCard(comp, rng)];
    if (handValue(cards).total > 21) {
      outcomes.push(-1);
      continue;
    }
    cards = continueHitting(comp, cards, rules, rng);
    const playerTotal = handValue(cards).total;
    if (playerTotal > 21) {
      outcomes.push(-1);
      continue;
    }
    const dealerTotal = playDealer(comp, dealerUp, rules, rng);
    outcomes.push(compare(playerTotal, dealerTotal));
  }
  return outcomes;
}

function simulateDouble(playerCards: Rank[], dealerUp: Rank, rules: Rules, rng: () => number, trials: number): number[] {
  const outcomes: number[] = [];
  for (let i = 0; i < trials; i++) {
    const comp = freshComp(rules, [...playerCards, dealerUp]);
    const cards = [...playerCards, drawCard(comp, rng)];
    const playerTotal = handValue(cards).total;
    if (playerTotal > 21) {
      outcomes.push(-2);
      continue;
    }
    const dealerTotal = playDealer(comp, dealerUp, rules, rng);
    outcomes.push(2 * compare(playerTotal, dealerTotal));
  }
  return outcomes;
}

function simulateSplit(playerCards: Rank[], dealerUp: Rank, rules: Rules, rng: () => number, trials: number): number[] {
  const isAces = playerCards[0] === 'A';
  const outcomes: number[] = [];
  for (let i = 0; i < trials; i++) {
    const comp = freshComp(rules, [...playerCards, dealerUp]);
    let hand1: Rank[] = [playerCards[0], drawCard(comp, rng)];
    let hand2: Rank[] = [playerCards[1], drawCard(comp, rng)];
    if (!isAces) {
      if (handValue(hand1).total <= 21) hand1 = continueHitting(comp, hand1, rules, rng);
      if (handValue(hand2).total <= 21) hand2 = continueHitting(comp, hand2, rules, rng);
    }
    const t1 = handValue(hand1).total;
    const t2 = handValue(hand2).total;
    const needsDealer = t1 <= 21 || t2 <= 21;
    const dealerTotal = needsDealer ? playDealer(comp, dealerUp, rules, rng) : 0;
    const r1 = t1 > 21 ? -1 : compare(t1, dealerTotal);
    const r2 = t2 > 21 ? -1 : compare(t2, dealerTotal);
    outcomes.push(r1 + r2);
  }
  return outcomes;
}

function summarize(action: Action, outcomes: number[]): ActionResult {
  const trials = outcomes.length;
  const wins = outcomes.filter((o) => o > 0).length;
  const pushes = outcomes.filter((o) => o === 0).length;
  const losses = trials - wins - pushes;
  const evPerUnit = outcomes.reduce((sum, o) => sum + o, 0) / trials;
  return {
    action,
    evPerUnit,
    winPct: (wins / trials) * 100,
    pushPct: (pushes / trials) * 100,
    lossPct: (losses / trials) * 100,
    trials,
  };
}

export interface EvaluateOptions {
  playerCards: Rank[];
  dealerUp: Rank;
  rules: Rules;
  seed?: number;
}

export function evaluateActions({ playerCards, dealerUp, rules, seed }: EvaluateOptions): ActionResult[] {
  const rng = mulberry32(seed ?? Date.now());
  const results: ActionResult[] = [];

  results.push(summarize('stand', simulateStand(playerCards, dealerUp, rules, rng, TRIALS_PER_ACTION)));
  results.push(summarize('hit', simulateHit(playerCards, dealerUp, rules, rng, TRIALS_PER_ACTION)));

  const canDouble = playerCards.length === 2 && rules.doubleAnyTwo;
  if (canDouble) {
    results.push(summarize('double', simulateDouble(playerCards, dealerUp, rules, rng, TRIALS_PER_ACTION)));
  }

  const canSplit = playerCards.length === 2 && playerCards[0] === playerCards[1];
  if (canSplit) {
    results.push(summarize('split', simulateSplit(playerCards, dealerUp, rules, rng, TRIALS_PER_ACTION)));
  }

  if (playerCards.length === 2 && rules.surrenderAllowed) {
    results.push({ action: 'surrender', evPerUnit: -0.5, winPct: 0, pushPct: 0, lossPct: 100, trials: 0 });
  }

  return results.sort((a, b) => b.evPerUnit - a.evPerUnit);
}
