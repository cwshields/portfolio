import { getBonus, isCenter } from './boardLayout';
import { RACK_SIZE } from './tileBag';

const STORAGE_KEY = 'scrabble-game-save';
const SAVE_VERSION = 1;
const LETTER_RE = /^[a-z]$/;

function isLetterArray(arr: unknown, maxLength?: number): arr is string[] {
  return Array.isArray(arr)
    && (maxLength === undefined || arr.length <= maxLength)
    && arr.every((letter) => LETTER_RE.test(letter));
}

// a rack can hold nulls: gaps left by letters currently placed (pending) on the board
function isRackArray(arr: unknown, maxLength: number): arr is Rack {
  return Array.isArray(arr)
    && arr.length <= maxLength
    && arr.every((letter) => letter === null || LETTER_RE.test(letter));
}

function isValidCell(cell: unknown, row: number, col: number): cell is Cell {
  const c = cell as Cell;
  return !!c
    && typeof c === 'object'
    && c.row === row
    && c.col === col
    && (c.letter === null || LETTER_RE.test(c.letter))
    && typeof c.locked === 'boolean'
    && typeof c.pending === 'boolean'
    && (c.rackIndex === null
      || (Number.isInteger(c.rackIndex) && (c.rackIndex as number) >= 0));
}

function isValidBoard(board: unknown): board is Board {
  if (!Array.isArray(board) || board.length !== 15) return false;
  return board.every((rowCells, rowIdx) => (
    Array.isArray(rowCells)
    && rowCells.length === 15
    && rowCells.every((cell, colIdx) => isValidCell(cell, rowIdx + 1, colIdx + 1))
  ));
}

// recomputes bonus/isCenter from board layout rather than trusting stored
// values, so a hand-edited or corrupted save can't relocate bonus squares
function reconcileBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({
    ...cell,
    bonus: getBonus(cell.row, cell.col),
    isCenter: isCenter(cell.row, cell.col),
  })));
}

export function pickPersistableState(state: PersistableState): PersistableState {
  const {
    board, bag, p1inv, p2inv, p1score, p2score, p1turn, firstTurn,
    p1hintsUsed, p2hintsUsed, moveHistory, gameMode, botDifficulty,
  } = state;
  return {
    board, bag, p1inv, p2inv, p1score, p2score, p1turn, firstTurn,
    p1hintsUsed, p2hintsUsed, moveHistory, gameMode, botDifficulty,
  };
}

export function serializeState(state: PersistableState): SavePayload {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: pickPersistableState(state),
  };
}

// hint counts are optional on older saves, which predate the hint limit
function isValidHintCount(value: unknown): value is number | undefined {
  return value === undefined || (Number.isInteger(value) && (value as number) >= 0);
}

function isValidHistoryWord(word: unknown): boolean {
  const w = word as { word?: unknown; score?: unknown };
  return !!w && typeof w === 'object'
    && typeof w.word === 'string'
    && typeof w.score === 'number' && Number.isFinite(w.score);
}

function isValidHistoryCell(cell: unknown): boolean {
  const c = cell as { row?: unknown; col?: unknown };
  return !!c && typeof c === 'object'
    && Number.isInteger(c.row) && Number.isInteger(c.col);
}

function isValidHistoryEntry(entry: unknown): entry is MoveHistoryEntry {
  const e = entry as MoveHistoryEntry;
  return !!e && typeof e === 'object'
    && (e.player === 1 || e.player === 2)
    && (e.type === 'play' || e.type === 'pass' || e.type === 'trade')
    && Array.isArray(e.words) && e.words.every(isValidHistoryWord)
    && typeof e.score === 'number' && Number.isFinite(e.score)
    && Array.isArray(e.cells) && e.cells.every(isValidHistoryCell);
}

// moveHistory is optional on older saves, which predate turn history
function isValidHistory(value: unknown): value is MoveHistoryEntry[] | undefined {
  return value === undefined
    || (Array.isArray(value) && value.every(isValidHistoryEntry));
}

// gameMode/botDifficulty are optional on older saves, which predate the bot player
function isValidGameMode(value: unknown): value is GameMode | undefined {
  return value === undefined || value === '1p' || value === '2p';
}

function isValidBotDifficulty(value: unknown): value is BotDifficulty | null | undefined {
  return value === undefined || value === null
    || value === 'easy' || value === 'medium' || value === 'hard';
}

export function isPersistableState(candidate: unknown): candidate is PersistableState {
  if (!candidate || typeof candidate !== 'object') return false;
  const {
    board, bag, p1inv, p2inv, p1score, p2score, p1turn, firstTurn,
    p1hintsUsed, p2hintsUsed, moveHistory, gameMode, botDifficulty,
  } = candidate as PersistableState;
  return isValidBoard(board)
    && isLetterArray(bag)
    && isRackArray(p1inv, RACK_SIZE)
    && isRackArray(p2inv, RACK_SIZE)
    && typeof p1score === 'number' && Number.isFinite(p1score) && p1score >= 0
    && typeof p2score === 'number' && Number.isFinite(p2score) && p2score >= 0
    && typeof p1turn === 'boolean'
    && typeof firstTurn === 'boolean'
    && isValidHintCount(p1hintsUsed)
    && isValidHintCount(p2hintsUsed)
    && isValidHistory(moveHistory)
    && isValidGameMode(gameMode)
    && isValidBotDifficulty(botDifficulty);
}

export function isSavePayload(payload: unknown): payload is SavePayload {
  const p = payload as SavePayload;
  return !!p
    && typeof p === 'object'
    && p.version === SAVE_VERSION
    && isPersistableState(p.state);
}

export function saveToLocalStorage(state: PersistableState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState(state)));
  } catch (e) {
    // autosave is best-effort; ignore quota/private-browsing failures
  }
}

function withDefaults(state: PersistableState): PersistableState {
  return {
    ...state,
    board: reconcileBoard(state.board),
    p1hintsUsed: state.p1hintsUsed ?? 0,
    p2hintsUsed: state.p2hintsUsed ?? 0,
    moveHistory: state.moveHistory ?? [],
    gameMode: state.gameMode ?? '2p',
    botDifficulty: state.botDifficulty ?? null,
  };
}

export function loadFromLocalStorage(): PersistableState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  if (!isSavePayload(payload)) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return withDefaults(payload.state);
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function downloadSaveFile(state: PersistableState, filename = 'scrabble-save.json'): void {
  const blob = new Blob([JSON.stringify(serializeState(state), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readSaveFileAsState(file: File): Promise<PersistableState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      let payload: unknown;
      try {
        payload = JSON.parse(reader.result as string);
      } catch (e) {
        reject(new Error('That file is not valid JSON.'));
        return;
      }
      if (!isSavePayload(payload)) {
        reject(new Error('That file is not a valid Scrabble save.'));
        return;
      }
      resolve(withDefaults(payload.state));
    };
    reader.readAsText(file);
  });
}
