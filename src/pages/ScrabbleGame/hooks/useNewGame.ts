import { buildBoard, GameState, StateUpdate } from "../gameState";
import { createBag, drawTiles, RACK_SIZE } from "../tileBag";
import { BotDifficulty, GameMode } from "../types";

export interface NewGame {
  openNewGameModal: () => void;
  closeNewGameModal: () => void;
  startNewGame: (mode: GameMode, difficulty: BotDifficulty | null) => void;
  endGame: () => void;
  dismissGameOverOffer: () => void;
}

export function useNewGame(
  patchState: (updates: StateUpdate) => void,
  persist: (updates: Partial<GameState>) => void,
): NewGame {
  // opens the new-game modal; non-destructive, nothing changes until the
  // player confirms a mode/difficulty and clicks Start Game
  const openNewGameModal = () => {
    patchState({ showNewGameModal: true });
  };

  // closes the modal without starting anything new; only offered once a game
  // is actually in progress (see canCancelNewGameModal below)
  const closeNewGameModal = () => {
    patchState({ showNewGameModal: false });
  };

  // rebuilds the whole game from scratch in the chosen mode, once the player
  // confirms via the new-game modal
  const startNewGame = (mode: GameMode, difficulty: BotDifficulty | null) => {
    const newBag = createBag();
    const { drawn: p1Rack, remainingBag: r1 } = drawTiles(newBag, RACK_SIZE);
    const { drawn: p2Rack, remainingBag: r2 } = drawTiles(r1, RACK_SIZE);
    const updates: Partial<GameState> = {
      p1turn: true,
      firstTurn: true,
      p1inv: p1Rack,
      p2inv: p2Rack,
      p1score: 0,
      p2score: 0,
      board: buildBoard(),
      bag: r2,
      validating: false,
      validationError: null,
      selectedIndices: [],
      gameOverOffer: false,
      gameOver: false,
      p1hintsUsed: 0,
      p2hintsUsed: 0,
      moveHistory: [],
      gameMode: mode,
      botDifficulty: difficulty,
      showNewGameModal: false,
      botThinking: false,
      debugBotMoveLog: null,
    };
    patchState(updates);
    persist(updates);
  };

  // player-confirmed end to a stalemated game; locks the board and rack
  const endGame = () => {
    patchState({ gameOverOffer: false, gameOver: true });
  };

  // dismisses the stalemate banner without ending the game; it will
  // reappear after the next turn-ending action if the condition still holds
  const dismissGameOverOffer = () => {
    patchState({ gameOverOffer: false });
  };

  return { openNewGameModal, closeNewGameModal, startNewGame, endGame, dismissGameOverOffer };
}
