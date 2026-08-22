import { useState } from 'react';
import DemoBanner from './components/DemoBanner';
import Header, { type Tab } from './components/Header';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import Leaderboard from './components/Leaderboard';
import DataSourceInfo from './components/DataSourceInfo';
import { useGame } from './lib/useGame';

export default function App() {
  const { market, watches, refreshQuotes, addWatch, removeWatch } = useGame();
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DemoBanner />
      <Header connectionStatus={market.connectionStatus} activeTab={tab} onTabChange={setTab} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && <Dashboard market={market} watches={watches} onRefresh={refreshQuotes} onNavigate={setTab} />}
        {tab === 'watchlist' && <Watchlist market={market} watches={watches} onAdd={addWatch} onRemove={removeWatch} />}
        {tab === 'leaderboard' && <Leaderboard market={market} onAdd={addWatch} />}
        {tab === 'settings' && (
          <DataSourceInfo connectionStatus={market.connectionStatus} connectionError={market.connectionError} onRefresh={refreshQuotes} />
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        RoboTrade — személyes, tájékoztató jelzőeszköz valós, élő kriptoárfolyamon. Nem kezel pénzt, nem
        kereskedik, és nem minősül befektetési tanácsadásnak.
      </footer>
    </div>
  );
}
