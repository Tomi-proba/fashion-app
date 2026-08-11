import { ASSETS } from '../lib/market';
import { formatCredits, formatPct } from '../lib/format';
import { getOwnedStats } from '../lib/ownedRobots';
import SparklineChart from './SparklineChart';
import type { MarketState, OwnedRobot, WalletState } from '../types';
import type { Tab } from './Header';

interface DashboardProps {
  market: MarketState;
  wallet: WalletState;
  owned: OwnedRobot[];
  onFastForward: (days: number) => void;
  onNavigate: (tab: Tab) => void;
}

export default function Dashboard({ market, wallet, owned, onFastForward, onNavigate }: DashboardProps) {
  const active = owned.filter((o) => !o.sold);
  const robotsValue = active.reduce((sum, o) => sum + getOwnedStats(o, market).currentValue, 0);
  const costBasisSum = active.reduce((sum, o) => sum + o.costBasis, 0);
  const totalValue = wallet.balance + robotsValue;
  const overallRoiPct = costBasisSum > 0 ? ((robotsValue - costBasisSum) / costBasisSum) * 100 : 0;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Áttekintés</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{market.t}. szimulált kereskedési nap</p>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Teljes vagyon (játékpénz)</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatCredits(totalValue)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Készpénz egyenleg</div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{formatCredits(wallet.balance)}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Robotokban ({active.length} db), hozam</div>
          <div className={`text-2xl font-semibold ${overallRoiPct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {formatCredits(robotsValue)} <span className="text-base">({formatPct(overallRoiPct)})</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button onClick={() => onNavigate('marketplace')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          Robot vásárlása
        </button>
        <span className="mx-1 text-xs text-slate-400">Idő gyorsítása (csak demóban):</span>
        <button onClick={() => onFastForward(7)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          +7 nap
        </button>
        <button onClick={() => onFastForward(30)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          +30 nap
        </button>
      </div>

      <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Szimulált piaci eszközök</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ASSETS.map((asset) => {
          const history = market.histories[asset.symbol];
          const last = history[history.length - 1];
          const first = history[0];
          const changePct = ((last - first) / first) * 100;
          return (
            <div key={asset.symbol} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500 dark:text-slate-400">{asset.name}</div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{last.toFixed(2)}</span>
                <span className={changePct >= 0 ? 'text-xs font-medium text-emerald-600' : 'text-xs font-medium text-rose-500'}>
                  {formatPct(changePct)}
                </span>
              </div>
              <SparklineChart values={history.slice(-90)} width={200} height={44} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
