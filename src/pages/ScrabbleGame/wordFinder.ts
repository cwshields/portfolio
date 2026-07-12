import { BOARD_SIZE } from './boardLayout';
import {
  Board,
  Cell,
  FormedWord,
  LineShapeResult,
  Orientation,
  ValidationResult,
  WordsResult,
} from './types';

export function getPendingCells(board: Board): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c].pending && board[r][c].letter) cells.push(board[r][c]);
    }
  }
  return cells;
}

export function countPendingCells(board: Board): number {
  return getPendingCells(board).length;
}

function getCell(board: Board, row: number, col: number): Cell | null {
  if (row < 1 || row > BOARD_SIZE || col < 1 || col > BOARD_SIZE) return null;
  return board[row - 1][col - 1];
}

function hasLetter(cell: Cell | null): boolean {
  return !!(cell && cell.letter);
}

// Checks shape only (single row or single column). Does not check gaps/connectivity.
export function validateLineShape(pendingCells: Cell[]): LineShapeResult {
  if (pendingCells.length === 0) {
    return { valid: false, orientation: null, error: 'Place at least one letter before submitting.' };
  }
  if (pendingCells.length === 1) {
    return { valid: true, orientation: null, error: null };
  }
  const rows = new Set(pendingCells.map((c) => c.row));
  const cols = new Set(pendingCells.map((c) => c.col));
  if (rows.size === 1) return { valid: true, orientation: 'horizontal', error: null };
  if (cols.size === 1) return { valid: true, orientation: 'vertical', error: null };
  return { valid: false, orientation: null, error: 'Letters must be placed in a single row or column.' };
}

// Every cell in the span between the min/max placed cell along `orientation` must
// already have a letter (pending or locked) - no gaps allowed.
export function validateContiguous(
  board: Board,
  pendingCells: Cell[],
  orientation: Orientation | null,
): ValidationResult {
  if (!orientation) return { valid: true, error: null };
  if (orientation === 'horizontal') {
    const row = pendingCells[0].row;
    const cols = pendingCells.map((c) => c.col);
    const min = Math.min(...cols);
    const max = Math.max(...cols);
    for (let c = min; c <= max; c++) {
      if (!hasLetter(getCell(board, row, c))) {
        return { valid: false, error: 'Letters must be connected with no gaps.' };
      }
    }
  } else {
    const col = pendingCells[0].col;
    const rows = pendingCells.map((c) => c.row);
    const min = Math.min(...rows);
    const max = Math.max(...rows);
    for (let r = min; r <= max; r++) {
      if (!hasLetter(getCell(board, r, col))) {
        return { valid: false, error: 'Letters must be connected with no gaps.' };
      }
    }
  }
  return { valid: true, error: null };
}

export function validateFirstMove(pendingCells: Cell[]): ValidationResult {
  if (pendingCells.some((c) => c.isCenter)) return { valid: true, error: null };
  return { valid: false, error: 'The first word must cover the center square.' };
}

export function isConnectedToBoard(board: Board, pendingCells: Cell[]): boolean {
  return pendingCells.some((cell) => {
    const neighbors = [
      getCell(board, cell.row - 1, cell.col),
      getCell(board, cell.row + 1, cell.col),
      getCell(board, cell.row, cell.col - 1),
      getCell(board, cell.row, cell.col + 1),
    ];
    return neighbors.some((n) => n && n.locked);
  });
}

export function validateConnected(board: Board, pendingCells: Cell[]): ValidationResult {
  if (isConnectedToBoard(board, pendingCells)) return { valid: true, error: null };
  return { valid: false, error: 'Your word must connect to a letter already on the board.' };
}

function findWordThrough(board: Board, row: number, col: number, orientation: Orientation): Cell[] {
  const cells: Cell[] = [];
  if (orientation === 'horizontal') {
    let start = col;
    while (hasLetter(getCell(board, row, start - 1))) start--;
    let end = col;
    while (hasLetter(getCell(board, row, end + 1))) end++;
    for (let c = start; c <= end; c++) cells.push(getCell(board, row, c) as Cell);
  } else {
    let start = row;
    while (hasLetter(getCell(board, start - 1, col))) start--;
    let end = row;
    while (hasLetter(getCell(board, end + 1, col))) end++;
    for (let r = start; r <= end; r++) cells.push(getCell(board, r, col) as Cell);
  }
  return cells;
}

function toFormedWord(cells: Cell[], orientation: Orientation): FormedWord | null {
  if (cells.length < 2) return null;
  return {
    word: cells.map((c) => c.letter).join(''),
    orientation,
    cells: cells.map((c) => ({ row: c.row, col: c.col, letter: c.letter as string, isNew: c.pending, bonus: c.bonus })),
  };
}

// Returns { valid, words, error }. `words` = the main word (if any) plus all cross
// words formed against newly-placed tiles. For a single-tile placement, both
// directions are tried since either/both may form "the word".
export function extractWords(
  board: Board,
  pendingCells: Cell[],
  orientation: Orientation | null,
): WordsResult {
  const words: FormedWord[] = [];
  const seen = new Set<string>();
  const add = (fw: FormedWord | null, dir: Orientation) => {
    if (!fw) return;
    const k = `${dir}:${fw.cells[0].row},${fw.cells[0].col}`;
    if (!seen.has(k)) {
      seen.add(k);
      words.push(fw);
    }
  };

  if (orientation) {
    const { row, col } = pendingCells[0];
    add(toFormedWord(findWordThrough(board, row, col, orientation), orientation), orientation);
    const crossDir: Orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    pendingCells.forEach((cell) => {
      add(toFormedWord(findWordThrough(board, cell.row, cell.col, crossDir), crossDir), crossDir);
    });
  } else {
    const { row, col } = pendingCells[0];
    add(toFormedWord(findWordThrough(board, row, col, 'horizontal'), 'horizontal'), 'horizontal');
    add(toFormedWord(findWordThrough(board, row, col, 'vertical'), 'vertical'), 'vertical');
  }

  if (words.length === 0) {
    return { valid: false, words: [], error: 'Your letters must form a word of at least two letters.' };
  }
  return { valid: true, words, error: null };
}
