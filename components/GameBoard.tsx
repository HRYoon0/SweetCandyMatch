import React from 'react';
import { BoardGrid, Position, Candy } from '../types';
import CandyCell from './CandyCell';

interface GameBoardProps {
  board: BoardGrid;
  selectedPos: Position | null;
  onCandyClick: (pos: Position) => void;
  isProcessing: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, selectedPos, onCandyClick, isProcessing }) => {
  return (
    <div className="relative p-2 sm:p-4 bg-white/40 backdrop-blur-sm rounded-3xl border-4 border-pink-200 shadow-2xl">
        {/* Grid Background */}
      <div className="grid grid-cols-8 gap-1 sm:gap-2">
        {board.map((row, rIndex) =>
          row.map((candy, cIndex) => {
            const isSelected = selectedPos?.row === rIndex && selectedPos?.col === cIndex;
            return (
              <div 
                key={`${rIndex}-${cIndex}`} 
                className="bg-white/20 rounded-lg aspect-square flex items-center justify-center"
              >
                <CandyCell
                  candy={candy}
                  isSelected={isSelected}
                  onClick={() => !isProcessing && onCandyClick({ row: rIndex, col: cIndex })}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;