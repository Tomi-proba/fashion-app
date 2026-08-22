import { useState } from 'react';
import { ROBOTS, getRobot } from '../data/robots';
import AddWatchModal from './AddWatchModal';
import RobotCard from './RobotCard';
import WatchCard from './WatchCard';
import type { AssetSymbol, MarketState, RiskLevel, Watch } from '../types';

interface WatchlistProps {
  market: MarketState;
  watches: Watch[];
  onAdd: (robotId: string, assetSymbol: AssetSymbol, riskLevel: RiskLevel) => void;
  onRemove: (id: string) => void;
}

export default function Watchlist({ market, watches, onAdd, onRemove }: WatchlistProps) {
  const [configRobotId, setConfigRobotId] = useState<string | null>(null);
  const configRobot = configRobotId ? getRobot(configRobotId) : undefined;

  const handleAdd = (assetSymbol: AssetSymbol, riskLevel: RiskLevel) => {
    if (!configRobotId) return;
    onAdd(configRobotId, assetSymbol, riskLevel);
    setConfigRobotId(null);
  };

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Figyelőlista</h1>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        A figyelők csak megmutatják, mit javasolna most egy stratégia — nem vásárolnak vagy adnak el semmit
        helyetted.
      </p>

      {watches.length > 0 ? (
        <div className="mb-8 flex flex-col gap-3">
          {watches.map((w) => (
            <WatchCard key={w.id} watch={w} market={market} onRemove={onRemove} />
          ))}
        </div>
      ) : (
        <p className="mb-8 text-sm text-slate-400">Még nincs egy figyelőd sem — állíts be egyet alább.</p>
      )}

      <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Új figyelő hozzáadása</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROBOTS.map((robot) => (
          <RobotCard
            key={robot.id}
            robot={robot}
            watchCount={watches.filter((w) => w.robotId === robot.id).length}
            onConfigure={() => setConfigRobotId(robot.id)}
          />
        ))}
      </div>

      {configRobot && <AddWatchModal robot={configRobot} market={market} onAdd={handleAdd} onClose={() => setConfigRobotId(null)} />}
    </div>
  );
}
