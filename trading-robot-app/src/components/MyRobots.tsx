import { getRobot } from '../data/robots';
import { formatCredits, formatPct } from '../lib/format';
import { getLiveEquityCurve, getOwnedStats } from '../lib/ownedRobots';
import RiskBadge from './RiskBadge';
import SparklineChart from './SparklineChart';
import type { MarketState, OwnedRobot } from '../types';

interface MyRobotsProps {
  market: MarketState;
  owned: OwnedRobot[];
  onSell: (instanceId: string) => void;
}

export default function MyRobots({ market, owned, onSell }: MyRobotsProps) {
  if (owned.length === 0) {
    return (
      <div>
        <h1 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Robotjaim</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Még nincs robotod. Nézz körül a Piactéren, és vegyél egyet játékpénzért.
        </p>
      </div>
    );
  }

  const active = owned.filter((o) => !o.sold);
  const sold = owned.filter((o) => o.sold);

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Robotjaim</h1>

      {active.length > 0 && (
        <div className="mb-6 flex flex-col gap-3">
          {active.map((o) => {
            const robot = getRobot(o.robotId);
            if (!robot) return null;
            const equity = getLiveEquityCurve(o, market);
            const stats = getOwnedStats(o, market);
            const recoveredPct = Math.min(100, (stats.currentValue / o.costBasis) * 100);
            return (
              <div key={o.instanceId} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{robot.name}</h3>
                      <RiskBadge level={robot.riskLevel} />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Vételár: {formatCredits(o.costBasis)} · Jelenlegi érték: {formatCredits(stats.currentValue)}
                    </div>
                    <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full bg-indigo-500" style={{ width: `${recoveredPct}%` }} />
                    </div>
                    <div className="text-xs text-slate-400">{recoveredPct.toFixed(0)}% megtérülve a vételárból</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <SparklineChart values={equity} referenceValue={o.costBasis} width={160} height={48} />
                  <div className={`w-16 text-right text-sm font-semibold ${stats.roiPct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {formatPct(stats.roiPct)}
                  </div>
                  <button
                    onClick={() => onSell(o.instanceId)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Eladás
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sold.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Eladott robotok</h2>
          <div className="flex flex-col gap-2">
            {sold.map((o) => {
              const robot = getRobot(o.robotId);
              if (!robot) return null;
              const stats = getOwnedStats(o, market);
              return (
                <div key={o.instanceId} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-slate-700 dark:text-slate-200">{robot.name}</span>
                  <span className="text-slate-400">{formatCredits(o.costBasis)} → {formatCredits(o.soldValue ?? 0)}</span>
                  <span className={stats.roiPct >= 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-rose-500'}>
                    {formatPct(stats.roiPct)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
