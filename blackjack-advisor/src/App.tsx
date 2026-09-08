import { useState } from 'react';
import CardPicker from './components/CardPicker';
import HandChips from './components/HandChips';
import RulesPanel from './components/RulesPanel';
import ResultPanel from './components/ResultPanel';
import { handValue, isBlackjack, isBust } from './lib/deck';
import { evaluateActions } from './lib/simulate';
import type { ActionResult, Rank, Rules } from './types';

const DEFAULT_RULES: Rules = {
  numDecks: 6,
  dealerHitsSoft17: true,
  doubleAnyTwo: true,
  surrenderAllowed: false,
};

const TRIALS_PER_ACTION = 15000;

export default function App() {
  const [playerCards, setPlayerCards] = useState<Rank[]>([]);
  const [dealerUp, setDealerUp] = useState<Rank | null>(null);
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  const [results, setResults] = useState<ActionResult[] | null>(null);
  const [computing, setComputing] = useState(false);

  const value = handValue(playerCards);
  const bust = playerCards.length > 0 && isBust(playerCards);
  const blackjack = isBlackjack(playerCards);
  const canEvaluate = playerCards.length >= 2 && dealerUp !== null && !bust && !blackjack;

  const handleAddPlayerCard = (r: Rank) => {
    setPlayerCards((prev) => [...prev, r]);
    setResults(null);
  };
  const handleRemovePlayerCard = (i: number) => {
    setPlayerCards((prev) => prev.filter((_, idx) => idx !== i));
    setResults(null);
  };
  const handleSetDealer = (r: Rank) => {
    setDealerUp(r);
    setResults(null);
  };
  const handleReset = () => {
    setPlayerCards([]);
    setDealerUp(null);
    setResults(null);
  };

  const handleEvaluate = () => {
    if (!canEvaluate || dealerUp === null) return;
    setComputing(true);
    // A böngésző egy tick késleltetéssel fut le, hogy a "számol…" állapot
    // ténylegesen látszódjon, mielőtt a (rövid, de érzékelhető) szimuláció
    // lefutna a fő száson.
    setTimeout(() => {
      const r = evaluateActions({ playerCards, dealerUp, rules });
      setResults(r);
      setComputing(false);
    }, 30);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
            <span className="text-xl">🃏</span> Blackjack Tanácsadó
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Add meg a kezedet és az osztó felfedett lapját — a program valós időben lefuttat{' '}
            {TRIALS_PER_ACTION.toLocaleString('hu-HU')} szimulált kört minden lehetséges lépésre, és megmondja,
            melyiknek a legjobb a várható értéke.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                A te kezed
              </div>
              <HandChips cards={playerCards} onRemove={handleRemovePlayerCard} emptyLabel="Adj hozzá lapokat lent" />
              {playerCards.length > 0 && (
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Összeg: <strong>{value.total}</strong>
                  {value.soft && !bust ? ' (lágy)' : ''}
                  {bust && <span className="text-red-500"> — túllépve (bust)</span>}
                  {blackjack && <span className="text-emerald-600"> — Blackjack!</span>}
                </p>
              )}
            </div>
            <CardPicker onPick={handleAddPlayerCard} />
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Osztó felfedett lapja
              </div>
              <HandChips cards={dealerUp ? [dealerUp] : []} onRemove={() => setDealerUp(null)} emptyLabel="Válassz lent" />
            </div>
            <CardPicker onPick={handleSetDealer} />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={!canEvaluate || computing}
            onClick={handleEvaluate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
          >
            {computing ? 'Számolás…' : 'Tanácsot kérek'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Törlés
          </button>
          <div className="w-full sm:w-auto">
            <RulesPanel rules={rules} onChange={setRules} />
          </div>
        </div>

        {blackjack && (
          <p className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200">
            Blackjack! Ha az osztónak nincs szintén Blackjackje, ez automatikusan nyer (jellemzően 3:2 kifizetéssel)
            — nincs mit dönteni.
          </p>
        )}
        {bust && (
          <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
            A kezed túllépte a 21-et — ezzel a kézzel már elvesztetted a kört.
          </p>
        )}

        {results && !computing && <ResultPanel results={results} trialsPerAction={TRIALS_PER_ACTION} />}
      </main>

      <footer className="mx-auto max-w-4xl px-4 py-6 text-xs text-slate-400">
        Ez egy valószínűség-számítási eszköz: minden lépés esetén valódi Monte Carlo-szimulációt futtat (véletlen,
        a beállított paklikból ténylegesen húzott lapokkal), nem egy statikus táblázatot néz ki. A "húzás" utáni
        további lapkéréseket egy egyszerűsített, óvatos szabály folytatja (nem teljesen optimális, mindent
        újraszámoló stratégia) — ezért nagyon szoros esetekben (pl. pár nyolcas tízes ellen) kis mértékben
        eltérhet a publikált optimális táblázatoktól. Nem valós pénzes játék, nem garantál nyereséget — a
        blackjack hosszú távon is negatív várható értékű szerencsejáték, ez az eszköz csak a relatíve legjobb
        döntést segít megtalálni adott kéznél.
      </footer>
    </div>
  );
}
