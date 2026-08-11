import { useMemo, useState } from 'react';
import { ASSETS } from '../lib/market';
import { STRATEGIES, RISK_MULTIPLIER } from '../lib/strategies';
import { backtestCombo } from '../lib/robotBacktest';
import { formatCredits, formatPct } from '../lib/format';
import { MIN_ALLOCATION } from '../lib/useGame';
import Modal from './Modal';
import SparklineChart from './SparklineChart';
import type { AssetSymbol, MarketState, RiskLevel, RobotDef, WalletState } from '../types';
import type { BuyResult } from '../lib/useGame';

const RISK_LEVELS: RiskLevel[] = ['alacsony', 'közepes', 'magas'];
const RISK_HINT: Record<RiskLevel, string> = {
  alacsony: 'kisebb kilengés — kisebb nyereség és kisebb veszteség is',
  közepes: 'a stratégia alapbeállítása',
  magas: 'nagyobb kilengés — nagyobb nyereség és nagyobb veszteség is',
};

interface RobotConfigModalProps {
  robot: RobotDef;
  market: MarketState;
  wallet: WalletState;
  initialAsset?: AssetSymbol;
  onBuy: (assetSymbol: AssetSymbol, riskLevel: RiskLevel, capital: number) => BuyResult;
  onClose: () => void;
}

export default function RobotConfigModal({ robot, market, wallet, initialAsset, onBuy, onClose }: RobotConfigModalProps) {
  const [asset, setAsset] = useState<AssetSymbol>(initialAsset ?? ASSETS[0].symbol);
  const [risk, setRisk] = useState<RiskLevel>('közepes');
  const [capitalStr, setCapitalStr] = useState(() => String(Math.min(500, Math.max(MIN_ALLOCATION, Math.floor(wallet.balance)))));
  const [error, setError] = useState<string | null>(null);

  const strategy = STRATEGIES[robot.strategyId];
  const assetDef = ASSETS.find((a) => a.symbol === asset)!;
  const { equity, stats } = useMemo(() => backtestCombo(robot.strategyId, asset, risk, market), [robot.strategyId, asset, risk, market]);

  const capital = Number(capitalStr.replace(',', '.'));
  const capitalValid = Number.isFinite(capital) && capital >= MIN_ALLOCATION && capital <= wallet.balance;

  const setPct = (pct: number) => setCapitalStr(String(Math.max(MIN_ALLOCATION, Math.floor(wallet.balance * pct))));

  const handleBuy = () => {
    const result = onBuy(asset, risk, capital);
    if (!result.ok) setError(result.message ?? 'A vásárlás nem sikerült.');
  };

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

      <div className="mb-4">
        <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Befektetett tőke ({assetDef.name})
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            inputMode="decimal"
            value={capitalStr}
            onChange={(e) => setCapitalStr(e.target.value)}
            className="w-32 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <span className="text-sm text-slate-500 dark:text-slate-400">kredit</span>
          <button onClick={() => setPct(0.25)} className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">25%</button>
          <button onClick={() => setPct(0.5)} className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">50%</button>
          <button onClick={() => setPct(1)} className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">100%</button>
        </div>
        <p className="mt-1 text-xs text-slate-400">Egyenleged: {formatCredits(wallet.balance)} · minimum {formatCredits(MIN_ALLOCATION)}</p>
      </div>

      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
        A fenti diagram a stratégiát futtatja le a választott eszköz és kockázati szint mellett, a {assetDef.name}{' '}
        valós, élő árfolyamán, azóta, hogy ez a böngésző csatlakozott az adatfolyamhoz — nem hosszú távú, valós
        kereskedési eredmény, és nem garantálja, hogy a robot a jövőben (akár csak a befektetett összeg erejéig)
        nyereséges lesz. Kereskedési díj minden ügyletnél levonásra kerül. A beállítást a vásárlás után is csak
        eladással (és új robot vásárlásával) tudod megváltoztatni.
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">{error}</div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{Number.isFinite(capital) ? formatCredits(capital) : '—'}</div>
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Mégse
          </button>
          <button
            onClick={handleBuy}
            disabled={!capitalValid}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Megvétel játékpénzért
          </button>
        </div>
      </div>
    </Modal>
  );
}
