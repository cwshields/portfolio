import { BOARD_SIZE, CENTER_ROW, CENTER_COL } from './boardLayout';
import { step, isWord as trieIsWord } from './trie';
import {
  validateLineShape,
  validateContiguous,
  validateFirstMove,
  validateConnected,
  extractWords,
} from './wordFinder';
import { scoreMove } from './scoring';
import { Board, Candidate, Cell, NewCell, Orientation, RankedMove, TrieNode, Tries } from './types';

// Finds legal plays for a rack against the current (locked-only) board, using
// a dictionary trie for fast prefix pruning. The search below is a candidate
// generator - it proposes plausible new-tile placements via anchor squares,
// but the real legality/scoring check is delegated to wordFinder.js and
// scoring.js (the same code the actual submit flow uses), so any geometric
// edge case the generator gets wrong just produces a rejected candidate
// rather than a bad hint.
//
// Because a word can grow to the left of an anchor using several rack tiles,
// and those tiles are discovered working outward from the anchor (i.e. in
// reverse reading order), a second trie built from reversed words is used to
// validate that growing left part; once a placement point is chosen the
// normal forward trie takes over to walk the rest of the word rightward.

interface Position {
  row: number;
  col: number;
}

interface WalkCell extends Position {
  letter: string;
  isNew: boolean;
}

function getCell(board: Board, row: number, col: number): Cell | null {
  if (row < 1 || row > BOARD_SIZE || col < 1 || col > BOARD_SIZE) return null;
  return board[row - 1][col - 1];
}

function isFilled(cell: Cell | null): boolean {
  return !!(cell && cell.letter && cell.locked);
}

function movePos(pos: Position, orientation: Orientation, delta: number): Position {
  return orientation === 'horizontal'
    ? { row: pos.row, col: pos.col + delta }
    : { row: pos.row + delta, col: pos.col };
}

function boardIsEmpty(board: Board): boolean {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (isFilled(board[r][c])) return false;
    }
  }
  return true;
}

// an anchor is any empty square a play must touch: squares adjacent to an
// existing letter, or the center square when the board is untouched
function findAnchors(board: Board): Position[] {
  if (boardIsEmpty(board)) return [{ row: CENTER_ROW, col: CENTER_COL }];
  const anchors: Position[] = [];
  for (let r = 1; r <= BOARD_SIZE; r++) {
    for (let c = 1; c <= BOARD_SIZE; c++) {
      const cell = getCell(board, r, c);
      if (isFilled(cell)) continue;
      const hasFilledNeighbor =
        isFilled(getCell(board, r - 1, c)) ||
        isFilled(getCell(board, r + 1, c)) ||
        isFilled(getCell(board, r, c - 1)) ||
        isFilled(getCell(board, r, c + 1));
      if (hasFilledNeighbor) anchors.push({ row: r, col: c });
    }
  }
  return anchors;
}

function toCounts(letters: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  letters.forEach((l) => {
    counts[l] = (counts[l] || 0) + 1;
  });
  return counts;
}

// letters that could legally sit at (row, col) without breaking whatever
// perpendicular word already runs through that square; null = unconstrained
function crossCheckSet(
  board: Board,
  row: number,
  col: number,
  perpOrientation: Orientation,
  forwardTrie: TrieNode,
  cache: Map<string, Set<string> | null>,
): Set<string> | null {
  const key = `${row},${col},${perpOrientation}`;
  if (cache.has(key)) return cache.get(key) as Set<string> | null;

  const before: string[] = [];
  const after: string[] = [];
  const step1: Position = perpOrientation === 'vertical' ? { row: row - 1, col } : { row, col: col - 1 };
  const step2: Position = perpOrientation === 'vertical' ? { row: row + 1, col } : { row, col: col + 1 };
  const delta: 'row' | 'col' = perpOrientation === 'vertical' ? 'row' : 'col';

  let pos = step1;
  while (isFilled(getCell(board, pos.row, pos.col))) {
    before.unshift((getCell(board, pos.row, pos.col) as Cell).letter as string);
    pos = { ...pos, [delta]: pos[delta] - 1 };
  }
  pos = step2;
  while (isFilled(getCell(board, pos.row, pos.col))) {
    after.push((getCell(board, pos.row, pos.col) as Cell).letter as string);
    pos = { ...pos, [delta]: pos[delta] + 1 };
  }

  let result: Set<string> | null = null;
  if (before.length > 0 || after.length > 0) {
    const prefix = before.join('');
    const suffix = after.join('');
    result = new Set();
    for (let code = 97; code <= 122; code++) {
      const letter = String.fromCharCode(code);
      if (trieIsWord(forwardTrie, prefix + letter + suffix)) result.add(letter);
    }
  }
  cache.set(key, result);
  return result;
}

