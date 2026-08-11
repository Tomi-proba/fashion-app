import { STRATEGIES } from '../lib/strategies';
import { backtestRobot } from '../lib/robotBacktest';
import { formatCredits, formatPct } from '../lib/format';
import Modal from './Modal';
import RiskBadge from './RiskBadge';
import SparklineChart from './SparklineChart';
import type { MarketState, RobotDef } from '../types';

interface RobotDetailModalProps {
  robot: RobotDef;
  market: MarketState;
  canAfford: boolean;
  onBuy: () => void;
  onClose: () => void;
}

export default function RobotDetailModal({ robot, market, canAfford, onBuy, onClose }: RobotDetailModalProps) {
  const { equity, stats } = backtestRobot(robot, market);
  const strategy = STRATEGIES[robot.strategyId];

  return (
    <Modal onClose={onClose}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{robot.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{strategy.name} · {robot.assetSymbol}</p>
        </div>
        <RiskBadge level={robot.riskLevel} />
      </div>

      <div className="my-4">
        <SparklineChart values={equity} referenceValue={1000} width={440} height={120} />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
          <div className="text-slate-500 dark:text-slate-400">Szimulált hozam</div>
          <div className={`font-semibold ${stats.roiPct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatPct(stats.roiPct)}</div>
        </div>
        <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
          <div className="text-slate-500 dark:text-slate-400">Max. visszaesés</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">-{stats.maxDrawdownPct.toFixed(1)}%</div>
        </div>
        <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
          <div className="text-slate-500 dark:text-slate-400">Volatilitás</div>
          <div className="font-semibold text-slate-800 dark:text-slate-200">{stats.volatilityPct.toFixed(1)}%</div>
        </div>
      </div>

      <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">{robot.description}</p>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300"><strong>Stratégia:</strong> {strategy.description}</p>

      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
        A fenti diagram egy szimulált, véletlen árfolyamon lefuttatott visszateszt — nem valós kereskedési
        eredmény, és nem garantálja, hogy a robot a jövőben (akár csak a befektetett összeg erejéig) nyereséges
        lesz. Kereskedési díj minden ügyletnél levonásra kerül.
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{formatCredits(robot.price)}</div>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Mégse
          </button>
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Megvétel játékpénzért
          </button>
        </div>
      </div>
    </Modal>
  );
}
