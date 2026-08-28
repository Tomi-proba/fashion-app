import { useCallback, useEffect, useState } from 'react';
import { autoAdvanceBotPicks, createInitialDraft, draftPlayer } from './draft';
import { clearJSON, loadJSON, saveJSON, STORAGE_KEYS } from './storage';
import type { DraftState } from '../types';

function loadOrCreate(): DraftState {
  return loadJSON<DraftState>(STORAGE_KEYS.draft) ?? createInitialDraft();
}

export function useDraft() {
  const [state, setState] = useState<DraftState>(loadOrCreate);

  useEffect(() => saveJSON(STORAGE_KEYS.draft, state), [state]);

  const pick = useCallback((playerId: string) => {
    setState((s) => autoAdvanceBotPicks(draftPlayer(s, playerId)));
  }, []);

  const reset = useCallback(() => {
    clearJSON(STORAGE_KEYS.draft);
    setState(createInitialDraft());
  }, []);

  return { state, pick, reset };
}
