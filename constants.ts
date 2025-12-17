import { CandyColor, LevelConfig } from './types';

export const BOARD_SIZE = 8;

export const CANDY_COLORS: Record<CandyColor, string> = {
  [CandyColor.Red]: 'bg-red-500 border-red-600 shadow-red-500/50',
  [CandyColor.Blue]: 'bg-blue-500 border-blue-600 shadow-blue-500/50',
  [CandyColor.Green]: 'bg-green-500 border-green-600 shadow-green-500/50',
  [CandyColor.Yellow]: 'bg-yellow-400 border-yellow-500 shadow-yellow-500/50',
  [CandyColor.Purple]: 'bg-purple-500 border-purple-600 shadow-purple-500/50',
  [CandyColor.Orange]: 'bg-orange-500 border-orange-600 shadow-orange-500/50',
  [CandyColor.Empty]: 'invisible'
};

export const CANDY_EMOJIS: Record<CandyColor, string> = {
  [CandyColor.Red]: '🍓',
  [CandyColor.Blue]: '🫐',
  [CandyColor.Green]: '🥝',
  [CandyColor.Yellow]: '🍋',
  [CandyColor.Purple]: '🍇',
  [CandyColor.Orange]: '🍊',
  [CandyColor.Empty]: ''
};

export const LEVELS: LevelConfig[] = [
  {
    level: 1,
    targetScore: 1000,
    moves: 15,
    colors: [CandyColor.Red, CandyColor.Blue, CandyColor.Green, CandyColor.Yellow]
  },
  {
    level: 2,
    targetScore: 2500,
    moves: 20,
    colors: [CandyColor.Red, CandyColor.Blue, CandyColor.Green, CandyColor.Yellow, CandyColor.Purple]
  },
  {
    level: 3,
    targetScore: 4000,
    moves: 20,
    colors: [CandyColor.Red, CandyColor.Blue, CandyColor.Green, CandyColor.Yellow, CandyColor.Purple, CandyColor.Orange]
  },
  {
    level: 4,
    targetScore: 6000,
    moves: 18,
    colors: [CandyColor.Red, CandyColor.Blue, CandyColor.Green, CandyColor.Yellow, CandyColor.Purple, CandyColor.Orange]
  }
];