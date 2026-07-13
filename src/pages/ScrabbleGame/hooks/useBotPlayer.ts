import { useEffect } from "react";
import { buildBotMoveLog, pickBotMovePool } from "../bot";
import { applyCellsToBoardAndRack, dedupeCells } from "../gameState";
import { findRankedMoves } from "../moveFinder";
import { scoreWord } from "../scoring";
import { drawTiles, RACK_SIZE, shuffle } from "../tileBag";
import { loadDictionary } from "../wordList";

export function useBotPlayer(
  state: GameState,
  patchState: (updates: StateUpdate) => void,
  persist: (updates: Partial<GameState>) => void,
  passTurn: () => void,
  maybeCheckStalemate: (nextState: GameState) => Promise<void>,
): BotPlayer {
  const {
    board,
    bag,
    p2inv,
    p2score,
    firstTurn,
    botDifficulty,
    moveHistory,
    gameMode,
    p1turn,
    gameOver,
    gameOverOffer,
    showNewGameModal,
    botThinking,
  } = state;

  // swaps out the bot's entire rack for fresh tiles from the bag; the bot's
  // fallback when it has no legal (or verifiable) move but the bag still has
  // enough tiles left to trade, mirroring the human Trade button
  const botTradeLetters = () => {
    const rack = p2inv;
    const keptLetters = rack.filter((l): boolean => l == null);
    const returnedLetters = rack.filter((l) => l != null) as string[];
    const refreshedBag = shuffle(bag.concat(returnedLetters));
    const { drawn, remainingBag } = drawTiles(refreshedBag, returnedLetters.length);
    const historyEntry: MoveHistoryEntry = {
      player: 2,
      type: "trade",
      words: [],
      score: 0,
      cells: [],
      count: returnedLetters.length,
    };
    const updates: Partial<GameState> = {
      p2inv: keptLetters.concat(drawn),
      bag: remainingBag,
      p1turn: true,
      validationError: null,
      moveHistory: [...moveHistory, historyEntry],
      botThinking: false,
    };
    patchState(updates);
    persist(updates);
    maybeCheckStalemate({ ...state, ...updates });
  };

  // plays player 2's turn for them when gameMode is '1p': finds a ranked list
  // of legal moves and narrows it to a pool sized/positioned by botDifficulty,
  // taking the first candidate (already validated against the local
  // dictionary trie by findRankedMoves). Locks the move immediately (no
  // pending/review step, unlike the human hint flow). If no legal move is
  // found (or the dictionary can't be loaded), trades its whole rack when the
  // bag has enough tiles left to allow it, and only passes as a last resort.
  const playBotTurn = async () => {
    patchState({ botThinking: true, validationError: null });
    let tries: Tries;
    try {
      tries = await loadDictionary();
    } catch (e) {
      patchState({ botThinking: false });
      passTurn();
      return;
    }
    const rack = p2inv.filter((l): l is string => l != null);
    const rankedMoves = findRankedMoves(board, rack, tries, firstTurn);
    const pool = pickBotMovePool(rankedMoves, botDifficulty);
    const move = pool[0] || null;
    if (!move) {
      const willTrade = rack.length > 0 && bag.length >= RACK_SIZE;
      patchState({
        debugBotMoveLog: buildBotMoveLog({
          difficulty: botDifficulty,
          rackSize: rack.length,
          rankedMoves,
          poolCount: pool.length,
          move: null,
          outcome: willTrade ? "traded" : "passed",
        }),
      });
      if (willTrade) {
        botTradeLetters();
      } else {
        patchState({ botThinking: false });
        passTurn();
      }
      return;
    }

    const { board: pendingBoard, rack: rackAfterPlacement } =
      applyCellsToBoardAndRack(board, p2inv, move.newCells);
    const lockedBoard = pendingBoard.map((r) =>
      r.map((cell) =>
        cell.pending
          ? { ...cell, locked: true, pending: false, rackIndex: null }
          : cell,
      ),
    );
    const { drawn, remainingBag } = drawTiles(bag, move.newCells.length);
    const finalRack = rackAfterPlacement.slice();
    let drawIdx = 0;
    for (let i = 0; i < finalRack.length && drawIdx < drawn.length; i++) {
      if (finalRack[i] == null) finalRack[i] = drawn[drawIdx++];
    }
    while (drawIdx < drawn.length) finalRack.push(drawn[drawIdx++]);

    const historyEntry: MoveHistoryEntry = {
      player: 2,
      type: "play",
      words: move.words.map((w) => ({ word: w.word, score: scoreWord(w) })),
      score: move.score,
      cells: dedupeCells(move.words.flatMap((w) => w.cells)),
    };

    const updates: Partial<GameState> = {
      board: lockedBoard,
      bag: remainingBag,
      p2inv: finalRack,
      p2score: p2score + move.score,
      p1turn: true,
      firstTurn: false,
      validating: false,
      validationError: null,
      selectedIndices: [],
      moveHistory: [...moveHistory, historyEntry],
      botThinking: false,
      debugBotMoveLog: buildBotMoveLog({
        difficulty: botDifficulty,
        rackSize: rack.length,
        rankedMoves,
        poolCount: pool.length,
        move,
        outcome: "played",
      }),
    };
    patchState(updates);
    persist(updates);
    maybeCheckStalemate({ ...state, ...updates });
  };

  // triggers the bot's turn a beat after it becomes player 2's turn in '1p'
  // mode, so the move doesn't appear instantaneously
  useEffect(() => {
    if (
      gameMode !== "1p" ||
      p1turn ||
      gameOver ||
      gameOverOffer ||
      showNewGameModal ||
      botThinking
    )
      return;
    const timer = setTimeout(() => {
      playBotTurn();
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameMode, p1turn, gameOver, gameOverOffer, showNewGameModal]);

  return { playBotTurn };
}
