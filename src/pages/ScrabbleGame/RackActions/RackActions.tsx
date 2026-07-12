import React from "react";
import { HINT_LIMIT } from "../gameState";

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

// small icon-only buttons shown next to the active player's rack: shuffle
// reorders their letters, clear resets any letters they've placed but not submitted,
// and hint offers one of the active player's better available moves, up to HINT_LIMIT uses
function RackActions({
  pendingCount,
  hintsUsed,
  validating,
  gameOver,
  findingHint,
  onShuffle,
  onClear,
  onHint,
}: RackActionsProps) {
  const hintsRemaining = HINT_LIMIT - hintsUsed;
  return (
    <div className="rack-actions">
      <button
        onClick={onShuffle}
        className="icon-button round-icon-button"
        title="Shuffle your letters"
        aria-label="Shuffle your letters"
        disabled={validating || gameOver}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.8-1.1 2-1.7 3.3-1.7H22" />
          <path d="m18 2 4 4-4 4" />
          <path d="M2 6h1.4c1.3 0 2.5.6 3.3 1.7l6.1 8.6c.8 1.1 2 1.7 3.3 1.7H22" />
          <path d="m18 14 4 4-4 4" />
        </svg>
      </button>
      <button
        onClick={onClear}
        className="icon-button round-icon-button"
        title="Clear placed letters"
        aria-label="Clear placed letters"
        disabled={validating || gameOver || pendingCount === 0}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
          <path d="M22 21H7" />
          <path d="m5 11 9 9" />
        </svg>
      </button>
      <button
        onClick={onHint}
        className="icon-button round-icon-button"
        title={
          pendingCount > 0
            ? "Clear placed tiles before requesting a hint."
            : findingHint
              ? "Finding a hint…"
              : hintsRemaining <= 0
                ? "No hints left."
                : `Get a hint (${hintsRemaining} left)`
        }
        aria-label="Get a hint"
        disabled={
          validating ||
          findingHint ||
          gameOver ||
          pendingCount > 0 ||
          hintsRemaining <= 0
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z" />
        </svg>
      </button>
      <span className="hint-counter" title="Hints remaining">
        {Math.max(hintsRemaining, 0)}/{HINT_LIMIT}
      </span>
    </div>
  );
}

export default RackActions;
