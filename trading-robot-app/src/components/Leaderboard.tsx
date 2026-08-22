import { useState } from 'react';
import { ROBOTS } from '../data/robots';
import { ASSETS } from '../lib/market';
import { formatPct } from '../lib/format';
import { backtestCombo } from '../lib/robotBacktest';
import { computeSignal } from '../lib/signal';
import AddWatchModal from './AddWatchModal';
import SignalBadge from './SignalBadge';
import type { AssetSymbol, MarketState, RiskLevel } from '../types';

interface LeaderboardProps {
  market: MarketState;
  onAdd: (robotId: string, assetSymbol: AssetSymbol, riskLevel: RiskLevel) => void;
}

export default function Leaderboard({ market, onAdd }: LeaderboardProps) {
  const [configRobotId, setConfigRobotId] = useState<string | null>(null);
  const [configAsset, setConfigAsset] = useState<AssetSymbol | undefined>(undefined);

  const rows = ROBOTS.flatMap((robot) =>
    ASSETS.map((asset) => ({
      robot,
      asset,
      signal: computeSignal(robot.strategyId, asset.symbol, 'közepes', market),
      ...backtestCombo(robot.strategyId, asset.symbol, 'közepes', market),
    })),
  ).sort((a, b) => b.stats.roiPct - a.stats.roiPct);

  const handleAdd = (assetSymbol: AssetSymbol, riskLevel: RiskLevel) => {
    if (!configRobotId) return;
    onAdd(configRobotId, assetSymbol, riskLevel);
    setConfigRobotId(null);
  };

  const configRobot = configRobotId ? ROBOTS.find((r) => r.id === configRobotId) : undefined;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Ranglista</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Az egyes stratégia + eszköz kombinációk mai, valós árfolyamon mért hozama és jelenlegi jelzése, közepes
        kockázati szinten. Nem garancia a jövőre nézve — csak azt mutatja, mi teljesített ma a legjobban.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Robot</th>
              <th className="px-4 py-2">Eszköz</th>
              <th className="px-4 py-2">Jelzés</th>
              <th className="px-4 py-2">Mai hozam</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ robot, asset, signal, stats, equity }, i) => (
              <tr key={`${robot.id}-${asset.symbol}`} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{robot.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{asset.name}</td>
                <td className="px-4 py-3"><SignalBadge tone={signal.tone} label={signal.label} /></td>
                <td className={`px-4 py-3 font-semibold ${stats.roiPct >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {equity.length < 5 ? <span className="font-normal text-slate-400">adatgyűjtés…</span> : formatPct(stats.roiPct)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setConfigRobotId(robot.id);
                      setConfigAsset(asset.symbol);
                    }}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-500"
                  >
                    Figyelés hozzáadása
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {configRobot && (
        <AddWatchModal robot={configRobot} market={market} initialAsset={configAsset} onAdd={handleAdd} onClose={() => setConfigRobotId(null)} />
      )}
    </div>
  );
}
