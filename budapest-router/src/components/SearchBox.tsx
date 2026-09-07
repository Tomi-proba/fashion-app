import { useEffect, useRef, useState } from 'react';
import { GeocodeError, searchPlaces } from '../lib/geocode';
import type { Place } from '../types';

interface SearchBoxProps {
  label: string;
  placeholder: string;
  value: Place | null;
  onSelect: (place: Place) => void;
}

const DEBOUNCE_MS = 400;

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
    debounceRef.current = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      setError(null);
      searchPlaces(query, controller.signal)
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
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="relative">
      <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
      {loading && <p className="mt-1 text-xs text-slate-400">keresés…</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white text-sm shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {results.map((place, i) => (
            <li key={`${place.position.lat}-${place.position.lng}-${i}`}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onSelect(place);
                  setQuery(place.label);
                  setOpen(false);
                  setResults([]);
                }}
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
