import { useMemo } from "react";
import { StateUpdate } from "../gameState";
import { hasAnyLegalMove } from "../moveFinder";
import { scoreMove, scoreWord } from "../scoring";
import { drawTiles, RACK_SIZE, shuffle } from "../tileBag";
import { isWord } from "../trie";
import {
  countPendingCells,
  extractWords,
  getPendingCells,
  validateConnected,
  validateContiguous,
  validateFirstMove,
  validateLineShape,
} from "../wordFinder";
import { loadDictionary } from "../wordList";
import { dedupeCells } from "../gameState";

// puts a returning letter back at its preferred rack slot, but only if that slot
// is still empty — a shuffle since the letter was placed may have moved a different
// letter into it, in which case we fall back to whatever slot is actually empty
// instead of clobbering the letter that's sitting there now
function returnLetterToSlot(inv: Rack, letter: string, preferredIndex: number | null) {
  if (preferredIndex != null && inv[preferredIndex] == null) {
    inv[preferredIndex] = letter;
    return;
  }
  const idx = inv.findIndex((l) => l == null);
  if (idx !== -1) inv[idx] = letter;
  else inv.push(letter);
}

export function useMoveActions(
  state: GameState,
  patchState: (updates: StateUpdate) => void,
  persist: (updates: Partial<GameState>) => void,
): MoveActions {
  const {
    p1turn,
    p1inv,
    p2inv,
    p1score,
    p2score,
    board,
    bag,
    firstTurn,
    dictionaryTries,
    moveHistory,
    validating,
    selectedIndices,
  } = state;

  // after a turn-ending action, checks whether the bag is empty and neither
  // player's rack can form any legal move; if so, offers to end the game.
  // takes the post-update state explicitly since patchState hasn't flushed yet
  const maybeCheckStalemate = async (nextState: GameState): Promise<void> => {
    if (nextState.bag.length > 0) return;
    let tries: Tries;
    try {
      tries = await loadDictionary();
    } catch (e) {
      return;
    }
    const p1Can = hasAnyLegalMove(
      nextState.board,
      nextState.p1inv.filter(Boolean) as string[],
      tries,
      nextState.firstTurn,
    );
    if (p1Can) return;
    const p2Can = hasAnyLegalMove(
      nextState.board,
      nextState.p2inv.filter(Boolean) as string[],
      tries,
      nextState.firstTurn,
    );
    if (p2Can) return;
    patchState({ gameOverOffer: true });
  };

  // updates the board with the letter placed/removed at (row, col), and keeps the
  // current player's rack in sync. Placing a letter leaves a gap (null) at its
  // rack slot rather than removing it, so the rest of the rack doesn't reflow;
  // clearing a cell returns the letter to the rack slot it came from (or the
  // nearest empty slot, if a shuffle has since filled the original one).
  const updateInv = (
    row: number,
    col: number,
    newVal: string,
    oldVal: string,
    newRackIndex: number | null,
    oldRackIndex: number | null,
  ) => {
    if (newVal === oldVal) return;
    const invKey: "p1inv" | "p2inv" = p1turn ? "p1inv" : "p2inv";
    const inv = (p1turn ? p1inv : p2inv).slice();

    if (newVal) inv[newRackIndex as number] = null;
    if (oldVal) returnLetterToSlot(inv, oldVal, oldRackIndex);

    const newBoard = board.map((r) =>
      r.map((cell) =>
        cell.row === row && cell.col === col
          ? {
              ...cell,
              letter: newVal || null,
              pending: !!newVal,
              rackIndex: newVal ? newRackIndex : null,
            }
          : cell,
      ),
    );

    const updates: Partial<GameState> = {
      board: newBoard,
      [invKey]: inv,
      validationError: null,
      selectedIndices: [],
    };
    patchState(updates);
  };

  // clears pending letters back to empty and returns them to the current player's rack,
  // each to the slot it originally came from; shared by rejectMove (a submitted move is
  // invalid) and clearPending (player manually resets their in-progress placement)
  const returnPendingToRack = (): Partial<GameState> => {
    const pendingCells = getPendingCells(board);
    const newBoard = board.map((r) =>
      r.map((cell) =>
        cell.pending
          ? { ...cell, letter: null, pending: false, rackIndex: null }
          : cell,
      ),
    );
    const invKey: "p1inv" | "p2inv" = p1turn ? "p1inv" : "p2inv";
    const inv = (p1turn ? p1inv : p2inv).slice();
    pendingCells.forEach((c) => {
      returnLetterToSlot(inv, c.letter as string, c.rackIndex);
    });
    return { board: newBoard, [invKey]: inv };
  };

  // used when a move is rejected for shape/connectivity/dictionary reasons
  const rejectMove = (errorMessage: string | null) => {
    patchState({
      ...returnPendingToRack(),
      validationError: errorMessage,
      validating: false,
    });
  };

  // lets the current player manually clear their in-progress placement
  // without submitting or ending their turn
  const clearPending = () => {
    if (countPendingCells(board) === 0) return;
    patchState({ ...returnPendingToRack(), validationError: null });
  };

  // shuffles the current player's rack order; cosmetic only, does not cost a turn
  const shuffleRackAction = () => {
    const invKey: "p1inv" | "p2inv" = p1turn ? "p1inv" : "p2inv";
    patchState({ [invKey]: shuffle(p1turn ? p1inv : p2inv) });
  };

  // locks the pending letters in place, adds the move's score to the current player's
  // total, advances the turn, and refills the current player's rack from the shared bag,
  // filling the gaps left by played letters so remaining tiles keep their positions
  const acceptMove = (moveScore: number, drawCount: number, formedWords: FormedWord[] = []) => {
    const newBoard = board.map((r) =>
      r.map((cell) =>
        cell.pending
          ? { ...cell, locked: true, pending: false, rackIndex: null }
          : cell,
      ),
    );
    const { drawn, remainingBag } = drawTiles(bag, drawCount);
    const invKey: "p1inv" | "p2inv" = p1turn ? "p1inv" : "p2inv";
    const inv = (p1turn ? p1inv : p2inv).slice();
    let drawIdx = 0;
    for (let i = 0; i < inv.length && drawIdx < drawn.length; i++) {
      if (inv[i] == null) inv[i] = drawn[drawIdx++];
    }
    while (drawIdx < drawn.length) inv.push(drawn[drawIdx++]);
    const scoreKey: "p1score" | "p2score" = p1turn ? "p1score" : "p2score";
    const historyEntry: MoveHistoryEntry = {
      player: p1turn ? 1 : 2,
      type: "play",
      words: formedWords.map((w) => ({ word: w.word, score: scoreWord(w) })),
      score: moveScore,
      cells: dedupeCells(formedWords.flatMap((w) => w.cells)),
    };

    const updates: Partial<GameState> = {
      board: newBoard,
      bag: remainingBag,
      [invKey]: inv,
      [scoreKey]: (p1turn ? p1score : p2score) + moveScore,
      p1turn: !p1turn,
      firstTurn: false,
      validating: false,
      validationError: null,
      selectedIndices: [],
      moveHistory: [...moveHistory, historyEntry],
    };
    patchState(updates);
    persist(updates);
    maybeCheckStalemate({ ...state, ...updates });
  };

  // toggles whether a rack letter (by index in the current player's rack) is
  // selected for a trade; only meaningful for the active player's own rack
  const toggleLetterSelect = (index: number) => {
    patchState((prev) => ({
      selectedIndices: prev.selectedIndices.includes(index)
        ? prev.selectedIndices.filter((i) => i !== index)
        : [...prev.selectedIndices, index],
    }));
  };

  const submit = async () => {
    if (validating) return;
    const pendingCells = getPendingCells(board);

    const line = validateLineShape(pendingCells);
    if (!line.valid) return rejectMove(line.error);

    const contig = validateContiguous(board, pendingCells, line.orientation);
    if (!contig.valid) return rejectMove(contig.error);

    if (firstTurn) {
      const fm = validateFirstMove(pendingCells);
      if (!fm.valid) return rejectMove(fm.error);
    } else {
      const conn = validateConnected(board, pendingCells);
      if (!conn.valid) return rejectMove(conn.error);
    }

    const wordsResult = extractWords(board, pendingCells, line.orientation);
    if (!wordsResult.valid) return rejectMove(wordsResult.error);
    const formedWords = wordsResult.words;

    patchState({ validating: true, validationError: null });
    let tries = dictionaryTries;
    if (!tries) {
      try {
        tries = await loadDictionary();
      } catch (e) {
        patchState({
          validating: false,
          validationError: "Couldn't load the dictionary — check your connection.",
        });
        return;
      }
    }

    const invalidWord = formedWords.find(
      (w) => !isWord(tries!.forward, w.word.toLowerCase()),
    );
    if (invalidWord) {
      patchState({ validating: false });
      return rejectMove(
        `"${invalidWord.word.toUpperCase()}" is not a valid word.`,
      );
    }

    const moveScore = scoreMove(formedWords);
    acceptMove(moveScore, pendingCells.length, formedWords);
  };

  // computes what the current pending placement would score if submitted right now;
  // returns null when the placement isn't (yet) a valid, scoreable word shape, mirroring
  // the shape/connectivity checks in submit() but skipping the dictionary lookup
  const getPendingScore = (): number | null => {
    const pendingCells = getPendingCells(board);
    if (pendingCells.length === 0) return null;

    const line = validateLineShape(pendingCells);
    if (!line.valid) return null;

    const contig = validateContiguous(board, pendingCells, line.orientation);
    if (!contig.valid) return null;

    if (firstTurn) {
      if (!validateFirstMove(pendingCells).valid) return null;
    } else if (!validateConnected(board, pendingCells).valid) {
      return null;
    }

    const wordsResult = extractWords(board, pendingCells, line.orientation);
    if (!wordsResult.valid) return null;

    return scoreMove(wordsResult.words);
  };

  // while letters are pending, checks every word the placement currently forms
  // against the local dictionary trie and returns a row,col -> 'valid'/'invalid'
  // map so the board can border each word's letters green or red; returns null
  // when there's nothing pending, the shape isn't (yet) a complete word, or the
  // dictionary hasn't finished loading. A cell touched by more than one word
  // (e.g. a cross word) reads invalid if any of its words is invalid.
  const pendingWordStatus = useMemo((): Map<string, "valid" | "invalid"> | null => {
    if (!dictionaryTries) return null;
    const pendingCells = getPendingCells(board);
    if (pendingCells.length === 0) return null;

    const line = validateLineShape(pendingCells);
    if (!line.valid) return null;

    const contig = validateContiguous(board, pendingCells, line.orientation);
    if (!contig.valid) return null;

    if (firstTurn) {
      if (!validateFirstMove(pendingCells).valid) return null;
    } else if (!validateConnected(board, pendingCells).valid) {
      return null;
    }

    const wordsResult = extractWords(board, pendingCells, line.orientation);
    if (!wordsResult.valid) return null;

    const status = new Map<string, "valid" | "invalid">();
    wordsResult.words.forEach((w) => {
      const valid = isWord(dictionaryTries.forward, w.word);
      w.cells.forEach((c) => {
        const key = `${c.row},${c.col}`;
        if (!valid || status.get(key) !== "invalid") {
          status.set(key, valid ? "valid" : "invalid");
        }
      });
    });
    return status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, dictionaryTries, firstTurn]);

  // returns the selected letters to the bag, shuffles, and draws the same number
  // of replacements for the current player; costs the player their turn
  const tradeLetters = () => {
    if (selectedIndices.length === 0 || bag.length < RACK_SIZE) return;
    const rack = p1turn ? p1inv : p2inv;
    const invKey: "p1inv" | "p2inv" = p1turn ? "p1inv" : "p2inv";
    const selectedSet = new Set(selectedIndices);
    const keptLetters = rack.filter((_, i) => !selectedSet.has(i));
    const returnedLetters = rack.filter((_, i) => selectedSet.has(i));
    const refreshedBag = shuffle(bag.concat(returnedLetters as string[]));
    const { drawn, remainingBag } = drawTiles(
      refreshedBag,
      returnedLetters.length,
    );
    const historyEntry: MoveHistoryEntry = {
      player: p1turn ? 1 : 2,
      type: "trade",
      words: [],
      score: 0,
      cells: [],
      count: returnedLetters.length,
    };

    const updates: Partial<GameState> = {
      [invKey]: keptLetters.concat(drawn),
      bag: remainingBag,
      p1turn: !p1turn,
      selectedIndices: [],
      validationError: null,
      moveHistory: [...moveHistory, historyEntry],
    };
    patchState(updates);
    persist(updates);
    maybeCheckStalemate({ ...state, ...updates });
  };

  // skips the current player's turn without placing any tiles; only allowed
  // when no letters are currently pending on the board
  const passTurn = () => {
    if (validating || countPendingCells(board) > 0) return;
    const historyEntry: MoveHistoryEntry = {
      player: p1turn ? 1 : 2,
      type: "pass",
      words: [],
      score: 0,
      cells: [],
    };
    const updates: Partial<GameState> = {
      p1turn: !p1turn,
      validationError: null,
      selectedIndices: [],
      moveHistory: [...moveHistory, historyEntry],
    };
    patchState(updates);
    persist(updates);
    maybeCheckStalemate({ ...state, ...updates });
  };

  return {
    updateInv,
    rejectMove,
    clearPending,
    shuffleRackAction,
    toggleLetterSelect,
    submit,
    getPendingScore,
    pendingWordStatus,
    tradeLetters,
    passTurn,
    maybeCheckStalemate,
  };
}
