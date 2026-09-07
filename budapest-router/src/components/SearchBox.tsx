import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { GeocodeError, searchPlaces } from '../lib/geocode';
import type { Place } from '../types';

interface SearchBoxProps {
  label: string;
  placeholder: string;
  value: Place | null;
  onSelect: (place: Place) => void;
}

const DEBOUNCE_MS = 300;

export default function SearchBox({ label, placeholder, value, onSelect }: SearchBoxProps) {
  const [query, setQuery] = useState(value?.label ?? '');
  const [results, setResults] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value?.label ?? '');
  }, [value]);

  const runSearch = (text: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    searchPlaces(text, controller.signal)
      .then((places) => {
        setResults(places);
        setOpen(true);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof GeocodeError ? err.message : 'Ismeretlen hiba a keresés közben.');
        setResults([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value && query === value.label) {
      setResults([]);
      return;
    }
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(query), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const selectPlace = (place: Place) => {
    onSelect(place);
    setQuery(place.label);
    setOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    if (results.length > 0) {
      selectPlace(results[0]);
    } else if (query.trim().length >= 2) {
      runSearch(query);
    }
  };

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <div className="flex gap-1.5">
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="button"
          aria-label="Keresés"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => query.trim().length >= 2 && runSearch(query)}
          className="shrink-0 rounded-lg border border-slate-300 px-3 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          🔍
        </button>
      </div>
      {loading && <p className="mt-1 text-xs text-slate-400">keresés…</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {!loading && !error && open && results.length === 0 && query.trim().length >= 2 && (
        <p className="mt-1 text-xs text-slate-400">Nincs találat.</p>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.map((place, i) => (
            <li key={`${place.position.lat}-${place.position.lng}-${i}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectPlace(place)}
                className="block w-full px-3 py-2 text-left text-slate-700 hover:bg-indigo-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
