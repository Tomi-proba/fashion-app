import { getRobot } from '../data/robots';
import { ASSETS } from '../lib/market';
import { STRATEGIES } from '../lib/strategies';
import { backtestCombo } from '../lib/robotBacktest';
import { computeSignal } from '../lib/signal';
import { formatPct } from '../lib/format';
import RiskBadge from './RiskBadge';
import SignalBadge from './SignalBadge';
import SparklineChart from './SparklineChart';
import type { MarketState, Watch } from '../types';

interface WatchCardProps {
  watch: Watch;
  market: MarketState;
  onRemove: (id: string) => void;
}

export default function WatchCard({ watch, market, onRemove }: WatchCardProps) {
  const robot = getRobot(watch.robotId);
  if (!robot) return null;
  const strategy = STRATEGIES[robot.strategyId];
  const assetDef = ASSETS.find((a) => a.symbol === watch.assetSymbol)!;
  const history = market.histories[watch.assetSymbol];
  const last = history[history.length - 1];

  const signal = computeSignal(robot.strategyId, watch.assetSymbol, watch.riskLevel, market);
  const { equity, stats } = backtestCombo(robot.strategyId, watch.assetSymbol, watch.riskLevel, market);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{robot.name}</h3>
            <RiskBadge level={watch.riskLevel} />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {strategy.name} · {assetDef.name}{last !== undefined ? ` · ${last.toFixed(2)}` : ''}
          </div>
          <div className="mt-1">
            <SignalBadge tone={signal.tone} label={signal.label} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SparklineChart values={equity.slice(-90)} referenceValue={1000} width={160} height={48} />
        <div className="w-20 text-right text-sm">
          <div className="text-slate-400">mai hozam</div>
          {equity.length < 5 ? (
            <div className="font-semibold text-slate-400">—</div>
          ) : (
            <div className={`font-semibold ${stats.roiPct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatPct(stats.roiPct)}</div>
          )}
        </div>
        <button
          onClick={() => onRemove(watch.id)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Eltávolítás
        </button>
      </div>
    </div>
  );
}
