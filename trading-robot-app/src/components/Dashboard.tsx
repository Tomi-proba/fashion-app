import { getRobot } from '../data/robots';
import { ASSETS } from '../lib/market';
import { formatPct } from '../lib/format';
import { computeSignal } from '../lib/signal';
import SignalBadge from './SignalBadge';
import SparklineChart from './SparklineChart';
import type { MarketState, Watch } from '../types';
import type { Tab } from './Header';

interface DashboardProps {
  market: MarketState;
  watches: Watch[];
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

export default function Dashboard({ market, watches, onRefresh, onNavigate }: DashboardProps) {
  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Áttekintés</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Az árfolyamok valósak (Binance élő adatfolyam, 0–24). Ez egy tisztán tájékoztató eszköz — nem kereskedik
        és nem kezel pénzt.
      </p>

      {watches.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Figyelőid jelenlegi jelzései</h2>
          <div className="flex flex-col gap-2">
            {watches.map((w) => {
              const robot = getRobot(w.robotId);
              if (!robot) return null;
              const assetDef = ASSETS.find((a) => a.symbol === w.assetSymbol);
              const signal = computeSignal(robot.strategyId, w.assetSymbol, w.riskLevel, market);
              return (
                <div key={w.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    {robot.name} <span className="text-slate-400">({assetDef?.name})</span>
                  </span>
                  <SignalBadge tone={signal.tone} label={signal.label} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button onClick={() => onNavigate('watchlist')} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          Figyelő beállítása
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
