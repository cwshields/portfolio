import React, { useReducer } from "react";
import "../../styles/ScrabbleGame.scss";
import BoardGrid from "./BoardGrid/BoardGrid";
import DebugPanel from "./DebugPanel/DebugPanel";
import { initialState, stateReducer } from "./gameState";
import GameSidebar from "./GameSidebar/GameSidebar";
import HistoryPanel from "./HistoryPanel/HistoryPanel";
import { useBotPlayer } from "./hooks/useBotPlayer";
import { useDebugTools } from "./hooks/useDebugTools";
import { useDragAndDrop } from "./hooks/useDragAndDrop";
import { useFileTransfer } from "./hooks/useFileTransfer";
import { useGameLifecycle } from "./hooks/useGameLifecycle";
import { useHints } from "./hooks/useHints";
import { useMoveActions } from "./hooks/useMoveActions";
import { useNewGame } from "./hooks/useNewGame";
import NewGameModal from "./NewGameModal/NewGameModal";
import Rack from "./Rack/Rack";
import RackActions from "./RackActions/RackActions";
import TopActionBar from "./TopActionBar/TopActionBar";
import { HistoryCell } from "./types";
import { countPendingCells } from "./wordFinder";

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
    gameOverOffer,
    gameOver,
    findingHint,
    p1hintsUsed,
    p2hintsUsed,
    moveHistory,
    showHistory,
    hoveredTurnCells,
    gameMode,
    botDifficulty,
    showNewGameModal,
    botThinking,
    debugMode,
    debugRevealBotRack,
    debugAllowMoveLocked,
    debugBotMoveLog,
  } = state;

  useGameLifecycle(patchState);
  const { persist, fileInputRef, handleSaveToFile, handleLoadFileClick, handleFileSelected } =
    useFileTransfer(state, patchState);
  const moveActions = useMoveActions(state, patchState, persist);
  const dragAndDrop = useDragAndDrop(state, patchState, moveActions.updateInv);
  const { giveHint } = useHints(state, patchState, persist);
  useBotPlayer(state, patchState, persist, moveActions.passTurn, moveActions.maybeCheckStalemate);
  const newGame = useNewGame(patchState, persist);
  const debugTools = useDebugTools(state, patchState);

  // opens/closes the turn-history sidebar
  const toggleHistory = () => {
    patchState({ showHistory: !showHistory });
  };

  // hovering a history row highlights that turn's words on the board
  const setHoveredTurn = (cells: HistoryCell[]) => {
    patchState({ hoveredTurnCells: cells });
  };

  const clearHoveredTurn = () => {
    patchState({ hoveredTurnCells: null });
  };

  const pendingCount = countPendingCells(board);
  const pendingScore = moveActions.getPendingScore();
  const highlightedCellKeys =
    hoveredTurnCells && hoveredTurnCells.length > 0
      ? new Set(hoveredTurnCells.map((c) => `${c.row},${c.col}`))
      : null;
  const botLabel = `Bot${botDifficulty ? ` (${botDifficulty[0].toUpperCase()}${botDifficulty.slice(1)})` : ""}`;
  const playerLabel = (isP1: boolean): string =>
    isP1 ? "Player 1" : gameMode === "1p" ? botLabel : "Player 2";
  const botTurnActive = gameMode === "1p" && !p1turn;
  const canCancelNewGameModal =
    p1inv.length > 0 || p2inv.length > 0 || moveHistory.length > 0;

  return (
    <div className="scrabble-game">
      {showNewGameModal && (
        <NewGameModal
          onStart={newGame.startNewGame}
          onCancel={newGame.closeNewGameModal}
          canCancel={canCancelNewGameModal}
        />
      )}
      {debugMode && (
        <DebugPanel
          p1inv={p1inv}
          p2inv={p2inv}
          bag={bag}
          gameMode={gameMode}
          botDifficulty={botDifficulty}
          p1Label={playerLabel(true)}
          p2Label={playerLabel(false)}
          debugRevealBotRack={debugRevealBotRack}
          debugAllowMoveLocked={debugAllowMoveLocked}
          debugBotMoveLog={debugBotMoveLog}
          onClose={debugTools.closeDebugPanel}
          onReshuffleRack={debugTools.debugReshuffleRack}
          onResetHints={debugTools.debugResetHints}
          onToggleRevealBotRack={debugTools.debugToggleRevealBotRack}
          onToggleAllowMoveLocked={debugTools.debugToggleAllowMoveLocked}
          onForceStalemateCheck={debugTools.debugForceStalemateCheck}
          onSetRack={debugTools.debugSetRack}
        />
      )}
      <TopActionBar
        onNewGame={newGame.openNewGameModal}
        onSaveToFile={handleSaveToFile}
        onLoadFileClick={handleLoadFileClick}
        onFileSelected={handleFileSelected}
        fileInputRef={fileInputRef}
        loadDisabled={validating || botThinking}
        onToggleHistory={toggleHistory}
      />
      <HistoryPanel
        showHistory={showHistory}
        moveHistory={moveHistory}
        playerLabel={playerLabel}
        onToggleHistory={toggleHistory}
        onSetHoveredTurn={setHoveredTurn}
        onClearHoveredTurn={clearHoveredTurn}
      />
      <div className="letters-left">Tiles left: {bag.length}</div>
      <div className="score">Score: {p1score}</div>
      <div className="rack-row">
        <Rack
          letters={p1inv}
          isActive={p1turn && !gameOver}
          selectedIndices={selectedIndices}
          dragSource={dragSource}
          onToggleSelect={moveActions.toggleLetterSelect}
          onDragStart={dragAndDrop.handleRackDragStart}
          onDragEnd={dragAndDrop.handleDragEnd}
          onDrop={dragAndDrop.handleRackDrop}
        />
        {p1turn && (
          <RackActions
            pendingCount={pendingCount}
            hintsUsed={p1hintsUsed}
            validating={validating}
            gameOver={gameOver}
            findingHint={findingHint}
            onShuffle={moveActions.shuffleRackAction}
            onClear={moveActions.clearPending}
            onHint={giveHint}
          />
        )}
      </div>
      <div className="tile-wrap">
        <BoardGrid
          board={board}
          dragSource={dragSource}
          highlightedCellKeys={highlightedCellKeys}
          pendingWordStatus={moveActions.pendingWordStatus}
          disabled={validating || gameOver}
          debugMovable={debugAllowMoveLocked}
          onDropLetter={dragAndDrop.handleBoardDrop}
          onDragStartLetter={dragAndDrop.handleBoardDragStart}
          onDragEnd={dragAndDrop.handleDragEnd}
        />
        <GameSidebar
          gameOverOffer={gameOverOffer}
          gameOver={gameOver}
          p1score={p1score}
          p2score={p2score}
          playerLabel={playerLabel}
          botTurnActive={botTurnActive}
          botThinking={botThinking}
          botLabel={botLabel}
          p1turn={p1turn}
          firstTurn={firstTurn}
          pendingScore={pendingScore}
          validationError={validationError}
          selectedCount={selectedIndices.length}
          bagLength={bag.length}
          validating={validating}
          pendingCount={pendingCount}
          onEndGame={newGame.endGame}
          onDismissGameOverOffer={newGame.dismissGameOverOffer}
          onTradeLetters={moveActions.tradeLetters}
          onPassTurn={moveActions.passTurn}
          onSubmit={moveActions.submit}
        />
      </div>
      <div className="rack-row">
        <Rack
          letters={p2inv}
          isActive={!p1turn && !gameOver}
          hideLetters={gameMode === "1p" && !debugRevealBotRack}
          selectedIndices={selectedIndices}
          dragSource={dragSource}
          onToggleSelect={moveActions.toggleLetterSelect}
          onDragStart={dragAndDrop.handleRackDragStart}
          onDragEnd={dragAndDrop.handleDragEnd}
          onDrop={dragAndDrop.handleRackDrop}
        />
        {!p1turn && gameMode !== "1p" && (
          <RackActions
            pendingCount={pendingCount}
            hintsUsed={p2hintsUsed}
            validating={validating}
            gameOver={gameOver}
            findingHint={findingHint}
            onShuffle={moveActions.shuffleRackAction}
            onClear={moveActions.clearPending}
            onHint={giveHint}
          />
        )}
      </div>
      <div className="score">Score: {p2score}</div>
    </div>
  );
}

export default ScrabbleGame;
