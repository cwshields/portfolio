import { RACK_SIZE } from "../tileBag";

// tutorial blurb, stalemate/game-over banners, turn indicator, trade button,
// and the pass/submit action buttons shown beside the board
function GameSidebar({
  gameOverOffer,
  gameOver,
  p1score,
  p2score,
  playerLabel,
  botTurnActive,
  botThinking,
  botLabel,
  p1turn,
  firstTurn,
  pendingScore,
  validationError,
  selectedCount,
  bagLength,
  validating,
  pendingCount,
  onEndGame,
  onDismissGameOverOffer,
  onTradeLetters,
  onPassTurn,
  onSubmit,
}: GameSidebarProps) {
  return (
    <div className="sidebar">
      <div className="tutorial">
        <h3>How to play</h3>
        Drag letters from your rack onto empty squares to spell a word. Drag
        a placed letter to move it, or drag it back onto your rack to pick
        it back up. The first word must cross the center star; later words
        must connect to the board. DW/TW/DL/TL squares boost newly placed
        letters. Submit checks the dictionary and ends your turn.
      </div>
      {gameOverOffer && !gameOver && (
        <div className="game-over-offer">
          <p>
            Neither player has a legal move left and the tile bag is empty.
          </p>
          <div className="game-over-offer-actions">
            <button onClick={onEndGame} className="icon-button cta-button">
              End Game
            </button>
            <button onClick={onDismissGameOverOffer} className="icon-button">
              Keep Playing
            </button>
          </div>
        </div>
      )}
      {gameOver ? (
        <div className="game-over">
          <h3>Game Over</h3>
          <p>
            {p1score === p2score
              ? `It's a tie, ${p1score} – ${p2score}.`
              : `${playerLabel(p1score > p2score)} wins, ${Math.max(p1score, p2score)} – ${Math.min(p1score, p2score)}!`}
          </p>
        </div>
      ) : (
        <>
          <div className="turn">
            {botTurnActive && botThinking
              ? `${botLabel} is thinking…`
              : `${playerLabel(p1turn)}'s turn`}
            {firstTurn ? " — first word must cover the center ★" : ""}
          </div>
          {pendingScore !== null && (
            <div className="pending-score">
              Current score: {pendingScore}
            </div>
          )}
        </>
      )}
      {validationError && (
        <div className="validation-error">{validationError}</div>
      )}
      {selectedCount > 0 && (
        <button
          onClick={onTradeLetters}
          className="trade-button"
          disabled={
            validating ||
            gameOver ||
            pendingCount > 0 ||
            bagLength < RACK_SIZE
          }
          title={
            bagLength < RACK_SIZE
              ? "Need at least 7 letters left in the pool to trade."
              : ""
          }
        >
          Trade {selectedCount} letter
          {selectedCount > 1 ? "s" : ""}
        </button>
      )}
      <div className="bottom-actions">
        <button
          onClick={onPassTurn}
          className="icon-button skip-button"
          disabled={
            validating || gameOver || pendingCount > 0 || botTurnActive
          }
          title={
            pendingCount > 0 ? "Clear placed tiles before passing." : ""
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 5l7 7-7 7" />
            <path d="M13 5l7 7-7 7" />
          </svg>
          <span>Pass</span>
        </button>
        <button
          onClick={onSubmit}
          className="icon-button cta-button"
          disabled={
            validating || gameOver || pendingCount === 0 || botTurnActive
          }
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>{validating ? "Checking…" : "Submit"}</span>
        </button>
      </div>
    </div>
  );
}

export default GameSidebar;
