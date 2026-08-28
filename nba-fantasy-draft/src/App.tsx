import Header from './components/Header';
import DraftScreen from './components/DraftScreen';
import ResultsScreen from './components/ResultsScreen';
import { useDraft } from './lib/useDraft';

export default function App() {
  const { state, pick, reset } = useDraft();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header onReset={reset} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {state.finished ? <ResultsScreen state={state} /> : <DraftScreen state={state} onPick={pick} />}
      </main>
      <footer className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-400">
        Fantasy NBA Draft — kizárólag szórakoztató célú demó, nem valós szezon-adatokkal.
      </footer>
    </div>
  );
}
