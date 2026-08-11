import { getRobot } from '../data/robots';
import type { MarketState, OwnedRobot } from '../types';
import { computeStats, simulatePortfolio } from './portfolio';

// OwnedRobot indices are absolute (never reset), but market.histories only keeps
// the most recent MAX_HISTORY_LENGTH points per symbol — this maps an absolute
// index back into the currently-available slice, clamping to what's still there.
export function getLiveEquityCurve(owned: OwnedRobot, market: MarketState): number[] {
  const robot = getRobot(owned.robotId);
  if (!robot) return [owned.costBasis];
  const fullHistory = market.histories[owned.assetSymbol];
  const offset = market.historyOffsets[owned.assetSymbol];

  const startAbs = owned.purchasedAtIndex;
  const endAbs = owned.sold && owned.soldAtIndex !== undefined ? owned.soldAtIndex + 1 : offset + fullHistory.length;

  const startLocal = Math.max(0, startAbs - offset);
  const endLocal = Math.max(startLocal, endAbs - offset);
  const sliceHistory = fullHistory.slice(startLocal, endLocal);

  if (sliceHistory.length === 0) return [owned.costBasis];
  const { equity } = simulatePortfolio(sliceHistory, robot.strategyId, owned.riskLevel, owned.costBasis);
  return equity;
}

export function getOwnedStats(owned: OwnedRobot, market: MarketState) {
  if (owned.sold && owned.soldValue !== undefined) {
    const roiPct = ((owned.soldValue - owned.costBasis) / owned.costBasis) * 100;
    return { currentValue: owned.soldValue, roiPct, maxDrawdownPct: 0, volatilityPct: 0, tradeCount: 0 };
  }
  const equity = getLiveEquityCurve(owned, market);
  return computeStats(equity, owned.costBasis);
}