type AddCandidate = (orientation: Orientation, cellsSoFar: WalkCell[]) => void;

// walks outward from a single anchor in one orientation, reporting every new-tile
// placement whose trie path is a complete word (candidates still need the final
// validateAndScoreCandidate pass before they're trustworthy)
function searchAnchor(
  board: Board,
  anchor: Position,
  orientation: Orientation,
  rackCounts: Record<string, number>,
  tries: Tries,
  crossCache: Map<string, Set<string> | null>,
  addCandidate: AddCandidate,
): void {
  const perpOrientation: Orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';

  function extendRight(node: TrieNode, pos: Position, cellsSoFar: WalkCell[]): void {
    const cell = getCell(board, pos.row, pos.col);
    const placedCount = cellsSoFar.reduce((n, c) => n + (c.isNew ? 1 : 0), 0);

    if (!cell) {
      if (node.isWord && placedCount > 0) addCandidate(orientation, cellsSoFar);
      return;
    }

    if (isFilled(cell)) {
      const child = step(node, cell.letter as string);
      if (!child) return;
      extendRight(child, movePos(pos, orientation, 1), [
        ...cellsSoFar,
        { row: pos.row, col: pos.col, letter: cell.letter as string, isNew: false },
      ]);
      return;
    }

    if (node.isWord && placedCount > 0) addCandidate(orientation, cellsSoFar);

    Object.keys(rackCounts).forEach((letter) => {
      if (rackCounts[letter] <= 0) return;
      const child = step(node, letter);
      if (!child) return;
      const crossSet = crossCheckSet(board, pos.row, pos.col, perpOrientation, tries.forward, crossCache);
      if (crossSet && !crossSet.has(letter)) return;
      rackCounts[letter]--;
      extendRight(child, movePos(pos, orientation, 1), [
        ...cellsSoFar,
        { row: pos.row, col: pos.col, letter, isNew: true },
      ]);
      rackCounts[letter]++;
    });
  }

  // discoveryCells accumulate letters walking away from the anchor (closest first);
  // reversing them gives the actual left-to-right reading order
  function attemptStop(discoveryCells: WalkCell[]): void {
    let fnode: TrieNode | null = tries.forward;
    const leftToRight = discoveryCells.slice().reverse();
    for (const c of leftToRight) {
      fnode = step(fnode, c.letter);
      if (!fnode) return;
    }
    extendRight(fnode, anchor, leftToRight);
  }

  function leftPart(reverseNode: TrieNode, discoveryCells: WalkCell[], leftPos: Position): void {
    const cell = getCell(board, leftPos.row, leftPos.col);
    const canStop = !cell || !isFilled(cell);
    if (canStop) attemptStop(discoveryCells);
    if (!cell) return;

    if (isFilled(cell)) {
      const child = step(reverseNode, cell.letter as string);
      if (!child) return;
      leftPart(
        child,
        [...discoveryCells, { row: leftPos.row, col: leftPos.col, letter: cell.letter as string, isNew: false }],
        movePos(leftPos, orientation, -1),
      );
      return;
    }

    Object.keys(rackCounts).forEach((letter) => {
      if (rackCounts[letter] <= 0) return;
      const child = step(reverseNode, letter);
      if (!child) return;
      const crossSet = crossCheckSet(board, leftPos.row, leftPos.col, perpOrientation, tries.forward, crossCache);
      if (crossSet && !crossSet.has(letter)) return;
      rackCounts[letter]--;
      leftPart(
        child,
        [...discoveryCells, { row: leftPos.row, col: leftPos.col, letter, isNew: true }],
        movePos(leftPos, orientation, -1),
      );
      rackCounts[letter]++;
    });
  }

  leftPart(tries.reverse, [], movePos(anchor, orientation, -1));
}

