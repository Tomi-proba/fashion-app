import type { RiskLevel, StrategyDef, StrategyId } from '../types';
import { avg, clamp, stdev } from './mathUtils';

// The risk level scales how aggressively a strategy swings its position size
// between 0% and 100% invested. Alacsony dampens the signal toward a steady
// ~50/50 split (smaller swings, smaller gains and losses); magas amplifies it
// toward the extremes (bigger swings both ways). It's a dial on the same
// strategy, not a different asset — the underlying eszköz's own volatility
// still applies on top of this.
export const RISK_MULTIPLIER: Record<RiskLevel, number> = {
  alacsony: 0.5,
  közepes: 1,
  magas: 1.8,
};

// Every strategy maps a price history to a *target fraction* (0..1) of the
// robot's sub-portfolio that should be invested in the underlying asset.
// None of them can guarantee a profit — they just react to the (random)
// simulated price path, same as any real trading rule would.

function trendFollowing(history: number[], risk: RiskLevel): number {
  const shortN = 10;
  const longN = 30;
  if (history.length < longN) return 0.5;
  const maShort = avg(history.slice(-shortN));
  const maLong = avg(history.slice(-longN));
  const signal = (maShort - maLong) / maLong;
  return clamp(0.5 + signal * 12 * RISK_MULTIPLIER[risk], 0, 1);
}

function meanReversion(history: number[], risk: RiskLevel): number {
  const n = 20;
  if (history.length < n) return 0.5;
  const window = history.slice(-n);
  const mean = avg(window);
  const sd = stdev(window, mean);
  if (sd === 0) return 0.5;
  const z = (history[history.length - 1] - mean) / sd;
  return clamp(0.5 - z * 0.3 * RISK_MULTIPLIER[risk], 0, 1);
}

function momentum(history: number[], risk: RiskLevel): number {
  const n = 5;
  if (history.length <= n) return 0.5;
  const past = history[history.length - 1 - n];
  const now = history[history.length - 1];
  const ret = (now - past) / past;
  return clamp(0.5 + ret * 6 * RISK_MULTIPLIER[risk], 0, 1);
}

function gridTrading(history: number[], risk: RiskLevel): number {
  const n = 60;
  if (history.length < n) return 0.5;
  const center = avg(history.slice(-n));
  const now = history[history.length - 1];
  const deviation = (now - center) / center;
  return clamp(0.5 - deviation * 2.5 * RISK_MULTIPLIER[risk], 0, 1);
}

export const STRATEGIES: Record<StrategyId, StrategyDef> = {
  trend: {
    id: 'trend',
    name: 'Trendkövető',
    description: 'Rövid és hosszú mozgóátlagot hasonlít össze — emelkedő trendben növeli, eséskor csökkenti a kitettséget.',
    targetFraction: trendFollowing,
  },
  meanReversion: {
    id: 'meanReversion',
    name: 'Átlaghoz visszahúzó',
    description: 'Az átlagostól nagyon eltérő ("túlreagált") árfolyamnál kereskedik — visszaesésnél vásárol, kiugráskor elad.',
    targetFraction: meanReversion,
  },
  momentum: {
    id: 'momentum',
    name: 'Momentum',
    description: 'Az elmúlt napok mozgásának irányát követi tovább — erősítő trendnél növeli a pozíciót.',
    targetFraction: momentum,
  },
  grid: {
    id: 'grid',
    name: 'Rácsstratégia',
    description: 'Egy csúszó középárhoz képest fokozatosan vásárol lefelé és ad el felfelé, kisebb, gyakori lépésekben.',
    targetFraction: gridTrading,
  },
};
