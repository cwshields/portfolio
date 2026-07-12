export type Bonus = 'TW' | 'DW' | 'TL' | 'DL';

export type Orientation = 'horizontal' | 'vertical';

export interface Cell {
  row: number;
  col: number;
  letter: string | null;
  locked: boolean;
  pending: boolean;
  // which rack slot a pending letter came from, so it can be returned
  // to that exact slot instead of the rack reflowing
  rackIndex: number | null;
  bonus: Bonus | null;
  isCenter: boolean;
}

export type Board = Cell[][];

// a rack can hold nulls: gaps left by letters currently placed (pending) on the board
export type RackSlot = string | null;
export type Rack = RackSlot[];

export interface FormedWordCell {
  row: number;
  col: number;
  letter: string;
  isNew: boolean;
  bonus: Bonus | null;
}

export interface FormedWord {
  word: string;
  orientation: Orientation;
  cells: FormedWordCell[];
}

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

export interface LineShapeResult extends ValidationResult {
  orientation: Orientation | null;
}

export interface WordsResult {
  valid: boolean;
  words: FormedWord[];
  error: string | null;
}

export interface TrieNode {
  children: Record<string, TrieNode>;
  isWord: boolean;
}

export interface Tries {
  forward: TrieNode;
  reverse: TrieNode;
}

export interface NewCell {
  row: number;
  col: number;
  letter: string;
}

export interface Candidate {
  orientation: Orientation;
  newCells: NewCell[];
}

export interface RankedMove {
  newCells: NewCell[];
  words: FormedWord[];
  score: number;
}

export type GameMode = '1p' | '2p';
export type BotDifficulty = 'easy' | 'medium' | 'hard';

export interface HistoryWord {
  word: string;
  score: number;
}

export interface HistoryCell {
  row: number;
  col: number;
}

export type HistoryEntryType = 'play' | 'pass' | 'trade';

export interface MoveHistoryEntry {
  player: 1 | 2;
  type: HistoryEntryType;
  words: HistoryWord[];
  score: number;
  cells: HistoryCell[];
  count?: number;
}

export interface PersistableState {
  board: Board;
  bag: string[];
  p1inv: Rack;
  p2inv: Rack;
  p1score: number;
  p2score: number;
  p1turn: boolean;
  firstTurn: boolean;
  p1hintsUsed?: number;
  p2hintsUsed?: number;
  moveHistory?: MoveHistoryEntry[];
  gameMode?: GameMode;
  botDifficulty?: BotDifficulty | null;
}

export interface DebugBotMoveLogEntry {
  word: string;
  score: number;
}

export type BotMoveOutcome = 'played' | 'traded' | 'passed';

export interface DebugBotMoveLog {
  difficulty: BotDifficulty | null;
  rackSize: number;
  rankedCount: number;
  poolCount: number;
  top: DebugBotMoveLogEntry[];
  chosen: DebugBotMoveLogEntry | null;
  outcome: BotMoveOutcome;
}

export type DragSource =
  | { type: 'rack'; index: number }
  | {
      type: 'board';
      row: number;
      col: number;
      letter: string;
      rackIndex: number | null;
      wasLocked: boolean;
    };
