import React, { Component } from "react";
import { SCORES } from '../tileBag';

class Tiles extends Component {
  handleDragStart = () => {
    const { cell, onDragStartLetter } = this.props
    onDragStartLetter(cell)
  }

  handleDragEnd = () => {
    this.props.onDragEnd()
  }

  handleDragOver = (e) => {
    const { disabled, cell } = this.props
    if (disabled || cell.locked) return
    e.preventDefault()
  }

  handleDrop = (e) => {
    const { disabled, cell, onDropLetter } = this.props
    if (disabled || cell.locked) return
    e.preventDefault()
    onDropLetter(cell)
  }

  render() {
    const { cell, disabled, dragging } = this.props

    if (cell.locked) {
      return (
        <div className="tile-div locked">
          <span className="tile locked-tile">{cell.letter.toUpperCase()}</span>
          <span className="letter-value">{SCORES[cell.letter]}</span>
        </div>
      );
    }

    const bonusClass = cell.bonus ? ` bonus-${cell.bonus.toLowerCase()}` : ''
    const centerClass = cell.isCenter ? ' center-square' : ''
    const draggingClass = dragging ? ' dragging' : ''
    const isDraggable = !disabled && !!cell.letter

    return (
      <div
        className={`tile-div${bonusClass}${centerClass}${draggingClass}`}
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
