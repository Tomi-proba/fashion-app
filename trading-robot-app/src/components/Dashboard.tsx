import { ASSETS } from '../lib/market';
import { formatCredits, formatPct } from '../lib/format';
import { getOwnedStats } from '../lib/ownedRobots';
import SparklineChart from './SparklineChart';
import type { MarketState, OwnedRobot, PlatformState, WalletState } from '../types';
import type { Tab } from './Header';

interface DashboardProps {
  market: MarketState;
  wallet: WalletState;
  owned: OwnedRobot[];
  platform: PlatformState;
  onRefresh: () => void;
  onNavigate: (tab: Tab) => void;
}

function timeAgo(ms: number | null): string {
  if (ms === null) return 'még nincs adat';
  const diffSec = Math.round((Date.now() - ms) / 1000);
  if (diffSec < 5) return 'most';
  if (diffSec < 60) return `${diffSec} másodperce`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} perce`;
  const diffH = Math.round(diffMin / 60);
  return `${diffH} órája`;
}

export default function Dashboard({ market, wallet, owned, platform, onRefresh, onNavigate }: DashboardProps) {
  const active = owned.filter((o) => !o.sold);
  const robotsValue = active.reduce((sum, o) => sum + getOwnedStats(o, market).currentValue, 0);
  const costBasisSum = active.reduce((sum, o) => sum + o.costBasis, 0);
  const totalValue = wallet.balance + robotsValue;
  const overallRoiPct = costBasisSum > 0 ? ((robotsValue - costBasisSum) / costBasisSum) * 100 : 0;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Áttekintés</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Az árfolyamok valósak (Binance élő adatfolyam, 0–24), a kereskedés és a pénz szimulált.
      </p>

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

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
        <div className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">Üzemeltetői nézet (demó)</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-amber-900 dark:text-amber-200">{formatCredits(platform.totalRevenue)}</span>
          <span className="text-xs text-amber-700 dark:text-amber-400">összesített bevétel a robot-vásárlási díjakból</span>
        </div>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
          Ez az az összeg, ami egy valós termékben az üzemeltetőhöz kerülne minden robot megvásárlásakor — itt
          még játékpénzben, csak szemléltetésül.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button onClick={() => onNavigate('marketplace')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          Robot vásárlása
        </button>
        <button onClick={onRefresh} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          Árfolyam frissítése most
        </button>
      </div>

      <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Figyelt kriptovaluták (valós, élő árfolyam)</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ASSETS.map((asset) => {
          const history = market.histories[asset.symbol];
          const last = history[history.length - 1];
          const first = history[0];
          const changePct = first ? ((last - first) / first) * 100 : 0;
          const lastTradeAt = market.lastTradeAt[asset.symbol];
          return (
            <div key={asset.symbol} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="text-xs text-slate-500 dark:text-slate-400">{asset.name} · {asset.symbol}</div>
              {last === undefined ? (
                <div className="py-4 text-sm text-slate-400">várakozás az első adatra…</div>
              ) : (
                <>
                  <div className="mb-2 flex items-baseline justify-between">
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{last.toFixed(2)}</span>
                    <span className={changePct >= 0 ? 'text-xs font-medium text-emerald-600' : 'text-xs font-medium text-rose-500'}>
                      {formatPct(changePct)}
                    </span>
                  </div>
                  <SparklineChart values={history.slice(-90)} width={200} height={44} />
                  <div className="mt-1 text-xs text-slate-400">utolsó kereskedés: {timeAgo(lastTradeAt)}</div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
