import React, { useEffect, useReducer, useRef } from "react";
import "../../styles/ScrabbleGame.scss";
import { Link } from "react-router-dom";
import Tiles from "../ScrabbleGame/Tiles/Tiles";
import { BOARD_SIZE, getBonus, isCenter } from "./boardLayout";
import { createBag, drawTiles, shuffle, SCORES, RACK_SIZE } from "./tileBag";
import {
  getPendingCells,
  countPendingCells,
  validateLineShape,
  validateContiguous,
  validateFirstMove,
  validateConnected,
  extractWords,
} from "./wordFinder";
import { scoreMove } from "./scoring";
import { validateWords } from "./dictionary";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  clearLocalStorage,
  downloadSaveFile,
  readSaveFileAsState,
} from "./persistence";

// creates a fresh 15x15 board, carrying bonus-square info per cell
function buildBoard() {
  const board = [];
  for (let row = 1; row <= BOARD_SIZE; row++) {
    const rowCells = [];
    for (let col = 1; col <= BOARD_SIZE; col++) {
      rowCells.push({
        row,
        col,
        letter: null,
        locked: false,
        pending: false,
        bonus: getBonus(row, col),
        isCenter: isCenter(row, col),
      });
    }
    board.push(rowCells);
  }
  return board;
}

const initialState = {
  // p1turn is to cycle between turns
  p1turn: true,
  // when firstTurn is false, the player will have to use letters currently on the board
  firstTurn: true,
  // p#inv is the players current inventory of letters
  p1inv: [],
  p2inv: [],
  // adds the moveScore to the applicable player once a word is confirmed
  p1score: 0,
  p2score: 0,
  // the board is a 15x15 grid of cell objects: { row, col, letter, locked, pending, bonus, isCenter }
  board: buildBoard(),
  // shared pool of letters both players draw from
  bag: [],
  // true while awaiting the dictionary API response for a submitted word
  validating: false,
  // message shown when a submitted move is rejected, can't be verified,
  // or a file import fails
  validationError: null,
  // indices (within the current player's rack) selected for a letter trade
  selectedIndices: [],
  // the letter currently being dragged, if any: either
  // { type: 'rack', index } or { type: 'board', row, col, letter }
  dragSource: null,
};

// merges partial updates into state, mirroring class-style this.setState(partial);
// also accepts an updater function, mirroring this.setState(prevState => partial)
function stateReducer(state, action) {
  const updates = typeof action === "function" ? action(state) : action;
  return { ...state, ...updates };
}

