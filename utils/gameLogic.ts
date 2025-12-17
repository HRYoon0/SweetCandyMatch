import { BOARD_SIZE } from '../constants';
import { BoardGrid, Candy, CandyColor, Position } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getRandomCandy = (allowedColors: CandyColor[]): Candy => {
  const randomColor = allowedColors[Math.floor(Math.random() * allowedColors.length)];
  return {
    id: generateId(),
    color: randomColor,
    isNew: true
  };
};

/**
 * Generates a board ensuring no initial matches exist
 */
export const createBoard = (allowedColors: CandyColor[]): BoardGrid => {
  const board: BoardGrid = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: Candy[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      let candy = getRandomCandy(allowedColors);
      // Prevent initial matches
      while (
        (c >= 2 && row[c - 1].color === candy.color && row[c - 2].color === candy.color) ||
        (r >= 2 && board[r - 1][c].color === candy.color && board[r - 2][c].color === candy.color)
      ) {
        candy = getRandomCandy(allowedColors);
      }
      // Remove isNew flag for initial board
      row.push({ ...candy, isNew: false });
    }
    board.push(row);
  }
  return board;
};

/**
 * Checks for matches of 3 or more in rows or columns
 * Returns an array of matched positions
 */
export const findMatches = (board: BoardGrid): Position[] => {
  const matchedPositions = new Set<string>();

  // Horizontal Matches
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE - 2; c++) {
      const color = board[r][c].color;
      if (color === CandyColor.Empty) continue;

      if (board[r][c + 1].color === color && board[r][c + 2].color === color) {
        matchedPositions.add(`${r},${c}`);
        matchedPositions.add(`${r},${c + 1}`);
        matchedPositions.add(`${r},${c + 2}`);
        // Check for > 3
        let k = c + 3;
        while (k < BOARD_SIZE && board[r][k].color === color) {
          matchedPositions.add(`${r},${k}`);
          k++;
        }
      }
    }
  }

  // Vertical Matches
  for (let c = 0; c < BOARD_SIZE; c++) {
    for (let r = 0; r < BOARD_SIZE - 2; r++) {
      const color = board[r][c].color;
      if (color === CandyColor.Empty) continue;

      if (board[r + 1][c].color === color && board[r + 2][c].color === color) {
        matchedPositions.add(`${r},${c}`);
        matchedPositions.add(`${r + 1},${c}`);
        matchedPositions.add(`${r + 2},${c}`);
        // Check for > 3
        let k = r + 3;
        while (k < BOARD_SIZE && board[k][c].color === color) {
          matchedPositions.add(`${k},${c}`);
          k++;
        }
      }
    }
  }

  return Array.from(matchedPositions).map(str => {
    const [r, c] = str.split(',').map(Number);
    return { row: r, col: c };
  });
};

/**
 * Checks if a swap results in a match
 */
export const isValidSwap = (board: BoardGrid, p1: Position, p2: Position): boolean => {
  // Create a temporary board copy
  const tempBoard = board.map(row => row.map(candy => ({ ...candy })));
  
  // Swap
  const temp = tempBoard[p1.row][p1.col];
  tempBoard[p1.row][p1.col] = tempBoard[p2.row][p2.col];
  tempBoard[p2.row][p2.col] = temp;

  // Check matches
  const matches = findMatches(tempBoard);
  return matches.length > 0;
};

export const areAdjacent = (p1: Position, p2: Position): boolean => {
  const rDiff = Math.abs(p1.row - p2.row);
  const cDiff = Math.abs(p1.col - p2.col);
  return (rDiff === 1 && cDiff === 0) || (rDiff === 0 && cDiff === 1);
};