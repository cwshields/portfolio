import { shuffle } from "./tileBag";

// how much of a difficulty's move pool to skip from the top of the best-first
// ranked move list, and how many candidates wide that pool is; easy draws from
// the weak tail of legal moves, hard draws from the strongest few
const BOT_DIFFICULTY_POOLS: Record<BotDifficulty, { skip: number; size: number }> = {
  easy: { skip: 0.65, size: 6 },
  medium: { skip: 0.3, size: 8 },
  hard: { skip: 0, size: 3 },
};

// picks a shuffled slice of ranked (best-score-first) legal moves appropriate
// to the bot's difficulty, for the caller to walk in search of one that also
// verifies against the live dictionary API
export function pickBotMovePool(rankedMoves: RankedMove[], difficulty: BotDifficulty | null): RankedMove[] {
  if (rankedMoves.length === 0) return [];
  const { skip, size } =
    BOT_DIFFICULTY_POOLS[difficulty as BotDifficulty] || BOT_DIFFICULTY_POOLS.medium;
  const startIdx = Math.min(
    Math.floor(rankedMoves.length * skip),
    rankedMoves.length - 1,
  );
  return shuffle(rankedMoves.slice(startIdx, startIdx + size));
}

// how many of the top ranked candidates to keep for the debug panel's bot
// move inspector
const BOT_LOG_TOP_COUNT = 8;

// snapshot of a completed bot move search, for the debug panel's inspector
export function buildBotMoveLog({ difficulty, rackSize, rankedMoves, poolCount, move, outcome }: BuildBotMoveLogParams): DebugBotMoveLog {
  return {
    difficulty,
    rackSize,
    rankedCount: rankedMoves.length,
    poolCount,
    top: rankedMoves.slice(0, BOT_LOG_TOP_COUNT).map((m) => ({
      word: m.words.map((w) => w.word).join("/"),
      score: m.score,
    })),
    chosen: move ? { word: move.words.map((w) => w.word).join("/"), score: move.score } : null,
    outcome,
  };
}