function candidateKey(orientation: Orientation, newCells: NewCell[]): string {
  return `${orientation}:${newCells.map((c) => `${c.row},${c.col},${c.letter}`).join('|')}`;
}

function findCandidates(board: Board, rack: string[], tries: Tries, firstTurn: boolean): Candidate[] {
  const anchors = findAnchors(board);
  const rackCounts = toCounts(rack);
  const crossCache = new Map<string, Set<string> | null>();
  const seen = new Set<string>();
  const candidates: Candidate[] = [];

  const addCandidate: AddCandidate = (orientation, cellsSoFar) => {
    const newCells: NewCell[] = cellsSoFar
      .filter((c) => c.isNew)
      .map(({ row, col, letter }) => ({ row, col, letter }));
    if (newCells.length === 0) return;
    const key = candidateKey(orientation, newCells);
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({ orientation, newCells });
  };

  anchors.forEach((anchor) => {
    searchAnchor(board, anchor, 'horizontal', rackCounts, tries, crossCache, addCandidate);
    searchAnchor(board, anchor, 'vertical', rackCounts, tries, crossCache, addCandidate);
  });

  return candidates;
}

function applyPendingToScratch(board: Board, newCells: NewCell[]): Board {
  const byPos = new Map(newCells.map((c) => [`${c.row},${c.col}`, c.letter]));
  return board.map((row) =>
    row.map((cell) => {
      const letter = byPos.get(`${cell.row},${cell.col}`);
      return letter ? { ...cell, letter, pending: true } : cell;
    }),
  );
}

// re-validates a candidate through the same rules submit() uses, and scores it
// with the same scoring engine, so a hint can never disagree with real gameplay
function validateAndScoreCandidate(
  board: Board,
  candidate: Candidate,
  firstTurn: boolean,
  forwardTrie: TrieNode,
): RankedMove | null {
  const scratchBoard = applyPendingToScratch(board, candidate.newCells);
  const pendingCells = candidate.newCells.map((c) => scratchBoard[c.row - 1][c.col - 1]);

  const line = validateLineShape(pendingCells);
  if (!line.valid) return null;

  const contig = validateContiguous(scratchBoard, pendingCells, line.orientation);
  if (!contig.valid) return null;

  if (firstTurn) {
    if (!validateFirstMove(pendingCells).valid) return null;
  } else if (!validateConnected(scratchBoard, pendingCells).valid) {
    return null;
  }

  const wordsResult = extractWords(scratchBoard, pendingCells, line.orientation);
  if (!wordsResult.valid) return null;

  for (const w of wordsResult.words) {
    if (!trieIsWord(forwardTrie, w.word.toLowerCase())) return null;
  }

  return {
    newCells: candidate.newCells,
    words: wordsResult.words,
    score: scoreMove(wordsResult.words),
  };
}

// `tries` is the { forward, reverse } pair returned by wordList.loadDictionary()
export function hasAnyLegalMove(board: Board, rack: string[], tries: Tries, firstTurn: boolean): boolean {
  if (!rack || rack.length === 0) return false;
  return findCandidates(board, rack, tries, firstTurn).some(
    (c) => validateAndScoreCandidate(board, c, firstTurn, tries.forward) !== null,
  );
}

// returns every legal move (per our local dictionary), best score first. The
// caller can walk this list to double-check candidates against a stricter
// source (e.g. the live dictionary API) without re-running the search.
export function findRankedMoves(board: Board, rack: string[], tries: Tries, firstTurn: boolean): RankedMove[] {
  if (!rack || rack.length === 0) return [];
  const results: RankedMove[] = [];
  findCandidates(board, rack, tries, firstTurn).forEach((c) => {
    const result = validateAndScoreCandidate(board, c, firstTurn, tries.forward);
    if (result) results.push(result);
  });
  results.sort((a, b) => b.score - a.score);
  return results;
}

export function findBestMove(board: Board, rack: string[], tries: Tries, firstTurn: boolean): RankedMove | null {
  return findRankedMoves(board, rack, tries, firstTurn)[0] || null;
}
