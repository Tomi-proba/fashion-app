import { useState } from 'react';
import DemoBanner from './components/DemoBanner';
import Header, { type Tab } from './components/Header';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import MyRobots from './components/MyRobots';
import Leaderboard from './components/Leaderboard';
import DataSourceInfo from './components/DataSourceInfo';
import { useGame } from './lib/useGame';

export default function App() {
  const { market, wallet, owned, refreshQuotes, grantPlayMoney, buyRobot, sellRobot } = useGame();
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DemoBanner />
      <Header wallet={wallet} connectionStatus={market.connectionStatus} activeTab={tab} onTabChange={setTab} onGrant={grantPlayMoney} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'dashboard' && (
          <Dashboard market={market} wallet={wallet} owned={owned} onRefresh={refreshQuotes} onNavigate={setTab} />
        )}
        {tab === 'marketplace' && <Marketplace market={market} wallet={wallet} owned={owned} onBuy={buyRobot} />}
        {tab === 'myRobots' && <MyRobots market={market} owned={owned} onSell={sellRobot} />}
        {tab === 'leaderboard' && <Leaderboard market={market} onBuy={buyRobot} />}
        {tab === 'settings' && (
          <DataSourceInfo connectionStatus={market.connectionStatus} connectionError={market.connectionError} onRefresh={refreshQuotes} />
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        RoboTrade demó — valós, élő kriptoárfolyamon, de szimulált robotokkal és játékpénzzel. Nem minősül
        befektetési tanácsadásnak.
      </footer>
    </div>
  );
}
