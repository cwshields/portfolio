import { StateUpdate } from "../gameState";

export function useDragAndDrop(
  state: GameState,
  patchState: (updates: StateUpdate) => void,
  updateInv: (
    row: number,
    col: number,
    newVal: string,
    oldVal: string,
    newRackIndex: number | null,
    oldRackIndex: number | null,
  ) => void,
): DragAndDrop {
  const { p1turn, p1inv, p2inv, board, dragSource, debugAllowMoveLocked } = state;

  // records which rack letter a drag started from; only meaningful for the
  // active player's own rack
  const handleRackDragStart = (index: number) => {
    patchState({ dragSource: { type: "rack", index } });
  };

  // records that a drag started from an already-placed board tile, so it can
  // be moved elsewhere on the board or back to the rack. Locked (submitted)
  // tiles are normally not draggable at all; debugAllowMoveLocked (debug
  // panel) lifts that restriction so a submitted tile can be repositioned
  const handleBoardDragStart = (cell: Cell) => {
    if (!cell.letter) return;
    if (cell.locked && !debugAllowMoveLocked) return;
    patchState({
      dragSource: {
        type: "board",
        row: cell.row,
        col: cell.col,
        letter: cell.letter,
        rackIndex: cell.rackIndex,
        wasLocked: cell.locked,
      },
    });
  };

  // DEBUG: moves a locked tile's letter directly to another cell (swapping
  // if the target is also occupied); only reachable via debugAllowMoveLocked.
  // Bypasses every normal placement rule and does not touch score/history —
  // it's a raw board edit for testing layout/edge cases
  const debugMoveLockedTile = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (fromRow === toRow && fromCol === toCol) return;
    const source = board[fromRow - 1][fromCol - 1];
    const target = board[toRow - 1][toCol - 1];
    const newBoard = board.map((r) =>
      r.map((cell) => {
        if (cell.row === fromRow && cell.col === fromCol) {
          return { ...cell, letter: target.letter, locked: !!target.letter };
        }
        if (cell.row === toRow && cell.col === toCol) {
          return { ...cell, letter: source.letter, locked: !!source.letter };
        }
        return cell;
      }),
    );
    patchState({ board: newBoard });
  };

  const handleDragEnd = () => {
    patchState({ dragSource: null });
  };

  // drop target is the rack: reorders the rack (rack-origin drag), or returns
  // a placed letter from the board back to the rack (board-origin drag)
  const handleRackDrop = (targetIndex: number) => {
    if (!dragSource) return;

    if (dragSource.type === "board" && dragSource.wasLocked) {
      // debug-only locked-tile drags only reposition within the board
      patchState({ dragSource: null });
      return;
    }

    if (dragSource.type === "rack") {
      const rack = p1turn ? p1inv : p2inv;
      if (dragSource.index === targetIndex || targetIndex >= rack.length) {
        patchState({ dragSource: null });
        return;
      }
      const invKey: "p1inv" | "p2inv" = p1turn ? "p1inv" : "p2inv";
      const newRack = rack.slice();
      [newRack[dragSource.index], newRack[targetIndex]] = [
        newRack[targetIndex],
        newRack[dragSource.index],
      ];
      patchState({ [invKey]: newRack, dragSource: null });
      return;
    }

    updateInv(
      dragSource.row,
      dragSource.col,
      "",
      dragSource.letter,
      null,
      dragSource.rackIndex,
    );
    patchState({ dragSource: null });
  };

  // drop target is a board cell: places a letter dragged from the rack
  // (reusing the same inventory bookkeeping as typing a letter in directly),
  // or moves/swaps a letter dragged from elsewhere on the board
  const handleBoardDrop = (cell: Cell) => {
    if (!dragSource) return;

    if (dragSource.type === "board" && dragSource.wasLocked) {
      debugMoveLockedTile(dragSource.row, dragSource.col, cell.row, cell.col);
      patchState({ dragSource: null });
      return;
    }

    if (cell.locked) {
      patchState({ dragSource: null });
      return;
    }

    if (dragSource.type === "rack") {
      const letter = (p1turn ? p1inv : p2inv)[dragSource.index];
      if (!letter) {
        patchState({ dragSource: null });
        return;
      }
      updateInv(
        cell.row,
        cell.col,
        letter,
        cell.letter || "",
        dragSource.index,
        cell.rackIndex,
      );
      patchState({ dragSource: null });
      return;
    }

    const {
      row: srcRow,
      col: srcCol,
      letter: srcLetter,
      rackIndex: srcRackIndex,
    } = dragSource;
    if (srcRow === cell.row && srcCol === cell.col) {
      patchState({ dragSource: null });
      return;
    }
    const newBoard = board.map((r) =>
      r.map((c) => {
        if (c.row === srcRow && c.col === srcCol) {
          return {
            ...c,
            letter: cell.letter || null,
            pending: !!cell.letter,
            rackIndex: cell.letter ? cell.rackIndex : null,
          };
        }
        if (c.row === cell.row && c.col === cell.col) {
          return {
            ...c,
            letter: srcLetter,
            pending: true,
            rackIndex: srcRackIndex,
          };
        }
        return c;
      }),
    );
    patchState({ board: newBoard, dragSource: null, validationError: null });
  };

  return { handleRackDragStart, handleBoardDragStart, handleDragEnd, handleRackDrop, handleBoardDrop };
}
