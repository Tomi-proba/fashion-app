import { STRATEGIES } from '../lib/strategies';
import { backtestRobot } from '../lib/robotBacktest';
import { formatCredits, formatPct } from '../lib/format';
import RiskBadge from './RiskBadge';
import SparklineChart from './SparklineChart';
import type { MarketState, RobotDef } from '../types';

interface RobotCardProps {
  robot: RobotDef;
  market: MarketState;
  ownedCount: number;
  canAfford: boolean;
  onBuy: () => void;
  onOpenDetail: () => void;
}

export default function RobotCard({ robot, market, ownedCount, canAfford, onBuy, onOpenDetail }: RobotCardProps) {
  const { equity, stats } = backtestRobot(robot, market);
  const strategy = STRATEGIES[robot.strategyId];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{robot.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{strategy.name} · {robot.assetSymbol}</p>
        </div>
        <RiskBadge level={robot.riskLevel} />
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">{robot.tagline}</p>

      <button onClick={onOpenDetail} className="self-start">
        <SparklineChart values={equity.slice(-90)} referenceValue={1000} width={220} height={56} />
      </button>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">Szimulált hozam a piactér indulása óta</span>
        <span className={stats.roiPct >= 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-500'}>
          {formatPct(stats.roiPct)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCredits(robot.price)}</div>
        <div className="flex items-center gap-2">
          {ownedCount > 0 && (
            <span className="text-xs text-slate-400">{ownedCount}× megvéve</span>
          )}
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Megvétel
          </button>
        </div>
      </div>
    </div>
  );
}
