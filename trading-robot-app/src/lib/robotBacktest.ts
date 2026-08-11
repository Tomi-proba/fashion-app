import type { MarketState, RobotDef } from '../types';
import { computeStats, simulatePortfolio } from './portfolio';

const BACKTEST_BASE_VALUE = 1000;

// A robot's marketplace "track record": replays its strategy over the
// entire simulated market history so far. This is a backtest on a random
// price path, not a real trading record — the UI must always label it as such.
export function backtestRobot(robot: RobotDef, market: MarketState) {
  const history = market.histories[robot.assetSymbol];
  const { equity } = simulatePortfolio(history, robot.strategyId, BACKTEST_BASE_VALUE);
  const stats = computeStats(equity, BACKTEST_BASE_VALUE);
  return { equity, stats };
}
