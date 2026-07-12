import React from "react";
import { SCORES } from "../tileBag";
import { DragSource, Rack as RackType } from "../types";

interface RackProps {
  letters: RackType;
  isActive: boolean;
  hideLetters?: boolean;
  selectedIndices: number[];
  dragSource: DragSource | null;
  onToggleSelect: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
  onDrop: (index: number) => void;
}

// renders a player's rack; only the active player's letters are selectable for a
// trade and draggable (to reorder within the rack or drop onto the board).
// hideLetters shows face-down tiles instead of real letters, used for the
// bot's rack in '1p' mode so the human can't see its hand
function Rack({
  letters,
  isActive,
  hideLetters = false,
  selectedIndices,
  dragSource,
  onToggleSelect,
  onDragStart,
  onDragEnd,
  onDrop,
}: RackProps) {
  // a hidden (bot) rack is never a valid drag source or drop target,
  // regardless of whose turn it is
  const interactive = isActive && !hideLetters;
  return (
    <div
      className="letters"
      onDragOver={interactive ? (e) => e.preventDefault() : undefined}
      onDrop={
        interactive
          ? (e) => {
              e.preventDefault();
              onDrop(letters.length);
            }
          : undefined
      }
    >
      {letters.map((letter, index) => {
        if (!letter) {
          // a played letter's slot: kept empty (rather than removed) so the
          // rest of the rack doesn't shift, until a redraw or undo fills it
          return (
            <div
              key={index}
              className="letter empty"
              onDragOver={interactive ? (e) => e.preventDefault() : undefined}
              onDrop={
                interactive
                  ? (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDrop(index);
                    }
                  : undefined
              }
            />
          );
        }
        if (hideLetters) {
          return <div key={index} className="letter hidden-letter" />;
        }
        const selected = isActive && selectedIndices.includes(index);
        const dragging =
          isActive &&
          !!dragSource &&
          dragSource.type === "rack" &&
          dragSource.index === index;
        return (
          <div
            key={index}
            className={`letter${isActive ? " selectable" : ""}${selected ? " selected" : ""}${dragging ? " dragging" : ""}`}
            onClick={isActive ? () => onToggleSelect(index) : undefined}
            draggable={isActive}
            onDragStart={isActive ? () => onDragStart(index) : undefined}
            onDragEnd={isActive ? onDragEnd : undefined}
            onDragOver={isActive ? (e) => e.preventDefault() : undefined}
            onDrop={
              isActive
                ? (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDrop(index);
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
}

export default Rack;
