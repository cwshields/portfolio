import React from "react";
import { HistoryCell, MoveHistoryEntry } from "../types";

interface HistoryPanelProps {
  showHistory: boolean;
  moveHistory: MoveHistoryEntry[];
  playerLabel: (isP1: boolean) => string;
  onToggleHistory: () => void;
  onSetHoveredTurn: (cells: HistoryCell[]) => void;
  onClearHoveredTurn: () => void;
}

// sidebar listing every turn played so far, latest first; hovering a row
// highlights that turn's words on the board via onSetHoveredTurn
function HistoryPanel({
  showHistory,
  moveHistory,
  playerLabel,
  onToggleHistory,
  onSetHoveredTurn,
  onClearHoveredTurn,
}: HistoryPanelProps) {
  return (
    <div className={`history-panel${showHistory ? " open" : ""}`}>
      <div className="history-panel-header">
        <h3>Turn history</h3>
        <button
          onClick={onToggleHistory}
          className="icon-button round-icon-button"
          title="Close turn history"
          aria-label="Close turn history"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      {moveHistory.length === 0 ? (
        <div className="history-empty">No turns played yet.</div>
      ) : (
        <div className="history-list">
          {moveHistory
            .map((entry, index) => ({ entry, index }))
            .reverse()
            .map(({ entry, index }) => (
              <div
                key={index}
                className="history-row"
                onMouseEnter={
                  entry.cells.length > 0
                    ? () => onSetHoveredTurn(entry.cells)
                    : undefined
                }
                onMouseLeave={
                  entry.cells.length > 0 ? onClearHoveredTurn : undefined
                }
              >
                <div className="history-row-header">
                  <span>{playerLabel(entry.player === 1)}</span>
                  <span>Turn {index + 1}</span>
                </div>
                {entry.type === "play" && (
                  <>
                    <div className="history-row-words">
                      {entry.words.map((w) => w.word.toUpperCase()).join(", ")}
                    </div>
                    <div className="history-row-score">+{entry.score} pts</div>
                  </>
                )}
                {entry.type === "pass" && (
                  <div className="history-row-meta">Passed</div>
                )}
                {entry.type === "trade" && (
                  <div className="history-row-meta">
                    Traded {entry.count} letter{(entry.count as number) > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPanel;
