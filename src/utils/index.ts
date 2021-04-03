import { MAX_ROWS, MAX_COLUMNS } from '../constants/index';
import { CellState, CellValue, Cell } from '../types';

export const generateCells = (): Cell[][] => {
  const cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLUMNS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open
      });
    }
  }

  return cells;
}
