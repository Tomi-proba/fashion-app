import { ROBOTS } from '../data/robots';
import { formatCredits, formatPct } from '../lib/format';
import { backtestRobot } from '../lib/robotBacktest';
import { STRATEGIES } from '../lib/strategies';
import RiskBadge from './RiskBadge';
import type { MarketState } from '../types';
import type { BuyResult } from '../lib/useGame';

interface LeaderboardProps {
  market: MarketState;
  onBuy: (robotId: string) => BuyResult;
}

export default function Leaderboard({ market, onBuy }: LeaderboardProps) {
  const ranked = ROBOTS.map((robot) => ({ robot, ...backtestRobot(robot, market) })).sort(
    (a, b) => b.stats.roiPct - a.stats.roiPct,
  );

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Ranglista</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        A robotok szimulált, visszatesztelt teljesítménye alapján rangsorolva a piactér indulása óta. Ez nem
        valós más felhasználók eredménye — egyjátékos demó, a "követés" a robot megvásárlását jelenti.
      </p>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Robot</th>
              <th className="px-4 py-2 hidden sm:table-cell">Stratégia</th>
              <th className="px-4 py-2">Kockázat</th>
              <th className="px-4 py-2">Hozam</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {ranked.map(({ robot, stats }, i) => (
              <tr key={robot.id} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{robot.name}</td>
                <td className="px-4 py-3 hidden text-slate-500 dark:text-slate-400 sm:table-cell">{STRATEGIES[robot.strategyId].name}</td>
                <td className="px-4 py-3"><RiskBadge level={robot.riskLevel} /></td>
                <td className={`px-4 py-3 font-semibold ${stats.roiPct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {formatPct(stats.roiPct)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onBuy(robot.id)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
                  >
                    Követés ({formatCredits(robot.price)})
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
