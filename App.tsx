import React, { useState, useEffect, useCallback } from 'react';
import { BoardGrid, CandyColor, GameState, Position, Candy } from './types';
import { BOARD_SIZE, LEVELS } from './constants';
import { createBoard, findMatches, isValidSwap, areAdjacent, getRandomCandy, generateId } from './utils/gameLogic';
import GameBoard from './components/GameBoard';
import { ScoreBoard, GameModal } from './components/GameUI';

const App: React.FC = () => {
  // --- State ---
  const [levelIndex, setLevelIndex] = useState(0);
  const [board, setBoard] = useState<BoardGrid>([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  
  // Current Level Config
  const currentLevel = LEVELS[levelIndex];

  // --- Initialization ---
  const initLevel = useCallback((lvlIndex: number) => {
    const lvl = LEVELS[lvlIndex];
    const newBoard = createBoard(lvl.colors);
    setBoard(newBoard);
    setScore(0);
    setMovesLeft(lvl.moves);
    setGameState(GameState.Idle);
    setSelectedPos(null);
  }, []);

  useEffect(() => {
    initLevel(levelIndex);
  }, [levelIndex, initLevel]);

  // --- Game Logic Loops ---

  const handleCandyClick = (pos: Position) => {
    if (gameState !== GameState.Idle) return;

    // 1. First selection
    if (!selectedPos) {
      setSelectedPos(pos);
      return;
    }

    // 2. Deselect if clicked same
    if (selectedPos.row === pos.row && selectedPos.col === pos.col) {
      setSelectedPos(null);
      return;
    }

    // 3. Try Swap
    if (areAdjacent(selectedPos, pos)) {
      attemptSwap(selectedPos, pos);
    } else {
      // If clicked far away, just change selection
      setSelectedPos(pos);
    }
  };

  const attemptSwap = async (p1: Position, p2: Position) => {
    setGameState(GameState.Swapping);
    setSelectedPos(null);

    // Optimistic UI update for swap
    let newBoard = [...board];
    let temp = newBoard[p1.row][p1.col];
    newBoard[p1.row][p1.col] = newBoard[p2.row][p2.col];
    newBoard[p2.row][p2.col] = temp;
    setBoard([...newBoard]);

    // Delay for visual swap
    await new Promise(r => setTimeout(r, 300));

    const valid = isValidSwap(board, p1, p2); // Check original board state logic or new board? Logic utils uses the passed board.
    // Wait, we swapped in state `newBoard`. Let's check matches on `newBoard`.
    const matches = findMatches(newBoard);

    if (matches.length > 0) {
      // Valid Swap
      setMovesLeft(prev => prev - 1);
      processMatches(newBoard);
    } else {
      // Invalid Swap - Swap back
      // Need to use functional update to ensure we aren't using stale state if clicked fast, 
      // though GameState blocks clicks.
      
      // Visual feedback: Shake or just swap back
      newBoard = [...newBoard];
      temp = newBoard[p1.row][p1.col];
      newBoard[p1.row][p1.col] = newBoard[p2.row][p2.col];
      newBoard[p2.row][p2.col] = temp;
      setBoard([...newBoard]);
      
      setGameState(GameState.Idle);
    }
  };

  const processMatches = async (currentBoard: BoardGrid) => {
    setGameState(GameState.Processing);

    let activeBoard = [...currentBoard];
    let hasMatches = true;
    let comboMultiplier = 1;

    while (hasMatches) {
      const matches = findMatches(activeBoard);
      
      if (matches.length === 0) {
        hasMatches = false;
        break;
      }

      // 1. Mark matched candies (visuals)
      const matchesSet = new Set(matches.map(p => `${p.row},${p.col}`));
      activeBoard = activeBoard.map((row, r) => 
        row.map((candy, c) => {
          if (matchesSet.has(`${r},${c}`)) {
            return { ...candy, isMatched: true };
          }
          return candy;
        })
      );
      setBoard([...activeBoard]);
      
      // Calculate Score
      const points = matches.length * 10 * comboMultiplier;
      setScore(prev => prev + points);
      comboMultiplier++;

      // Wait for pop animation
      await new Promise(r => setTimeout(r, 300));

      // 2. Remove Candies (set to Empty)
      activeBoard = activeBoard.map(row => 
        row.map(candy => 
          candy.isMatched ? { ...candy, color: CandyColor.Empty, isMatched: false } : candy
        )
      );
      setBoard([...activeBoard]);

      // 3. Drop Columns (Gravity)
      await new Promise(r => setTimeout(r, 100)); // Brief pause
      activeBoard = applyGravity(activeBoard);
      setBoard([...activeBoard]);
      
      // 4. Fill Top (Refill)
      await new Promise(r => setTimeout(r, 300)); // Wait for drop anim
      activeBoard = refillBoard(activeBoard, currentLevel.colors);
      setBoard([...activeBoard]);
      
      // Loop continues if new matches formed
      await new Promise(r => setTimeout(r, 300));
    }

    // Check Level / Game Over State
    // Logic handled by useEffect
    setGameState(GameState.Idle);
  };

  const applyGravity = (board: BoardGrid): BoardGrid => {
    const newBoard = board.map(row => [...row]); // Deep copy grid structure

    for (let c = 0; c < BOARD_SIZE; c++) {
      let writeRow = BOARD_SIZE - 1;
      for (let r = BOARD_SIZE - 1; r >= 0; r--) {
        if (newBoard[r][c].color !== CandyColor.Empty) {
          newBoard[writeRow][c] = newBoard[r][c];
          // Clear original if we moved it
          if (writeRow !== r) {
             newBoard[r][c] = { id: generateId(), color: CandyColor.Empty };
          }
          writeRow--;
        }
      }
      // Fill remaining top with empty
      while (writeRow >= 0) {
        newBoard[writeRow][c] = { id: generateId(), color: CandyColor.Empty };
        writeRow--;
      }
    }
    return newBoard;
  };

  const refillBoard = (board: BoardGrid, allowedColors: CandyColor[]): BoardGrid => {
    return board.map(row => 
      row.map(candy => {
        if (candy.color === CandyColor.Empty) {
          return getRandomCandy(allowedColors);
        }
        return candy;
      })
    );
  };

  // --- End Game Checks ---
  
  // We use a useEffect to monitor score/moves updates to trigger modal states
  useEffect(() => {
    if (gameState === GameState.Processing || gameState === GameState.Swapping) return;

    if (score >= currentLevel.targetScore) {
      setGameState(GameState.LevelComplete);
    } else if (movesLeft <= 0) {
      setGameState(GameState.GameOver);
    }
  }, [score, movesLeft, currentLevel.targetScore, gameState]);


  const handleNextLevel = () => {
    if (levelIndex < LEVELS.length - 1) {
      setLevelIndex(prev => prev + 1);
    } else {
      // Game Completed (looped for now)
      alert("모든 레벨을 완료했습니다! 레벨 1부터 다시 시작합니다.");
      setLevelIndex(0);
    }
  };

  const handleRetry = () => {
    initLevel(levelIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 mb-6 drop-shadow-sm tracking-tight text-center">
        스위트 캔디 매치
      </h1>

      {/* Stats */}
      <ScoreBoard score={score} moves={movesLeft} levelConfig={currentLevel} />

      {/* Game Board */}
      <GameBoard 
        board={board} 
        selectedPos={selectedPos} 
        onCandyClick={handleCandyClick}
        isProcessing={gameState !== GameState.Idle}
      />

      {/* Modals */}
      {gameState === GameState.LevelComplete && (
        <GameModal 
          title="레벨 클리어!" 
          message={`목표 점수 ${currentLevel.targetScore}점을 달성했습니다!`}
          buttonText="다음 레벨"
          onAction={handleNextLevel}
          type="win"
        />
      )}

      {gameState === GameState.GameOver && (
        <GameModal 
          title="이동 횟수 초과!" 
          message="아쉽네요, 다시 도전해보세요!"
          buttonText="다시 도전"
          onAction={handleRetry}
          type="lose"
        />
      )}
      
      <div className="mt-8 text-gray-400 text-sm">
        캔디 3개 이상을 연결하여 점수를 획득하세요!
      </div>
    </div>
  );
};

export default App;