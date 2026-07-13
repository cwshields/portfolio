import React, { useRef } from "react";
import { downloadSaveFile, readSaveFileAsState, saveToLocalStorage } from "../persistence";

export function useFileTransfer(state: GameState, patchState: (updates: StateUpdate) => void): FileTransfer {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // writes the given partial update, merged over current state, to localStorage;
  // used alongside patchState(updates) wherever the class used
  // this.setState(updates, this.autosaveState)
  const persist = (updates: Partial<GameState>) => saveToLocalStorage({ ...state, ...updates });

  const handleSaveToFile = () => {
    downloadSaveFile(state);
  };

  const handleLoadFileClick = () => {
    if (
      !window.confirm(
        "Loading a file will replace your current game. Continue?",
      )
    )
      return;
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const loaded = await readSaveFileAsState(file);
      patchState(loaded);
      saveToLocalStorage(loaded);
    } catch (err) {
      patchState({ validationError: (err as Error).message });
    }
  };

  return { persist, fileInputRef, handleSaveToFile, handleLoadFileClick, handleFileSelected };
}
