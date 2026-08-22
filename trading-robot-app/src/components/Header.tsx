import ConnectionStatus from './ConnectionStatus';
import type { ConnectionStatus as Status } from '../types';

export type Tab = 'dashboard' | 'watchlist' | 'leaderboard' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Áttekintés' },
  { id: 'watchlist', label: 'Figyelőlista' },
  { id: 'leaderboard', label: 'Ranglista' },
  { id: 'settings', label: 'Adatforrás' },
];

interface HeaderProps {
  connectionStatus: Status;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Header({ connectionStatus, activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <span className="text-xl">🤖</span> RoboTrade <span className="text-xs font-normal text-slate-400">személyes tanácsadó</span>
        </div>

        <nav className="ml-2 flex flex-1 gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <ConnectionStatus status={connectionStatus} />
      </div>
    </header>
  );
}
