import React, { useState } from "react";

const DIFFICULTIES: BotDifficulty[] = ["easy", "medium", "hard"];

// player/difficulty picker shown before a game starts; onStart receives
// ('1p' | '2p', difficulty | null) so the caller can build a fresh game
function NewGameModal({ onStart, onCancel, canCancel }: NewGameModalProps) {
  const [playerCount, setPlayerCount] = useState(2);
  const [difficulty, setDifficulty] = useState<BotDifficulty>("medium");

  const handleStart = () => {
    onStart(playerCount === 1 ? "1p" : "2p", playerCount === 1 ? difficulty : null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>New Game</h3>
        <div className="modal-section">
          <div className="modal-label">Players</div>
          <div className="modal-options">
            <button
              type="button"
              className={`modal-option${playerCount === 1 ? " selected" : ""}`}
              onClick={() => setPlayerCount(1)}
            >
              1 Player
            </button>
            <button
              type="button"
              className={`modal-option${playerCount === 2 ? " selected" : ""}`}
              onClick={() => setPlayerCount(2)}
            >
              2 Players
            </button>
          </div>
        </div>
        {playerCount === 1 && (
          <div className="modal-section">
            <div className="modal-label">Bot difficulty</div>
            <div className="modal-options">
              {DIFFICULTIES.map((level) => (
                <button
                  type="button"
                  key={level}
                  className={`modal-option${difficulty === level ? " selected" : ""}`}
                  onClick={() => setDifficulty(level)}
                >
                  {level[0].toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="modal-actions">
          {canCancel && (
            <button type="button" onClick={onCancel} className="icon-button">
              Cancel
            </button>
          )}
          <button type="button" onClick={handleStart} className="icon-button cta-button">
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewGameModal;
