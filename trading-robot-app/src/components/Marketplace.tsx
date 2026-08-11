import { useState } from 'react';
import { ROBOTS, getRobot } from '../data/robots';
import RobotCard from './RobotCard';
import RobotConfigModal from './RobotConfigModal';
import type { AssetSymbol, MarketState, OwnedRobot, RiskLevel, WalletState } from '../types';
import type { BuyResult } from '../lib/useGame';

interface MarketplaceProps {
  market: MarketState;
  wallet: WalletState;
  owned: OwnedRobot[];
  onBuy: (robotId: string, assetSymbol: AssetSymbol, riskLevel: RiskLevel, capital: number) => BuyResult;
}

export default function Marketplace({ market, wallet, owned, onBuy }: MarketplaceProps) {
  const [configRobotId, setConfigRobotId] = useState<string | null>(null);

  const handleBuy = (assetSymbol: AssetSymbol, riskLevel: RiskLevel, capital: number): BuyResult => {
    if (!configRobotId) return { ok: false, message: 'Ismeretlen robot.' };
    const result = onBuy(configRobotId, assetSymbol, riskLevel, capital);
    if (result.ok) setConfigRobotId(null);
    return result;
  };

  const configRobot = configRobotId ? getRobot(configRobotId) : undefined;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Piactér</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Válassz kereskedő robot-stratégiát, majd egy lépésben állítsd be, melyik valós, élő árfolyamú eszközön,
        milyen kockázati szinten és mennyi tőkével fusson. A vásárlás egyszeri — a beállítást utána már nem kell
        (és nem is lehet) újra megvenni.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROBOTS.map((robot) => (
          <RobotCard
            key={robot.id}
            robot={robot}
            ownedCount={owned.filter((o) => o.robotId === robot.id).length}
            onConfigure={() => setConfigRobotId(robot.id)}
          />
        ))}
      </div>

      {configRobot && (
        <RobotConfigModal
          robot={configRobot}
          market={market}
          wallet={wallet}
          onBuy={handleBuy}
          onClose={() => setConfigRobotId(null)}
        />
      )}
    </div>
  );
}
