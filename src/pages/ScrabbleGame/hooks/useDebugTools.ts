import { useEffect } from "react";
import { GameState, StateUpdate } from "../gameState";
import { hasAnyLegalMove } from "../moveFinder";
import { drawTiles, RACK_SIZE, shuffle } from "../tileBag";
import { Rack, Tries } from "../types";
import { loadDictionary } from "../wordList";

export interface DebugTools {
  closeDebugPanel: () => void;
  debugReshuffleRack: (player: 1 | 2) => void;
  debugResetHints: () => void;
  debugToggleRevealBotRack: () => void;
  debugToggleAllowMoveLocked: () => void;
  debugSetRack: (player: 1 | 2, lettersString: string) => void;
  debugForceStalemateCheck: () => Promise<void>;
}

export function useDebugTools(state: GameState, patchState: (updates: StateUpdate) => void): DebugTools {
  const { board, p1inv, p2inv, bag, firstTurn } = state;

  // Ctrl+Shift+D toggles the hidden debug panel; no visible affordance for it
  // otherwise, by design
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        patchState((prev) => ({ debugMode: !prev.debugMode }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // closes the debug panel; the panel itself is only ever opened via Ctrl+Shift+D
  const closeDebugPanel = () => {
    patchState({ debugMode: false });
  };

  // DEBUG: returns the given player's rack tiles to the bag, shuffles, and
  // draws a fresh rack for them from the bag — same trade mechanics as
  // tradeLetters/botTradeLetters, but doesn't cost a turn or touch history,
  // and works for either player regardless of whose turn it currently is
  const debugReshuffleRack = (player: 1 | 2) => {
    const invKey: "p1inv" | "p2inv" = player === 1 ? "p1inv" : "p2inv";
    const rack = player === 1 ? p1inv : p2inv;
    const keptLetters: Rack = rack.filter((l): boolean => l == null);
    const returnedLetters = rack.filter((l) => l != null) as string[];
    if (returnedLetters.length === 0) return;
    const refreshedBag = shuffle(bag.concat(returnedLetters));
    const { drawn, remainingBag } = drawTiles(refreshedBag, returnedLetters.length);
    patchState({ [invKey]: keptLetters.concat(drawn), bag: remainingBag });
  };

  // DEBUG: clears both players' used-hint counters back to 0
  const debugResetHints = () => {
    patchState({ p1hintsUsed: 0, p2hintsUsed: 0 });
  };

  const debugToggleRevealBotRack = () => {
    patchState((prev) => ({ debugRevealBotRack: !prev.debugRevealBotRack }));
  };

  const debugToggleAllowMoveLocked = () => {
    patchState((prev) => ({ debugAllowMoveLocked: !prev.debugAllowMoveLocked }));
  };

  // DEBUG: overwrites a player's rack with arbitrary letters, ignoring the
  // bag entirely — lets you reproduce a specific board/rack state directly
  const debugSetRack = (player: 1 | 2, lettersString: string) => {
    const letters = lettersString
      .toLowerCase()
      .replace(/[^a-z]/g, "")
      .split("")
      .slice(0, RACK_SIZE);
    const invKey: "p1inv" | "p2inv" = player === 1 ? "p1inv" : "p2inv";
    patchState({ [invKey]: letters });
  };

  // DEBUG: runs the "does anyone have a legal move" check on demand instead
  // of only when the bag empties, reporting the result via the validation
  // banner regardless of outcome (unlike the production stalemate check,
  // which stays silent unless it actually triggers gameOverOffer)
  const debugForceStalemateCheck = async () => {
    let tries: Tries;
    try {
      tries = await loadDictionary();
    } catch (e) {
      patchState({ validationError: "Debug: couldn't load the dictionary to check." });
      return;
    }
    const p1Can = hasAnyLegalMove(board, p1inv.filter(Boolean) as string[], tries, firstTurn);
    const p2Can = hasAnyLegalMove(board, p2inv.filter(Boolean) as string[], tries, firstTurn);
    if (!p1Can && !p2Can) {
      patchState({ gameOverOffer: true, validationError: null });
    } else {
      patchState({
        validationError: `Debug: P1 ${p1Can ? "can" : "can't"} move, P2 ${p2Can ? "can" : "can't"} move.`,
      });
    }
  };

  return {
    closeDebugPanel,
    debugReshuffleRack,
    debugResetHints,
    debugToggleRevealBotRack,
    debugToggleAllowMoveLocked,
    debugSetRack,
    debugForceStalemateCheck,
  };
}
