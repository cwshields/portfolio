import { useEffect } from "react";
import { StateUpdate } from "../gameState";
import { loadFromLocalStorage } from "../persistence";
import { loadDictionary } from "../wordList";

// mount-time setup: resumes an autosaved game (or opens the new-game modal
// when there isn't one), and warms the dictionary trie in the background so
// the first hint/stalemate check doesn't have to wait on the fetch + build,
// and so live word-check borders can light up as soon as it's ready; fetch
// failures are swallowed here and simply retried the next time
// loadDictionary() is called
export function useGameLifecycle(patchState: (updates: StateUpdate) => void): void {
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      patchState(saved);
      return;
    }
    patchState({ showNewGameModal: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadDictionary()
      .then((tries) => patchState({ dictionaryTries: tries }))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
