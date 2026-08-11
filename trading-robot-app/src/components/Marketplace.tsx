import { useState } from 'react';
import { ROBOTS, getRobot } from '../data/robots';
import RobotCard from './RobotCard';
import RobotDetailModal from './RobotDetailModal';
import type { MarketState, OwnedRobot, WalletState } from '../types';
import type { BuyResult } from '../lib/useGame';

interface MarketplaceProps {
  market: MarketState;
  wallet: WalletState;
  owned: OwnedRobot[];
  onBuy: (robotId: string) => BuyResult;
}

export default function Marketplace({ market, wallet, owned, onBuy }: MarketplaceProps) {
  const [detailRobotId, setDetailRobotId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleBuy = (robotId: string) => {
    const result = onBuy(robotId);
    if (!result.ok) {
      setNotice(result.message ?? 'A vásárlás nem sikerült.');
      setTimeout(() => setNotice(null), 3000);
    } else {
      setDetailRobotId(null);
    }
  };

  const detailRobot = detailRobotId ? getRobot(detailRobotId) : undefined;

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Piactér</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Válassz kereskedő robotot. Mindegyik más stratégiával és más szimulált eszközön fut — a kockázati szint
        és a szimulált visszateszt segít eligazodni, de garantált hozamot egyik sem ígér.
      </p>

      {notice && (
        <div className="mb-4 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROBOTS.map((robot) => (
          <RobotCard
            key={robot.id}
            robot={robot}
            market={market}
            ownedCount={owned.filter((o) => o.robotId === robot.id).length}
            canAfford={wallet.balance >= robot.price}
            onBuy={() => handleBuy(robot.id)}
            onOpenDetail={() => setDetailRobotId(robot.id)}
          />
        ))}
      </div>

      {detailRobot && (
        <RobotDetailModal
          robot={detailRobot}
          market={market}
          canAfford={wallet.balance >= detailRobot.price}
          onBuy={() => handleBuy(detailRobot.id)}
          onClose={() => setDetailRobotId(null)}
        />
      )}
    </div>
  );
}
