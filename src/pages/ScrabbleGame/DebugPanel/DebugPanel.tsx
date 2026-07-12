import React, { useState } from "react";
import { BotDifficulty, DebugBotMoveLog, GameMode, Rack } from '../types';

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

// hidden developer panel (toggled via Ctrl+Shift+D) for poking at game state
// directly while testing: redrawing either player's rack from the bag,
// resetting hints, repositioning already-submitted tiles, revealing the
// bot's rack, viewing/forcing arbitrary racks, viewing the bag's remaining
// letters, running the stalemate check on demand, and inspecting the bot's
// last move
function DebugPanel({
  p1inv,
  p2inv,
  bag,
  gameMode,
  botDifficulty,
  p1Label,
  p2Label,
  debugRevealBotRack,
  debugAllowMoveLocked,
  debugBotMoveLog,
  onClose,
  onReshuffleRack,
  onResetHints,
  onToggleRevealBotRack,
  onToggleAllowMoveLocked,
  onForceStalemateCheck,
  onSetRack,
}: DebugPanelProps) {
  const [p1RackInput, setP1RackInput] = useState("");
  const [p2RackInput, setP2RackInput] = useState("");
  const [showBagContents, setShowBagContents] = useState(false);

  const applyRack = (player: 1 | 2) => {
    const value = player === 1 ? p1RackInput : p2RackInput;
    if (!value.trim()) return;
    onSetRack(player, value);
    if (player === 1) setP1RackInput("");
    else setP2RackInput("");
  };

  const bagLetterCounts = () => {
    const counts: Record<string, number> = {};
    bag.forEach((l) => {
      counts[l] = (counts[l] || 0) + 1;
    });
    return Object.keys(counts)
      .sort()
      .map((l) => `${l.toUpperCase()}:${counts[l]}`)
      .join("  ");
  };

  return (
    <div className="debug-panel">
      <div className="debug-panel-header">
        <h3>Debug tools</h3>
        <button
          onClick={onClose}
          className="icon-button round-icon-button"
          title="Close debug panel (Ctrl+Shift+D)"
          aria-label="Close debug panel"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <div className="debug-section">
        <div className="debug-label">Tile bag ({bag.length} left)</div>
        <div className="debug-stack">
          <button className="debug-button" onClick={() => onReshuffleRack(1)}>
            Reshuffle {p1Label}'s rack
          </button>
          <button className="debug-button" onClick={() => onReshuffleRack(2)}>
            Reshuffle {p2Label}'s rack
          </button>
        </div>
        <label className="debug-toggle debug-toggle-spaced">
          <input
            type="checkbox"
            checked={showBagContents}
            onChange={() => setShowBagContents((v) => !v)}
          />
          Show bag contents
        </label>
        {showBagContents && (
          <div className="debug-bag-contents">
            {bag.length > 0 ? bagLetterCounts() : "(empty)"}
          </div>
        )}
      </div>

      <div className="debug-section">
        <div className="debug-label">Hints</div>
        <button className="debug-button" onClick={onResetHints}>
          Reset both players' hints
        </button>
      </div>

      <div className="debug-section">
        <label className="debug-toggle">
          <input
            type="checkbox"
            checked={debugAllowMoveLocked}
            onChange={onToggleAllowMoveLocked}
          />
          Allow moving submitted (locked) tiles
        </label>
      </div>

      {gameMode === "1p" && (
        <div className="debug-section">
          <label className="debug-toggle">
            <input
              type="checkbox"
              checked={debugRevealBotRack}
              onChange={onToggleRevealBotRack}
            />
            Reveal bot's rack
          </label>
        </div>
      )}

      <div className="debug-section">
        <div className="debug-label">Set Player 1 rack (up to 7 letters)</div>
        <div className="debug-row">
          <input
            type="text"
            className="debug-input"
            value={p1RackInput}
            onChange={(e) => setP1RackInput(e.target.value)}
            placeholder={p1inv.filter(Boolean).join("").toUpperCase() || "—"}
            maxLength={7}
          />
          <button className="debug-button" onClick={() => applyRack(1)}>
            Set
          </button>
        </div>
      </div>

      <div className="debug-section">
        <div className="debug-label">Set Player 2 rack (up to 7 letters)</div>
        <div className="debug-row">
          <input
            type="text"
            className="debug-input"
            value={p2RackInput}
            onChange={(e) => setP2RackInput(e.target.value)}
            placeholder={p2inv.filter(Boolean).join("").toUpperCase() || "—"}
            maxLength={7}
          />
          <button className="debug-button" onClick={() => applyRack(2)}>
            Set
          </button>
        </div>
      </div>

      <div className="debug-section">
        <button className="debug-button" onClick={onForceStalemateCheck}>
          Force stalemate check
        </button>
      </div>

      {gameMode === "1p" && (
        <div className="debug-section">
          <div className="debug-label">
            Last bot move ({botDifficulty || "—"})
          </div>
          {debugBotMoveLog ? (
            <div className="debug-bot-log">
              <div>
                Rack size: {debugBotMoveLog.rackSize}, legal moves found:{" "}
                {debugBotMoveLog.rankedCount}, pool size:{" "}
                {debugBotMoveLog.poolCount}
              </div>
              <div>
                Outcome: {debugBotMoveLog.outcome}
                {debugBotMoveLog.chosen
                  ? ` — ${debugBotMoveLog.chosen.word.toUpperCase()} (+${debugBotMoveLog.chosen.score})`
                  : ""}
              </div>
              <div className="debug-bot-log-top">
                <div>Top candidates:</div>
                <ol>
                  {debugBotMoveLog.top.map((m, i) => (
                    <li key={i}>
                      {m.word.toUpperCase()} — {m.score}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="debug-empty">No bot move played yet this game.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default DebugPanel;
