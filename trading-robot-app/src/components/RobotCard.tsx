import { STRATEGIES } from '../lib/strategies';
import type { RobotDef } from '../types';

interface RobotCardProps {
  robot: RobotDef;
  watchCount: number;
  onConfigure: () => void;
}

export default function RobotCard({ robot, watchCount, onConfigure }: RobotCardProps) {
  const strategy = STRATEGIES[robot.strategyId];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{robot.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{strategy.name}</p>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">{robot.description}</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        {watchCount > 0 ? <span className="text-xs text-slate-400">{watchCount} figyelő állítva</span> : <span />}
      </div>

      <button
        onClick={onConfigure}
        className="w-full rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
      >
        Figyelés beállítása
      </button>
    </div>
  );
}
