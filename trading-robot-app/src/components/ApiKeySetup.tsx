import { useState } from 'react';
import ConnectionStatus from './ConnectionStatus';
import type { ConnectionStatus as Status } from '../types';

interface ApiKeySetupProps {
  apiKey: string | null;
  connectionStatus: Status;
  connectionError: string | null;
  onSave: (key: string) => void;
  onClear: () => void;
  variant?: 'onboarding' | 'settings';
}

export default function ApiKeySetup({ apiKey, connectionStatus, connectionError, onSave, onClear, variant = 'settings' }: ApiKeySetupProps) {
  const [input, setInput] = useState('');

  return (
    <div className={variant === 'onboarding' ? 'mx-auto max-w-lg py-10' : 'max-w-lg'}>
      {variant === 'onboarding' && (
        <>
          <h1 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Kapcsold be a valós árfolyamokat</h1>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
            Ehhez az alkalmazáshoz egy ingyenes Finnhub API-kulcs kell — ez adja a valós idejű részvényárfolyamokat,
            amiken a robotok játékpénzzel "kereskednek". A kulcs csak a te böngésződben, helyben tárolódik.
          </p>
        </>
      )}

      {variant === 'settings' && <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Finnhub API-kulcs</h2>}

      <ol className="mb-4 list-decimal space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
        <li>
          Regisztrálj ingyen a{' '}
          <a href="https://finnhub.io/register" target="_blank" rel="noreferrer" className="font-medium text-indigo-600 underline dark:text-indigo-400">
            finnhub.io
          </a>{' '}
          oldalon.
        </li>
        <li>Másold ki az API-kulcsodat a dashboardjukról.</li>
        <li>Illeszd be alább, és mentsd el.</li>
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Finnhub API-kulcs"
          className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          onClick={() => input.trim() && onSave(input.trim())}
          disabled={!input.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Mentés
        </button>
      </div>

      {apiKey && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Aktív kulcs: <span className="font-mono">{apiKey.slice(0, 4)}…{apiKey.slice(-4)}</span>
          </span>
          <ConnectionStatus status={connectionStatus} />
          <button onClick={onClear} className="text-sm text-rose-600 underline dark:text-rose-400">
            Kulcs törlése
          </button>
        </div>
      )}

      {connectionError && (
        <div className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {connectionError}
        </div>
      )}

      <p className="mt-4 text-xs text-slate-400">
        Ingyenes Finnhub kulccsal: 60 REST hívás/perc és élő WebSocket kereskedési adatfolyam max. 50
        szimbólumra — ez az app csak 4 szimbólumot figyel, bőven belefér. A részvények csak a tőzsde nyitvatartása
        alatt (New York-i idő szerint hétköznap kb. 15:30–22:00 CET) mutatnak friss kereskedést.
      </p>
    </div>
  );
}
