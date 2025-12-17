export enum CandyColor {
  Red = 'Red',
  Blue = 'Blue',
  Green = 'Green',
  Yellow = 'Yellow',
  Purple = 'Purple',
  Orange = 'Orange',
  Empty = 'Empty'
}

export interface Candy {
  id: string; // Unique ID for React keys and animations
  color: CandyColor;
  isMatched?: boolean; // Visual state for crushing animation
  isNew?: boolean; // Visual state for dropping in
}

export type BoardGrid = Candy[][];

export interface Position {
  row: number;
  col: number;
}

export interface LevelConfig {
  level: number;
  targetScore: number;
  moves: number;
  colors: CandyColor[]; // Difficulty increases by adding more colors
}

export enum GameState {
  Idle = 'Idle',       // Waiting for user input
  Swapping = 'Swapping', // Animation: swapping
  Processing = 'Processing', // Checking matches, removing, dropping
  GameOver = 'GameOver',
  LevelComplete = 'LevelComplete'
}