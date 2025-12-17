import React from 'react';
import { Trophy, Move, RotateCcw, Play } from 'lucide-react';
import { LevelConfig } from '../types';

interface ScoreBoardProps {
  score: number;
  moves: number;
  levelConfig: LevelConfig;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, moves, levelConfig }) => {
  const progressPercentage = Math.min((score / levelConfig.targetScore) * 100, 100);

  return (
    <div className="w-full max-w-md mb-6 px-4">
      <div className="flex justify-between items-end mb-2 text-pink-900 font-bold">
        <div className="flex flex-col items-center bg-white/80 p-3 rounded-2xl shadow-sm w-24">
           <span className="text-xs uppercase tracking-wider text-pink-500 mb-1">레벨</span>
           <span className="text-2xl">{levelConfig.level}</span>
        </div>
        
        <div className="flex flex-col items-center bg-white/80 p-3 rounded-2xl shadow-sm w-24 mx-2">
            <span className="text-xs uppercase tracking-wider text-purple-500 mb-1">남은 횟수</span>
            <span className={`text-2xl ${moves < 5 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                {moves}
            </span>
        </div>

        <div className="flex flex-col items-center bg-white/80 p-3 rounded-2xl shadow-sm min-w-24 flex-1">
             <span className="text-xs uppercase tracking-wider text-blue-500 mb-1">점수</span>
             <span className="text-2xl">{score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-6 w-full bg-white rounded-full overflow-hidden border-2 border-white shadow-inner">
        <div 
            className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 drop-shadow-sm">
            목표 점수: {levelConfig.targetScore}
        </div>
      </div>
    </div>
  );
};

interface ModalProps {
    title: string;
    message: string;
    buttonText: string;
    onAction: () => void;
    type: 'win' | 'lose';
}

export const GameModal: React.FC<ModalProps> = ({ title, message, buttonText, onAction, type }) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all animate-bounce-in border-4 border-pink-100">
                <div className={`mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner ${type === 'win' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                    {type === 'win' ? '🏆' : '😢'}
                </div>
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">{title}</h2>
                <p className="text-gray-600 mb-8 font-medium">{message}</p>
                <button 
                    onClick={onAction}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    {type === 'win' ? <Play size={20} /> : <RotateCcw size={20} />}
                    {buttonText}
                </button>
            </div>
        </div>
    )
}