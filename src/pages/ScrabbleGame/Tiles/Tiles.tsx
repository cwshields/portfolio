import React, { Component } from "react";
import { SCORES } from '../tileBag';
import { Cell } from '../types';

interface TilesProps {
  cell: Cell;
  onDropLetter: (cell: Cell) => void;
  onDragStartLetter: (cell: Cell) => void;
  onDragEnd: () => void;
  dragging: boolean;
  highlighted: boolean;
  wordCheck: 'valid' | 'invalid' | null;
  disabled: boolean;
  debugMovable: boolean;
}

class Tiles extends Component<TilesProps> {
  handleDragStart = () => {
    const { cell, onDragStartLetter } = this.props
    onDragStartLetter(cell)
  }

  handleDragEnd = () => {
    this.props.onDragEnd()
  }

  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    const { disabled, cell, debugMovable } = this.props
    if (disabled || (cell.locked && !debugMovable)) return
    e.preventDefault()
  }

  handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const { disabled, cell, onDropLetter, debugMovable } = this.props
    if (disabled || (cell.locked && !debugMovable)) return
    e.preventDefault()
    onDropLetter(cell)
  }

  render() {
    const { cell, disabled, dragging, highlighted, wordCheck, debugMovable } = this.props
    const highlightClass = highlighted ? ' highlighted' : ''
    const wordCheckClass = wordCheck ? ` word-${wordCheck}` : ''

    if (cell.locked) {
      const draggingClass = dragging ? ' dragging' : ''
      return (
        <div
          className={`tile-div locked${draggingClass}${highlightClass}${wordCheckClass}`}
          draggable={!!debugMovable}
          onDragStart={debugMovable ? this.handleDragStart : undefined}
          onDragEnd={debugMovable ? this.handleDragEnd : undefined}
          onDragOver={this.handleDragOver}
          onDrop={this.handleDrop}
        >
          <span className="tile locked-tile">{(cell.letter as string).toUpperCase()}</span>
          <span className="letter-value">{SCORES[cell.letter as string]}</span>
        </div>
      );
    }

    const bonusClass = cell.bonus ? ` bonus-${cell.bonus.toLowerCase()}` : ''
    const centerClass = cell.isCenter ? ' center-square' : ''
    const draggingClass = dragging ? ' dragging' : ''
    const isDraggable = !disabled && !!cell.letter

    return (
      <div
        className={`tile-div${bonusClass}${centerClass}${draggingClass}${highlightClass}${wordCheckClass}`}
        draggable={isDraggable}
        onDragStart={isDraggable ? this.handleDragStart : undefined}
        onDragEnd={isDraggable ? this.handleDragEnd : undefined}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <span className="tile">
          { !cell.letter && cell.isCenter && <span className="bonus-label star">★</span> }
          { !cell.letter && !cell.isCenter && cell.bonus && <span className="bonus-label">{cell.bonus}</span> }
          { cell.letter && <span className="pending-letter">{cell.letter.toUpperCase()}</span> }
        </span>
        { cell.letter && <span className="letter-value">{SCORES[cell.letter]}</span> }
      </div>
    );
  }

}

export default Tiles;
