import { getBonus, isCenter } from './boardLayout';
import { RACK_SIZE } from './tileBag';

const STORAGE_KEY = 'scrabble-game-save';
const SAVE_VERSION = 1;
const LETTER_RE = /^[a-z]$/;

function isLetterArray(arr, maxLength) {
  return Array.isArray(arr)
    && (maxLength === undefined || arr.length <= maxLength)
    && arr.every((letter) => LETTER_RE.test(letter));
}

function isValidCell(cell, row, col) {
  return cell
    && typeof cell === 'object'
    && cell.row === row
    && cell.col === col
    && (cell.letter === null || LETTER_RE.test(cell.letter))
    && typeof cell.locked === 'boolean'
    && typeof cell.pending === 'boolean';
}

function isValidBoard(board) {
  if (!Array.isArray(board) || board.length !== 15) return false;
  return board.every((rowCells, rowIdx) => (
    Array.isArray(rowCells)
    && rowCells.length === 15
    && rowCells.every((cell, colIdx) => isValidCell(cell, rowIdx + 1, colIdx + 1))
  ));
}

// recomputes bonus/isCenter from board layout rather than trusting stored
// values, so a hand-edited or corrupted save can't relocate bonus squares
function reconcileBoard(board) {
  return board.map((row) => row.map((cell) => ({
    ...cell,
    bonus: getBonus(cell.row, cell.col),
    isCenter: isCenter(cell.row, cell.col),
  })));
}

export function pickPersistableState(state) {
  const {
    board, bag, p1inv, p2inv, p1score, p2score, p1turn, firstTurn,
  } = state;
  return {
    board, bag, p1inv, p2inv, p1score, p2score, p1turn, firstTurn,
  };
}

export function serializeState(state) {
  return {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    state: pickPersistableState(state),
  };
}

export function isPersistableState(candidate) {
  if (!candidate || typeof candidate !== 'object') return false;
  const {
    board, bag, p1inv, p2inv, p1score, p2score, p1turn, firstTurn,
  } = candidate;
  return isValidBoard(board)
    && isLetterArray(bag)
    && isLetterArray(p1inv, RACK_SIZE)
    && isLetterArray(p2inv, RACK_SIZE)
    && typeof p1score === 'number' && Number.isFinite(p1score) && p1score >= 0
    && typeof p2score === 'number' && Number.isFinite(p2score) && p2score >= 0
    && typeof p1turn === 'boolean'
    && typeof firstTurn === 'boolean';
}

export function isSavePayload(payload) {
  return payload
    && typeof payload === 'object'
    && payload.version === SAVE_VERSION
    && isPersistableState(payload.state);
}

export function saveToLocalStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState(state)));
  } catch (e) {
    // autosave is best-effort; ignore quota/private-browsing failures
  }
}

export function loadFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  let payload;
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

  return { ...payload.state, board: reconcileBoard(payload.state.board) };
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

export function downloadSaveFile(state, filename = 'scrabble-save.json') {
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

export function readSaveFileAsState(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      let payload;
      try {
        payload = JSON.parse(reader.result);
      } catch (e) {
        reject(new Error('That file is not valid JSON.'));
        return;
      }
      if (!isSavePayload(payload)) {
        reject(new Error('That file is not a valid Scrabble save.'));
        return;
      }
      resolve({ ...payload.state, board: reconcileBoard(payload.state.board) });
    };
    reader.readAsText(file);
  });
}
