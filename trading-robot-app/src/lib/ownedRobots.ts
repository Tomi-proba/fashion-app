import { getRobot } from '../data/robots';
import type { MarketState, OwnedRobot } from '../types';
import { computeStats, simulatePortfolio } from './portfolio';

export function getLiveEquityCurve(owned: OwnedRobot, market: MarketState): number[] {
  const robot = getRobot(owned.robotId);
  if (!robot) return [owned.costBasis];
  const fullHistory = market.histories[robot.assetSymbol];
  const endIndex = owned.sold && owned.soldAtIndex !== undefined ? owned.soldAtIndex + 1 : fullHistory.length;
  const sliceHistory = fullHistory.slice(owned.purchasedAtIndex, endIndex);
  if (sliceHistory.length === 0) return [owned.costBasis];
  const { equity } = simulatePortfolio(sliceHistory, robot.strategyId, owned.costBasis);
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
