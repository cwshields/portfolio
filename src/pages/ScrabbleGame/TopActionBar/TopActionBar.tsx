import React from "react";
import { Link } from "react-router-dom";

interface TopActionBarProps {
  onNewGame: () => void;
  onSaveToFile: () => void;
  onLoadFileClick: () => void;
  onFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  loadDisabled: boolean;
  onToggleHistory: () => void;
}

// back link plus the New Game / Save / Load / History buttons shown above the board
function TopActionBar({
  onNewGame,
  onSaveToFile,
  onLoadFileClick,
  onFileSelected,
  fileInputRef,
  loadDisabled,
  onToggleHistory,
}: TopActionBarProps) {
  return (
    <>
      <Link to="/home" className="back">
        <svg
          className="arrow"
          viewBox="0 0 75 75"
          xmlns="http://www.w3.org/2000/svg"
          aria-labelledby="back-button"
        >
          <path
            d="m32 56c1.104 0 2-.896 2-2v-39.899l14.552 15.278c.393.413.92.621 1.448.621.495
                    0 .992-.183 1.379-.552.8-.762.831-2.028.069-2.828l-16.619-17.448c-.756-.755-1.76-1.172-2.829-1.172s-2.073.417-2.862
                    1.207l-16.586 17.414c-.762.8-.731 2.066.069 2.828s2.067.731 2.828-.069l14.551-15.342v39.962c0 1.104.896 2 2 2z"
          />
          <div id="back-button" className="display-none">
            Back Button
          </div>
        </svg>
      </Link>
      <div className="top-actions">
        <button
          onClick={onNewGame}
          className="icon-button"
          title="New game"
          aria-label="New game"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 1 2.64 6.36" />
            <path d="M3 21v-6h6" />
          </svg>
          <span>New Game</span>
        </button>
        <button
          onClick={onSaveToFile}
          className="icon-button"
          title="Save to file"
          aria-label="Save to file"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          <span>Save</span>
        </button>
        <button
          onClick={onLoadFileClick}
          className="icon-button"
          title="Load from file"
          aria-label="Load from file"
          disabled={loadDisabled}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21V9" />
            <path d="M7 14l5-5 5 5" />
            <path d="M5 3h14" />
          </svg>
          <span>Load</span>
        </button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          onChange={onFileSelected}
          className="file-input"
        />
        <button
          onClick={onToggleHistory}
          className="icon-button"
          title="Turn history"
          aria-label="Toggle turn history"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
          </svg>
          <span>History</span>
        </button>
      </div>
    </>
  );
}

export default TopActionBar;
