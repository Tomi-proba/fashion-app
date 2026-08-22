import { useState } from 'react';
import { ROBOTS } from '../data/robots';
import { ASSETS } from '../lib/market';
import { formatPct } from '../lib/format';
import { backtestCombo } from '../lib/robotBacktest';
import RobotConfigModal from './RobotConfigModal';
import type { AssetSymbol, MarketState, RiskLevel, WalletState } from '../types';
import type { BuyResult } from '../lib/useGame';

interface LeaderboardProps {
  market: MarketState;
  wallet: WalletState;
  onBuy: (robotId: string, assetSymbol: AssetSymbol, riskLevel: RiskLevel, capital: number) => Promise<BuyResult>;
}

export default function Leaderboard({ market, wallet, onBuy }: LeaderboardProps) {
  const [configRobotId, setConfigRobotId] = useState<string | null>(null);
  const [configAsset, setConfigAsset] = useState<AssetSymbol | undefined>(undefined);

  const rows = ROBOTS.flatMap((robot) =>
    ASSETS.map((asset) => ({ robot, asset, ...backtestCombo(robot.strategyId, asset.symbol, 'közepes', market) })),
  ).sort((a, b) => b.stats.roiPct - a.stats.roiPct);

  const handleBuy = async (assetSymbol: AssetSymbol, riskLevel: RiskLevel, capital: number): Promise<BuyResult> => {
    if (!configRobotId) return { ok: false, message: 'Ismeretlen robot.' };
    const result = await onBuy(configRobotId, assetSymbol, riskLevel, capital);
    if (result.ok) setConfigRobotId(null);
    return result;
  };

  const configRobot = configRobotId ? ROBOTS.find((r) => r.id === configRobotId) : undefined;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Ranglista</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Az egyes stratégia + eszköz kombinációk mai, valós árfolyamon mért hozama, közepes kockázati szinten
        (a beállítás gombbal a kockázatot és a tőkét is megválaszthatod). Ez nem valós más felhasználók
        eredménye, és nem garancia a jövőre nézve — csak azt mutatja, mi teljesített ma a legjobban.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Robot</th>
              <th className="px-4 py-2">Eszköz</th>
              <th className="px-4 py-2">Hozam</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ robot, asset, stats, equity }, i) => (
              <tr key={`${robot.id}-${asset.symbol}`} className="border-t border-slate-100 dark:border-slate-800">
                <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{robot.name}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{asset.name}</td>
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
                    Beállítás és vásárlás
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {configRobot && (
        <RobotConfigModal
          robot={configRobot}
          market={market}
          wallet={wallet}
          initialAsset={configAsset}
          onBuy={handleBuy}
          onClose={() => setConfigRobotId(null)}
        />
      )}
    </div>
  );
}