function ScrabbleGame() {
  const [state, patchState] = useReducer(stateReducer, initialState);
  const {
    p1turn,
    firstTurn,
    p1inv,
    p2inv,
    p1score,
    p2score,
    board,
    bag,
    validating,
    validationError,
    selectedIndices,
    dragSource,
  } = state;
  const fileInputRef = useRef(null);

  // writes the given partial update, merged over current state, to localStorage;
  // used alongside patchState(updates) wherever the class used
  // this.setState(updates, this.autosaveState)
  const persist = (updates) => saveToLocalStorage({ ...state, ...updates });

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      if (window.confirm("Resume your saved Scrabble game?")) {
        patchState(saved);
        return;
      }
      clearLocalStorage();
    }
    const startingBag = createBag();
    const { drawn: p1Rack, remainingBag: r1 } = drawTiles(startingBag, RACK_SIZE);
    const { drawn: p2Rack, remainingBag: r2 } = drawTiles(r1, RACK_SIZE);
    patchState({ bag: r2, p1inv: p1Rack, p2inv: p2Rack });
  }, []);

  const handleSaveToFile = () => {
    downloadSaveFile(state);
  };

  const handleLoadFileClick = () => {
    if (
      !window.confirm("Loading a file will replace your current game. Continue?")
    )
      return;
    fileInputRef.current.click();
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files[0];
    e.target.value = null;
    if (!file) return;
    try {
      const loaded = await readSaveFileAsState(file);
      patchState(loaded);
      saveToLocalStorage(loaded);
    } catch (err) {
      patchState({ validationError: err.message });
    }
  };

  // updates the board with the letter placed/removed at (row, col), and keeps the
  // current player's rack in sync (placing a letter removes it from the rack,
  // clearing a cell returns it)
  const updateInv = (row, col, newVal, oldVal) => {
    if (newVal === oldVal) return;
    const invKey = p1turn ? "p1inv" : "p2inv";
    const inv = (p1turn ? p1inv : p2inv).slice();

    if (newVal) {
      const idx = inv.indexOf(newVal);
      if (idx === -1) return;
      inv.splice(idx, 1);
    }
    if (oldVal) inv.push(oldVal);

    const newBoard = board.map((r) =>
      r.map((cell) =>
        cell.row === row && cell.col === col
          ? { ...cell, letter: newVal || null, pending: !!newVal }
          : cell,
      ),
    );

    patchState({
      board: newBoard,
      [invKey]: inv,
      validationError: null,
      selectedIndices: [],
    });
  };

  // clears pending letters back to empty and returns them to the current player's rack;
  // used when a move is rejected for shape/connectivity/dictionary reasons
  const rejectMove = (errorMessage) => {
    const pendingLetters = getPendingCells(board).map((c) => c.letter);
    const newBoard = board.map((r) =>
      r.map((cell) =>
        cell.pending ? { ...cell, letter: null, pending: false } : cell,
      ),
    );
    const invKey = p1turn ? "p1inv" : "p2inv";
    const inv = (p1turn ? p1inv : p2inv).concat(pendingLetters);
    patchState({
      board: newBoard,
      [invKey]: inv,
      validationError: errorMessage,
      validating: false,
    });
  };

  // locks the pending letters in place, adds the move's score to the current player's
  // total, advances the turn, and refills the current player's rack from the shared bag
  const acceptMove = (moveScore, drawCount) => {
    const newBoard = board.map((r) =>
      r.map((cell) =>
        cell.pending ? { ...cell, locked: true, pending: false } : cell,
      ),
    );
    const { drawn, remainingBag } = drawTiles(bag, drawCount);
    const invKey = p1turn ? "p1inv" : "p2inv";
    const inv = (p1turn ? p1inv : p2inv).concat(drawn);
    const scoreKey = p1turn ? "p1score" : "p2score";

    const updates = {
      board: newBoard,
      bag: remainingBag,
      [invKey]: inv,
      [scoreKey]: (p1turn ? p1score : p2score) + moveScore,
      p1turn: !p1turn,
      firstTurn: false,
      validating: false,
      validationError: null,
      selectedIndices: [],
    };
    patchState(updates);
    persist(updates);
  };

  // toggles whether a rack letter (by index in the current player's rack) is
  // selected for a trade; only meaningful for the active player's own rack
  const toggleLetterSelect = (index) => {
    patchState((prev) => ({
      selectedIndices: prev.selectedIndices.includes(index)
        ? prev.selectedIndices.filter((i) => i !== index)
        : [...prev.selectedIndices, index],
    }));
  };

  // records which rack letter a drag started from; only meaningful for the
  // active player's own rack
  const handleRackDragStart = (index) => {
    patchState({ dragSource: { type: "rack", index } });
  };

  // records that a drag started from an already-placed (pending, unlocked)
  // board tile, so it can be moved elsewhere on the board or back to the rack
  const handleBoardDragStart = (cell) => {
    if (cell.locked || !cell.letter) return;
    patchState({
      dragSource: {
        type: "board",
        row: cell.row,
        col: cell.col,
        letter: cell.letter,
      },
    });
  };

  const handleDragEnd = () => {
    patchState({ dragSource: null });
  };

  // drop target is the rack: reorders the rack (rack-origin drag), or returns
  // a placed letter from the board back to the rack (board-origin drag)
  const handleRackDrop = (targetIndex) => {
    if (!dragSource) return;

    if (dragSource.type === "rack") {
      if (dragSource.index === targetIndex) {
        patchState({ dragSource: null });
        return;
      }
      const invKey = p1turn ? "p1inv" : "p2inv";
      const rack = (p1turn ? p1inv : p2inv).slice();
      const [moved] = rack.splice(dragSource.index, 1);
      rack.splice(targetIndex, 0, moved);
      patchState({ [invKey]: rack, dragSource: null });
      return;
    }

    updateInv(dragSource.row, dragSource.col, "", dragSource.letter);
    patchState({ dragSource: null });
  };

  // drop target is a board cell: places a letter dragged from the rack
  // (reusing the same inventory bookkeeping as typing a letter in directly),
  // or moves/swaps a letter dragged from elsewhere on the board
  const handleBoardDrop = (cell) => {
    if (!dragSource || cell.locked) {
      patchState({ dragSource: null });
      return;
    }

    if (dragSource.type === "rack") {
      const letter = (p1turn ? p1inv : p2inv)[dragSource.index];
      if (!letter) {
        patchState({ dragSource: null });
        return;
      }
      updateInv(cell.row, cell.col, letter, cell.letter || "");
      patchState({ dragSource: null });
      return;
    }

    const { row: srcRow, col: srcCol, letter: srcLetter } = dragSource;
    if (srcRow === cell.row && srcCol === cell.col) {
      patchState({ dragSource: null });
      return;
    }
    const newBoard = board.map((r) =>
      r.map((c) => {
        if (c.row === srcRow && c.col === srcCol) {
          return { ...c, letter: cell.letter || null, pending: !!cell.letter };
        }
        if (c.row === cell.row && c.col === cell.col) {
          return { ...c, letter: srcLetter, pending: true };
        }
        return c;
      }),
    );
    patchState({ board: newBoard, dragSource: null, validationError: null });
  };

  // returns the selected letters to the bag, shuffles, and draws the same number
  // of replacements for the current player; costs the player their turn
  const tradeLetters = () => {
    if (selectedIndices.length === 0 || bag.length < RACK_SIZE) return;
    const rack = p1turn ? p1inv : p2inv;
    const invKey = p1turn ? "p1inv" : "p2inv";
    const selectedSet = new Set(selectedIndices);
    const keptLetters = rack.filter((_, i) => !selectedSet.has(i));
    const returnedLetters = rack.filter((_, i) => selectedSet.has(i));
    const refreshedBag = shuffle(bag.concat(returnedLetters));
    const { drawn, remainingBag } = drawTiles(
      refreshedBag,
      returnedLetters.length,
    );

    const updates = {
      [invKey]: keptLetters.concat(drawn),
      bag: remainingBag,
      p1turn: !p1turn,
      selectedIndices: [],
      validationError: null,
    };
    patchState(updates);
    persist(updates);
  };

  // skips the current player's turn without placing any tiles; only allowed
  // when no letters are currently pending on the board
  const passTurn = () => {
    if (validating || countPendingCells(board) > 0) return;
    const updates = {
      p1turn: !p1turn,
      validationError: null,
      selectedIndices: [],
    };
    patchState(updates);
    persist(updates);
  };

  // rebuilds the whole game from scratch after the player confirms
  const resetGame = () => {
    if (
      !window.confirm(
        "Reset the game? This will clear the board and start a new match.",
      )
    )
      return;
    const newBag = createBag();
    const { drawn: p1Rack, remainingBag: r1 } = drawTiles(newBag, RACK_SIZE);
    const { drawn: p2Rack, remainingBag: r2 } = drawTiles(r1, RACK_SIZE);
    const updates = {
      p1turn: true,
      firstTurn: true,
      p1inv: p1Rack,
      p2inv: p2Rack,
      p1score: 0,
      p2score: 0,
      board: buildBoard(),
      bag: r2,
      validating: false,
      validationError: null,
      selectedIndices: [],
    };
    patchState(updates);
    persist(updates);
  };

  const submit = async () => {
    if (validating) return;
    const pendingCells = getPendingCells(board);

    const line = validateLineShape(pendingCells);
    if (!line.valid) return rejectMove(line.error);

    const contig = validateContiguous(board, pendingCells, line.orientation);
    if (!contig.valid) return rejectMove(contig.error);

    if (firstTurn) {
      const fm = validateFirstMove(pendingCells);
      if (!fm.valid) return rejectMove(fm.error);
    } else {
      const conn = validateConnected(board, pendingCells);
      if (!conn.valid) return rejectMove(conn.error);
    }

    const wordsResult = extractWords(board, pendingCells, line.orientation);
    if (!wordsResult.valid) return rejectMove(wordsResult.error);
    const formedWords = wordsResult.words;

    patchState({ validating: true, validationError: null });
    let results;
    try {
      results = await validateWords(formedWords.map((w) => w.word));
    } catch (e) {
      patchState({
        validating: false,
        validationError: "Network error — please try submitting again.",
      });
      return;
    }

    const networkFailure = results.find((r) => r.error === "network");
    if (networkFailure) {
      patchState({
        validating: false,
        validationError: `Couldn't verify "${networkFailure.word.toUpperCase()}" — network error, try again.`,
      });
      return;
    }
    const invalidWord = results.find((r) => !r.valid);
    if (invalidWord) {
      patchState({ validating: false });
      return rejectMove(
        `"${invalidWord.word.toUpperCase()}" is not a valid word.`,
      );
    }

    const moveScore = scoreMove(formedWords);
    acceptMove(moveScore, pendingCells.length);
  };

  // computes what the current pending placement would score if submitted right now;
  // returns null when the placement isn't (yet) a valid, scoreable word shape, mirroring
  // the shape/connectivity checks in submit() but skipping the dictionary lookup
  const getPendingScore = () => {
    const pendingCells = getPendingCells(board);
    if (pendingCells.length === 0) return null;

    const line = validateLineShape(pendingCells);
    if (!line.valid) return null;

    const contig = validateContiguous(board, pendingCells, line.orientation);
    if (!contig.valid) return null;

    if (firstTurn) {
      if (!validateFirstMove(pendingCells).valid) return null;
    } else if (!validateConnected(board, pendingCells).valid) {
      return null;
    }

    const wordsResult = extractWords(board, pendingCells, line.orientation);
    if (!wordsResult.valid) return null;

    return scoreMove(wordsResult.words);
  };

  // renders a player's rack; only the active player's letters are selectable for a
  // trade and draggable (to reorder within the rack or drop onto the board)
  const renderRack = (letters, isActive) => (
    <div
      className="letters"
      onDragOver={isActive ? (e) => e.preventDefault() : undefined}
      onDrop={
        isActive
          ? (e) => {
              e.preventDefault();
              handleRackDrop(letters.length);
            }
          : undefined
      }
    >
      {letters.map((letter, index) => {
        const selected = isActive && selectedIndices.includes(index);
        const dragging =
          isActive &&
          dragSource &&
          dragSource.type === "rack" &&
          dragSource.index === index;
        return (
          <div
            key={index}
            className={`letter${isActive ? " selectable" : ""}${selected ? " selected" : ""}${dragging ? " dragging" : ""}`}
            onClick={isActive ? () => toggleLetterSelect(index) : undefined}
            draggable={isActive}
            onDragStart={isActive ? () => handleRackDragStart(index) : undefined}
            onDragEnd={isActive ? handleDragEnd : undefined}
            onDragOver={isActive ? (e) => e.preventDefault() : undefined}
            onDrop={
              isActive
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRackDrop(index);
                  }
                : undefined
            }
          >
            {letter}
            <span className="letter-value">{SCORES[letter]}</span>
          </div>
        );
      })}
    </div>
  );

  const pendingCount = countPendingCells(board);
  const pendingScore = getPendingScore();

  return (
    <div className="scrabble-game">
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
        <button onClick={resetGame} className="icon-button" title="Reset game" aria-label="Reset game">
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 1 2.64 6.36" />
            <path d="M3 21v-6h6" />
          </svg>
          <span>New Game</span>
        </button>
        <button
          onClick={handleSaveToFile}
          className="icon-button"
          title="Save to file"
          aria-label="Save to file"
        >
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          <span>Save</span>
        </button>
        <button
          onClick={handleLoadFileClick}
          className="icon-button"
          title="Load from file"
          aria-label="Load from file"
          disabled={validating}
        >
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
          onChange={handleFileSelected}
          className="file-input"
        />
      </div>
      <div className="letters-left">Tiles left: {bag.length}</div>
      <div className="score">Score: {p1score}</div>
      {renderRack(p1inv, p1turn)}
      <div className="tile-wrap">
        <div className="tile-container">
          {board.map((row) =>
            row.map((cell) => (
              <Tiles
                key={`${cell.col},${cell.row}`}
                cell={cell}
                onDropLetter={handleBoardDrop}
                onDragStartLetter={handleBoardDragStart}
                onDragEnd={handleDragEnd}
                dragging={
                  !!dragSource &&
                  dragSource.type === "board" &&
                  dragSource.row === cell.row &&
                  dragSource.col === cell.col
                }
                disabled={validating}
              />
            )),
          )}
        </div>
        <div className="sidebar">
          <div className="tutorial">
            <h3>How to play</h3>
            Drag letters from your rack onto empty squares to spell a word. Drag
            a placed letter to move it, or drag it back onto your rack to pick
            it back up. The first word must cross the center star; later words
            must connect to the board. DW/TW/DL/TL squares boost newly placed
            letters. Submit checks the dictionary and ends your turn.
          </div>
          {selectedIndices.length > 0 && (
            <button
              onClick={tradeLetters}
              className="trade-button"
              disabled={
                validating || pendingCount > 0 || bag.length < RACK_SIZE
              }
              title={
                bag.length < RACK_SIZE
                  ? "Need at least 7 letters left in the pool to trade."
                  : ""
              }
            >
              Trade {selectedIndices.length} letter
              {selectedIndices.length > 1 ? "s" : ""}
            </button>
          )}
          <div className="turn">
            Player {p1turn ? 1 : 2}'s turn
            {firstTurn ? " — first word must cover the center ★" : ""}
          </div>
          <div className="pending-count">Tiles placed: {pendingCount}</div>
          {pendingScore !== null && (
            <div className="pending-score">Current score: {pendingScore}</div>
          )}
          {validationError && (
            <div className="validation-error">{validationError}</div>
          )}
          <div className="bottom-actions">
            <button
              onClick={passTurn}
              className="icon-button skip-button"
              disabled={validating || pendingCount > 0}
              title={
                pendingCount > 0 ? "Clear placed tiles before passing." : ""
              }
            >
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 5l7 7-7 7" />
                <path d="M13 5l7 7-7 7" />
              </svg>
              <span>Pass</span>
            </button>
            <button
              onClick={submit}
              className="icon-button cta-button"
              disabled={validating || pendingCount === 0}
            >
              <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>{validating ? "Checking…" : "Submit"}</span>
            </button>
          </div>
        </div>
      </div>
      {renderRack(p2inv, !p1turn)}
      <div className="score">Score: {p2score}</div>
    </div>
  );
}

export default ScrabbleGame;
