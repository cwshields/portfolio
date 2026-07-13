import { SCORES } from './tileBag';

export function scoreWord(formedWord: FormedWord): number {
  let wordMultiplier = 1;
  let letterTotal = 0;
  formedWord.cells.forEach((cell) => {
    let letterMultiplier = 1;
    if (cell.isNew) {
      if (cell.bonus === 'DL') letterMultiplier = 2;
      if (cell.bonus === 'TL') letterMultiplier = 3;
      if (cell.bonus === 'DW') wordMultiplier *= 2;
      if (cell.bonus === 'TW') wordMultiplier *= 3;
    }
    letterTotal += (SCORES[cell.letter] || 0) * letterMultiplier;
  });
  return letterTotal * wordMultiplier;
}

export function scoreMove(formedWords: FormedWord[]): number {
  return formedWords.reduce((sum, word) => sum + scoreWord(word), 0);
}
