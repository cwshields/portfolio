import { applyCellsToBoardAndRack, HINT_LIMIT, StateUpdate } from "../gameState";
import { findRankedMoves } from "../moveFinder";
import { shuffle } from "../tileBag";
import { countPendingCells } from "../wordFinder";
import { loadDictionary } from "../wordList";

// hints are drawn from this many of the best-scoring candidates rather than
// always handing back the single highest-scoring move, so a hint is a solid
// option rather than a giveaway of the optimal play
const HINT_CANDIDATE_POOL_SIZE = 15;

export function useHints(
  state: GameState,
  patchState: (updates: StateUpdate) => void,
  persist: (updates: Partial<GameState>) => void,
): Hints {
  const {
    board,
    p1turn,
    p1inv,
    p2inv,
    validating,
    findingHint,
    gameOver,
    p1hintsUsed,
    p2hintsUsed,
    firstTurn,
  } = state;

  // drops the given new tiles onto the board as pending letters and pulls
  // them out of the current player's rack, exactly as if the player had
  // dragged them there by hand; still requires Submit to lock the move in
  const applyHintMove = (move: RankedMove) => {
    const invKey: "p1inv" | "p2inv" = p1turn ? "p1inv" : "p2inv";
    const { board: newBoard, rack } = applyCellsToBoardAndRack(
      board,
      p1turn ? p1inv : p2inv,
      move.newCells,
    );
    patchState({
      board: newBoard,
      [invKey]: rack,
      validationError: null,
      selectedIndices: [],
    });
  };

  // finds and places one of the current player's better available moves (not
  // necessarily the best) at random; the player still has to hit Submit to
  // actually play it. Costs the player one of their limited hints.
  const giveHint = async () => {
    if (validating || findingHint || gameOver || countPendingCells(board) > 0)
      return;
    const hintsUsed = p1turn ? p1hintsUsed : p2hintsUsed;
    if (hintsUsed >= HINT_LIMIT) {
      patchState({
        validationError: `Player ${p1turn ? 1 : 2} has no hints left.`,
      });
      return;
    }
    patchState({ findingHint: true, validationError: null });
    let tries: Tries;
    try {
      tries = await loadDictionary();
    } catch (e) {
      patchState({
        findingHint: false,
        validationError:
          "Couldn't load the dictionary for hints — check your connection.",
      });
      return;
    }
    const rack = (p1turn ? p1inv : p2inv).filter((l): l is string => l != null);
    const candidates = findRankedMoves(board, rack, tries, firstTurn);
    const pool = shuffle(candidates.slice(0, HINT_CANDIDATE_POOL_SIZE));
    const move = pool[0] || null;
    if (!move) {
      patchState({
        findingHint: false,
        validationError: "No possible word found with your current letters.",
      });
      return;
    }
    applyHintMove(move);
    const hintKey: "p1hintsUsed" | "p2hintsUsed" = p1turn ? "p1hintsUsed" : "p2hintsUsed";
    patchState({ findingHint: false, [hintKey]: hintsUsed + 1 });
    persist({ [hintKey]: hintsUsed + 1 });
  };

  return { giveHint };
}
