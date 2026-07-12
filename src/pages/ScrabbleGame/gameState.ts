import { BOARD_SIZE, getBonus, isCenter } from "./boardLayout";
import {
  Board,
  Cell,
  DebugBotMoveLog,
  DragSource,
  FormedWordCell,
  HistoryCell,
  NewCell,
  PersistableState,
  Rack,
  Tries,
} from "./types";

export interface GameState extends Required<PersistableState> {
  // true while awaiting the dictionary API response for a submitted word
  validating: boolean;
  // message shown when a submitted move is rejected, can't be verified,
  // or a file import fails
  validationError: string | null;
  // indices (within the current player's rack) selected for a letter trade
  selectedIndices: number[];
  // the letter currently being dragged, if any: either
  // { type: 'rack', index } or { type: 'board', row, col, letter }
  dragSource: DragSource | null;
  // true once the tile bag is empty and neither player's rack can form any
  // legal move - offers the player a chance to end the game
  gameOverOffer: boolean;
  // true once the player has confirmed ending a stalemated game
  gameOver: boolean;
  // true while a hint is being computed (first use loads the dictionary)
  findingHint: boolean;
  // local word-list trie, once loaded, used to give live green/red border
  // feedback on words formed by the current pending placement
  dictionaryTries: Tries | null;
  // whether the turn-history sidebar is open
  showHistory: boolean;
  // cells (from a hovered history row's words) to highlight on the board; null when nothing hovered
  hoveredTurnCells: HistoryCell[] | null;
  // true while the new-game modal is shown: on first visit (no autosave found)
  // and whenever the player opens it via the New Game button
  showNewGameModal: boolean;
  // true while the bot is computing/playing its move, so the UI can show a
  // "thinking" state and block the human from acting out of turn
  botThinking: boolean;
  // true while the hidden debug panel is open (toggled with Ctrl+Shift+D);
  // none of the debug-* fields below are persisted to a save
  debugMode: boolean;
  // debug: reveals the bot's rack (normally hidden) in '1p' mode
  debugRevealBotRack: boolean;
  // debug: lets a submitted (locked) board tile be dragged to another cell
  debugAllowMoveLocked: boolean;
  // debug: summary of the bot's most recent move search (ranked candidates,
  // the pool its difficulty drew from, and what it ultimately did), for the
  // debug panel's bot move inspector; null until the bot has moved once
  debugBotMoveLog: DebugBotMoveLog | null;
}

export type StateUpdate = Partial<GameState> | ((state: GameState) => Partial<GameState>);

// creates a fresh 15x15 board, carrying bonus-square info per cell
export function buildBoard(): Board {
  const board: Cell[][] = [];
  for (let row = 1; row <= BOARD_SIZE; row++) {
    const rowCells: Cell[] = [];
    for (let col = 1; col <= BOARD_SIZE; col++) {
      rowCells.push({
        row,
        col,
        letter: null,
        locked: false,
        pending: false,
        // which rack slot a pending letter came from, so it can be returned
        // to that exact slot instead of the rack reflowing
        rackIndex: null,
        bonus: getBonus(row, col),
        isCenter: isCenter(row, col),
      });
    }
    board.push(rowCells);
  }
  return board;
}

// collapses a move's formed-word cells down to their unique board positions,
// so a turn that forms overlapping words doesn't highlight the same cell twice
export function dedupeCells(cells: FormedWordCell[]): HistoryCell[] {
  const seen = new Set<string>();
  const result: HistoryCell[] = [];
  cells.forEach(({ row, col }) => {
    const key = `${row},${col}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push({ row, col });
    }
  });
  return result;
}

// places `newCells` onto `currentBoard` as pending letters and pulls the
// matching letters out of `rack`; shared by applyHintMove (leaves the
// placement pending for the player to review/submit) and playBotTurn
// (which locks it immediately, since the bot has no review step)
export function applyCellsToBoardAndRack(currentBoard: Board, rack: Rack, newCells: NewCell[]): { board: Board; rack: Rack } {
  const workingRack = rack.slice();
  const placements = new Map<string, { letter: string; rackIndex: number }>();
  newCells.forEach(({ row, col, letter }) => {
    const idx = workingRack.findIndex((l) => l === letter);
    workingRack[idx] = null;
    placements.set(`${row},${col}`, { letter, rackIndex: idx });
  });
  const newBoard = currentBoard.map((r) =>
    r.map((cell) => {
      const placed = placements.get(`${cell.row},${cell.col}`);
      if (!placed) return cell;
      return {
        ...cell,
        letter: placed.letter,
        pending: true,
        rackIndex: placed.rackIndex,
      };
    }),
  );
  return { board: newBoard, rack: workingRack };
}

export const initialState: GameState = {
  // p1turn is to cycle between turns
  p1turn: true,
  // when firstTurn is false, the player will have to use letters currently on the board
  firstTurn: true,
  // p#inv is the players current inventory of letters
  p1inv: [],
  p2inv: [],
  // adds the moveScore to the applicable player once a word is confirmed
  p1score: 0,
  p2score: 0,
  // the board is a 15x15 grid of cell objects: { row, col, letter, locked, pending, bonus, isCenter }
  board: buildBoard(),
  // shared pool of letters both players draw from
  bag: [],
  validating: false,
  validationError: null,
  selectedIndices: [],
  dragSource: null,
  gameOverOffer: false,
  gameOver: false,
  findingHint: false,
  dictionaryTries: null,
  // number of hints each player has used so far this game, capped at HINT_LIMIT
  p1hintsUsed: 0,
  p2hintsUsed: 0,
  // chronological log of turns: word plays, passes, and trades, for the history sidebar
  moveHistory: [],
  showHistory: false,
  hoveredTurnCells: null,
  // '1p' (player 2 is a bot) or '2p' (local hotseat); chosen via the new-game modal
  gameMode: "2p",
  // 'easy' | 'medium' | 'hard' when gameMode is '1p', otherwise null
  botDifficulty: null,
  showNewGameModal: false,
  botThinking: false,
  debugMode: false,
  debugRevealBotRack: false,
  debugAllowMoveLocked: false,
  debugBotMoveLog: null,
};

// each player gets this many hints for the whole game
export const HINT_LIMIT = 3;

// merges partial updates into state, mirroring class-style this.setState(partial);
// also accepts an updater function, mirroring this.setState(prevState => partial)
export function stateReducer(state: GameState, action: StateUpdate): GameState {
  const updates = typeof action === "function" ? action(state) : action;
  return { ...state, ...updates };
}
