import React from "react";
import Tiles from "../Tiles/Tiles";
import { Board, Cell, DragSource } from "../types";

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

// the 15x15 grid of board tiles
function BoardGrid({
  board,
  dragSource,
  highlightedCellKeys,
  pendingWordStatus,
  disabled,
  debugMovable,
  onDropLetter,
  onDragStartLetter,
  onDragEnd,
}: BoardGridProps) {
  return (
    <div className="tile-container">
      {board.map((row) =>
        row.map((cell) => (
          <Tiles
            key={`${cell.col},${cell.row}`}
            cell={cell}
            onDropLetter={onDropLetter}
            onDragStartLetter={onDragStartLetter}
            onDragEnd={onDragEnd}
            dragging={
              !!dragSource &&
              dragSource.type === "board" &&
              dragSource.row === cell.row &&
              dragSource.col === cell.col
            }
            highlighted={
              !!highlightedCellKeys &&
              highlightedCellKeys.has(`${cell.row},${cell.col}`)
            }
            wordCheck={
              pendingWordStatus
                ? pendingWordStatus.get(`${cell.row},${cell.col}`) ?? null
                : null
            }
            disabled={disabled}
            debugMovable={debugMovable}
          />
        )),
      )}
    </div>
  );
}

export default BoardGrid;
