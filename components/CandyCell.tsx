import React from 'react';
import { Candy, CandyColor } from '../types';
import { CANDY_COLORS, CANDY_EMOJIS } from '../constants';

interface CandyCellProps {
  candy: Candy;
  isSelected: boolean;
  onClick: () => void;
}

const CandyCell: React.FC<CandyCellProps> = ({ candy, isSelected, onClick }) => {
  if (candy.color === CandyColor.Empty) {
    return <div className="w-full h-full" />;
  }

  const colorClass = CANDY_COLORS[candy.color];
  const emoji = CANDY_EMOJIS[candy.color];

  // Base classes for the candy visual
  let className = `
    w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 
    rounded-xl sm:rounded-2xl 
    flex items-center justify-center 
    text-2xl sm:text-3xl 
    cursor-pointer 
    select-none 
    transition-all duration-300 
    border-b-4 
    shadow-lg
    ${colorClass}
  `;

  if (isSelected) {
    className += ' ring-4 ring-white ring-opacity-80 scale-110 z-10 brightness-110 animate-pulse';
  } else {
    className += ' hover:scale-105 active:scale-95';
  }

  if (candy.isMatched) {
    className += ' animate-pop';
  } else if (candy.isNew) {
    className += ' animate-drop';
  }

  return (
    <div className={className} onClick={onClick}>
      <span className="drop-shadow-md filter">{emoji}</span>
    </div>
  );
};

export default CandyCell;