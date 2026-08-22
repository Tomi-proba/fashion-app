import { useMemo, useState } from 'react';
import { ASSETS } from '../lib/market';
import { STRATEGIES, RISK_MULTIPLIER } from '../lib/strategies';
import { backtestCombo } from '../lib/robotBacktest';
import { computeSignal } from '../lib/signal';
import { formatPct } from '../lib/format';
import Modal from './Modal';
import SignalBadge from './SignalBadge';
import SparklineChart from './SparklineChart';
import type { AssetSymbol, MarketState, RiskLevel, RobotDef } from '../types';

const RISK_LEVELS: RiskLevel[] = ['alacsony', 'közepes', 'magas'];
const RISK_HINT: Record<RiskLevel, string> = {
  alacsony: 'kisebb kilengés — ritkábban vált erős jelzést',
  közepes: 'a stratégia alapbeállítása',
  magas: 'nagyobb kilengés — gyakrabban ad erős jelzést',
};

interface AddWatchModalProps {
  robot: RobotDef;
  market: MarketState;
  initialAsset?: AssetSymbol;
  onAdd: (assetSymbol: AssetSymbol, riskLevel: RiskLevel) => void;
  onClose: () => void;
}

export default function AddWatchModal({ robot, market, initialAsset, onAdd, onClose }: AddWatchModalProps) {
  const [asset, setAsset] = useState<AssetSymbol>(initialAsset ?? ASSETS[0].symbol);
  const [risk, setRisk] = useState<RiskLevel>('közepes');

  const strategy = STRATEGIES[robot.strategyId];
  const assetDef = ASSETS.find((a) => a.symbol === asset)!;
  const { equity, stats } = useMemo(() => backtestCombo(robot.strategyId, asset, risk, market), [robot.strategyId, asset, risk, market]);
  const signal = useMemo(() => computeSignal(robot.strategyId, asset, risk, market), [robot.strategyId, asset, risk, market]);

  return (
    <Modal onClose={onClose}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{robot.name}</h2>
      <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">{strategy.name} — {robot.description}</p>

      <div className="mb-4">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Eszköz</div>
        <div className="flex flex-wrap gap-2">
          {ASSETS.map((a) => (
            <button
              key={a.symbol}
              onClick={() => setAsset(a.symbol)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                asset === a.symbol
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Kockázati szint</div>
        <div className="flex flex-wrap gap-2">
          {RISK_LEVELS.map((r) => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                risk === r
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {r} ({RISK_MULTIPLIER[r]}×)
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-400">{RISK_HINT[risk]}</p>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
        <span className="text-sm text-slate-600 dark:text-slate-300">Jelenlegi jelzés</span>
        <SignalBadge tone={signal.tone} label={signal.label} />
      </div>

      <div className="my-4">
        <SparklineChart values={equity} referenceValue={1000} width={440} height={110} />
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-800">
          <div className="text-slate-500 dark:text-slate-400">Hozam (mai adatgyűjtés)</div>
          {equity.length < 5 ? (
            <div className="font-semibold text-slate-400">adatgyűjtés…</div>
          ) : (
            <div className={`font-semibold ${stats.roiPct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatPct(stats.roiPct)}</div>
          )}
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

      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
        A fenti diagram és a jelzés a stratégiát futtatja le a {assetDef.name} valós, élő árfolyamán, azóta, hogy
        ez a böngésző csatlakozott az adatfolyamhoz — nem hosszú távú, valós kereskedési eredmény, nem garantálja
        a jövőbeli teljesítményt, és nem minősül befektetési tanácsnak. A figyelő csak megjeleníti a jelzést —
        semmit nem vásárol vagy ad el helyetted.
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
          Mégse
        </button>
        <button
          onClick={() => onAdd(asset, risk)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Hozzáadás a figyelőlistához
        </button>
      </div>
    </Modal>
  );
}
