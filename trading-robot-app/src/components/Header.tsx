import { useState } from 'react';
import { formatCredits } from '../lib/format';
import { canClaimGrant, GRANT_AMOUNT, msUntilNextGrant } from '../lib/wallet';
import ConnectionStatus from './ConnectionStatus';
import type { ConnectionStatus as Status, WalletState } from '../types';

export type Tab = 'dashboard' | 'marketplace' | 'myRobots' | 'leaderboard' | 'settings';

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Áttekintés' },
  { id: 'marketplace', label: 'Piactér' },
  { id: 'myRobots', label: 'Robotjaim' },
  { id: 'leaderboard', label: 'Ranglista' },
  { id: 'settings', label: 'Adatforrás' },
];

interface HeaderProps {
  wallet: WalletState;
  connectionStatus: Status;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onGrant: () => void;
}

export default function Header({ wallet, connectionStatus, activeTab, onTabChange, onGrant }: HeaderProps) {
  const [showDepositInfo, setShowDepositInfo] = useState(false);
  const canGrant = canClaimGrant(wallet, Date.now());
  const cooldownMs = msUntilNextGrant(wallet, Date.now());
  const cooldownHours = Math.ceil(cooldownMs / (60 * 60 * 1000));

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <span className="text-xl">🤖</span> RoboTrade <span className="text-xs font-normal text-slate-400">demó</span>
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

        <div className="flex items-center gap-2">
          <ConnectionStatus status={connectionStatus} />
          <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
            {formatCredits(wallet.balance)}
          </div>
          <button
            onClick={onGrant}
            disabled={!canGrant}
            title={canGrant ? `+${GRANT_AMOUNT} játékkredit` : `Következő igénylés kb. ${cooldownHours} óra múlva`}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            + Játékpénz
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDepositInfo((v) => !v)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-400 dark:border-slate-700"
            >
              Valós befizetés
            </button>
            {showDepositInfo && (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Valós pénzes befizetés jelenleg nincs bekapcsolva ebben az alkalmazásban. Az összes egyenleg és
                kereskedés játékpénzzel, szimulációban zajlik — csak az árfolyamadat valós.
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
