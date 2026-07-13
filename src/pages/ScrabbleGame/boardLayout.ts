export const BOARD_SIZE = 15;
export const CENTER_ROW = 8;
export const CENTER_COL = 8;

type Coord = [number, number];

const TRIPLE_WORD: Coord[] = [
  [1, 1], [1, 8], [1, 15],
  [8, 1], [8, 15],
  [15, 1], [15, 8], [15, 15],
];
const DOUBLE_WORD: Coord[] = [
  [2, 2], [3, 3], [4, 4], [5, 5],
  [2, 14], [3, 13], [4, 12], [5, 11],
  [14, 2], [13, 3], [12, 4], [11, 5],
  [14, 14], [13, 13], [12, 12], [11, 11],
];
const TRIPLE_LETTER: Coord[] = [
  [2, 6], [2, 10], [6, 2], [6, 6], [6, 10], [6, 14],
  [10, 2], [10, 6], [10, 10], [10, 14], [14, 6], [14, 10],
];
const DOUBLE_LETTER: Coord[] = [
  [1, 4], [1, 12], [3, 7], [3, 9], [4, 1], [4, 8], [4, 15],
  [7, 3], [7, 7], [7, 9], [7, 13], [8, 4], [8, 12],
  [9, 3], [9, 7], [9, 9], [9, 13], [12, 1], [12, 8], [12, 15],
  [13, 7], [13, 9], [15, 4], [15, 12],
];

const key = (row: number, col: number) => `${row},${col}`;

const bonusMap = new Map<string, Bonus>();
TRIPLE_WORD.forEach(([row, col]) => bonusMap.set(key(row, col), 'TW'));
DOUBLE_WORD.forEach(([row, col]) => bonusMap.set(key(row, col), 'DW'));
TRIPLE_LETTER.forEach(([row, col]) => bonusMap.set(key(row, col), 'TL'));
DOUBLE_LETTER.forEach(([row, col]) => bonusMap.set(key(row, col), 'DL'));
bonusMap.set(key(CENTER_ROW, CENTER_COL), 'DW');

export function getBonus(row: number, col: number): Bonus | null {
  return bonusMap.get(key(row, col)) || null;
}

export function isCenter(row: number, col: number): boolean {
  return row === CENTER_ROW && col === CENTER_COL;
}
