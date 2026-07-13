interface GameState extends Required<PersistableState> {
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

interface BoardGridProps {
  board: Board;
  dragSource: DragSource | null;
  highlightedCellKeys: Set<string> | null;
  pendingWordStatus: Map<string, "valid" | "invalid"> | null;
  disabled: boolean;
  debugMovable: boolean;
  onDropLetter: (cell: Cell) => void;
  onDragStartLetter: (cell: Cell) => void;
  onDragEnd: () => void;
}

interface DebugPanelProps {
  p1inv: Rack;
  p2inv: Rack;
  bag: string[];
  gameMode: GameMode;
  botDifficulty: BotDifficulty | null;
  p1Label: string;
  p2Label: string;
  debugRevealBotRack: boolean;
  debugAllowMoveLocked: boolean;
  debugBotMoveLog: DebugBotMoveLog | null;
  onClose: () => void;
  onReshuffleRack: (player: 1 | 2) => void;
  onResetHints: () => void;
  onToggleRevealBotRack: () => void;
  onToggleAllowMoveLocked: () => void;
  onForceStalemateCheck: () => void;
  onSetRack: (player: 1 | 2, letters: string) => void;
}

interface GameSidebarProps {
  gameOverOffer: boolean;
  gameOver: boolean;
  p1score: number;
  p2score: number;
  playerLabel: (isP1: boolean) => string;
  botTurnActive: boolean;
  botThinking: boolean;
  botLabel: string;
  p1turn: boolean;
  firstTurn: boolean;
  pendingScore: number | null;
  validationError: string | null;
  selectedCount: number;
  bagLength: number;
  validating: boolean;
  pendingCount: number;
  onEndGame: () => void;
  onDismissGameOverOffer: () => void;
  onTradeLetters: () => void;
  onPassTurn: () => void;
  onSubmit: () => void;
}

interface ShowcaseData {
  link: {
    url: string;
    img: string;
    alt: string;
  };
  name: string;
  description: string[];
  github: {
    url?: string;
  };
  subheader: string[];
  features: string[][];
  footer?: boolean;
}

interface Config {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
}

interface ShowcaseProps {
  data: ShowcaseData;
}

interface BuildBotMoveLogParams {
  difficulty: BotDifficulty | null;
  rackSize: number;
  rankedMoves: RankedMove[];
  poolCount: number;
  move: RankedMove | null;
  outcome: BotMoveOutcome;
}

type Bonus = "TW" | "DW" | "TL" | "DL";

type Orientation = "horizontal" | "vertical";

interface Cell {
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

type Board = Cell[][];

// a rack can hold nulls: gaps left by letters currently placed (pending) on the board
type RackSlot = string | null;
type Rack = RackSlot[];

interface FormedWordCell {
  row: number;
  col: number;
  letter: string;
  isNew: boolean;
  bonus: Bonus | null;
}

interface FormedWord {
  word: string;
  orientation: Orientation;
  cells: FormedWordCell[];
}

interface ValidationResult {
  valid: boolean;
  error: string | null;
}

interface LineShapeResult extends ValidationResult {
  orientation: Orientation | null;
}

interface WordsResult {
  valid: boolean;
  words: FormedWord[];
  error: string | null;
}

interface TrieNode {
  children: Record<string, TrieNode>;
  isWord: boolean;
}

interface Tries {
  forward: TrieNode;
  reverse: TrieNode;
}

interface NewCell {
  row: number;
  col: number;
  letter: string;
}

interface Candidate {
  orientation: Orientation;
  newCells: NewCell[];
}

interface RankedMove {
  newCells: NewCell[];
  words: FormedWord[];
  score: number;
}

type GameMode = "1p" | "2p";
type BotDifficulty = "easy" | "medium" | "hard";

interface HistoryWord {
  word: string;
  score: number;
}

interface HistoryCell {
  row: number;
  col: number;
}

type HistoryEntryType = "play" | "pass" | "trade";

interface MoveHistoryEntry {
  player: 1 | 2;
  type: HistoryEntryType;
  words: HistoryWord[];
  score: number;
  cells: HistoryCell[];
  count?: number;
}

interface PersistableState {
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

interface DebugBotMoveLogEntry {
  word: string;
  score: number;
}

type BotMoveOutcome = "played" | "traded" | "passed";

interface DebugBotMoveLog {
  difficulty: BotDifficulty | null;
  rackSize: number;
  rankedCount: number;
  poolCount: number;
  top: DebugBotMoveLogEntry[];
  chosen: DebugBotMoveLogEntry | null;
  outcome: BotMoveOutcome;
}

type DragSource =
  | { type: "rack"; index: number }
  | {
      type: "board";
      row: number;
      col: number;
      letter: string;
      rackIndex: number | null;
      wasLocked: boolean;
    };

interface Position {
  row: number;
  col: number;
}

interface WalkCell extends Position {
  letter: string;
  isNew: boolean;
}

interface SavePayload {
  version: number;
  savedAt: string;
  state: PersistableState;
}

interface LetterDistributionEntry {
  name: string;
  score: number;
  count: number;
}

interface DrawResult<T> {
  drawn: T[];
  remainingBag: T[];
}

interface HistoryPanelProps {
  showHistory: boolean;
  moveHistory: MoveHistoryEntry[];
  playerLabel: (isP1: boolean) => string;
  onToggleHistory: () => void;
  onSetHoveredTurn: (cells: HistoryCell[]) => void;
  onClearHoveredTurn: () => void;
}

interface BotPlayer {
  playBotTurn: () => Promise<void>;
}

interface DebugTools {
  closeDebugPanel: () => void;
  debugReshuffleRack: (player: 1 | 2) => void;
  debugResetHints: () => void;
  debugToggleRevealBotRack: () => void;
  debugToggleAllowMoveLocked: () => void;
  debugSetRack: (player: 1 | 2, lettersString: string) => void;
  debugForceStalemateCheck: () => Promise<void>;
}

interface TopActionBarProps {
  onNewGame: () => void;
  onSaveToFile: () => void;
  onLoadFileClick: () => void;
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  loadDisabled: boolean;
  onToggleHistory: () => void;
}

interface NewGameModalProps {
  onStart: (mode: GameMode, difficulty: BotDifficulty | null) => void;
  onCancel: () => void;
  canCancel: boolean;
}

interface TilesProps {
  cell: Cell;
  onDropLetter: (cell: Cell) => void;
  onDragStartLetter: (cell: Cell) => void;
  onDragEnd: () => void;
  dragging: boolean;
  highlighted: boolean;
  wordCheck: "valid" | "invalid" | null;
  disabled: boolean;
  debugMovable: boolean;
}

interface RackActionsProps {
  pendingCount: number;
  hintsUsed: number;
  validating: boolean;
  gameOver: boolean;
  findingHint: boolean;
  onShuffle: () => void;
  onClear: () => void;
  onHint: () => void;
}

interface RackProps {
  letters: Rack;
  isActive: boolean;
  hideLetters?: boolean;
  selectedIndices: number[];
  dragSource: DragSource | null;
  onToggleSelect: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDrop: (index: number) => void;
}

interface NewGame {
  openNewGameModal: () => void;
  closeNewGameModal: () => void;
  startNewGame: (mode: GameMode, difficulty: BotDifficulty | null) => void;
  endGame: () => void;
  dismissGameOverOffer: () => void;
}

interface MoveActions {
  updateInv: (
    row: number,
    col: number,
    newVal: string,
    oldVal: string,
    newRackIndex: number | null,
    oldRackIndex: number | null,
  ) => void;
  rejectMove: (errorMessage: string | null) => void;
  clearPending: () => void;
  shuffleRackAction: () => void;
  toggleLetterSelect: (index: number) => void;
  submit: () => Promise<void>;
  getPendingScore: () => number | null;
  pendingWordStatus: Map<string, "valid" | "invalid"> | null;
  tradeLetters: () => void;
  passTurn: () => void;
  maybeCheckStalemate: (nextState: GameState) => Promise<void>;
}

interface Hints {
  giveHint: () => Promise<void>;
}

interface FileTransfer {
  persist: (updates: Partial<GameState>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleSaveToFile: () => void;
  handleLoadFileClick: () => void;
  handleFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

interface DragAndDrop {
  handleRackDragStart: (index: number) => void;
  handleBoardDragStart: (cell: Cell) => void;
  handleDragEnd: () => void;
  handleRackDrop: (targetIndex: number) => void;
  handleBoardDrop: (cell: Cell) => void;
}

interface Hexagon {
  baseX: number;
  baseY: number;
  glow: number;
  targetGlow: number;
}

interface Point {
  x: number;
  y: number;
}

interface Sweep {
  start: Point;
  end: Point;
  startTime: number;
  duration: number;
}
