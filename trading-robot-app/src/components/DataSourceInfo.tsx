import { ASSETS } from '../lib/market';
import ConnectionStatus from './ConnectionStatus';
import type { ConnectionStatus as Status } from '../types';

interface DataSourceInfoProps {
  connectionStatus: Status;
  connectionError: string | null;
  onRefresh: () => void;
}

export default function DataSourceInfo({ connectionStatus, connectionError, onRefresh }: DataSourceInfoProps) {
  return (
    <div className="max-w-lg">
      <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">Adatforrás</h1>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Az árfolyamadat a Binance nyilvános, kulcs és regisztráció nélküli piaci adatfolyamából jön — ugyanaz a
        forrás, amit a saját weboldaluk is használ. Az app csak árfolyamot olvas, semmilyen fiókot vagy
        kereskedési jogosultságot nem használ.
      </p>

      <div className="mb-4 flex items-center gap-3">
        <ConnectionStatus status={connectionStatus} />
        <button onClick={onRefresh} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
          Árfolyam frissítése most
        </button>
      </div>

      {connectionError && (
        <div className="mb-4 rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
          {connectionError}
        </div>
      )}

      <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Figyelt eszközök</h2>
      <ul className="mb-4 space-y-1 text-sm text-slate-600 dark:text-slate-300">
        {ASSETS.map((a) => (
          <li key={a.symbol}>
            {a.name} <span className="text-slate-400">({a.symbol})</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-400">
        A kriptopiac 0–24 órában, a hét minden napján kereskedik, úgyhogy itt nincs "piac zárva" holtidő —
        viszont ez azt is jelenti, hogy az árfolyam éjjel-nappal, hétvégén is erősen tud mozogni. A kriptovaluták
        jellemzően lényegesen volatilisebbek, mint a hagyományos részvények: a robotok teljesítménye a valós
        piaci kockázatot tükrözi, garantált hozam nélkül.
      </p>
    </div>
  );
}
