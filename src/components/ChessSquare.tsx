import React from 'react';
import { ChessPiece, GameMode } from '../types/chess';

interface ChessSquareProps {
  piece: ChessPiece | null;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  onClick: () => void;
  gameMode: GameMode;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  piece,
  isLight,
  isSelected,
  isPossibleMove,
  onClick,
  gameMode
}) => {
  const getPieceSymbol = (piece: ChessPiece): string => {
    const symbols: Record<string, Record<string, string>> = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };
    
    return symbols[piece.color][piece.type];
  };

  const getSquareClasses = () => {
    let classes = 'aspect-square flex items-center justify-center text-4xl cursor-pointer transition-all duration-200 relative ';
    
    // Base square color - pastel girly colors
    if (isLight) {
      classes += 'bg-pink-100/60 ';
    } else {
      classes += 'bg-rose-200/40 ';
    }
    
    // Selected state
    if (isSelected) {
      classes += 'ring-4 ring-pink-400 bg-pink-300/40 ';
    }
    
    // Possible move highlight
    if (isPossibleMove) {
      classes += 'ring-2 ring-purple-400 bg-purple-200/30 ';
    }
    
    // Hover effects
    classes += 'hover:bg-pink-200/50 ';
    
    // Game mode specific effects
    if (gameMode === 'ar') {
      classes += 'shadow-lg shadow-pink-300/30 ';
    } else if (gameMode === 'realtime') {
      classes += 'shadow-md shadow-purple-300/30 ';
    }
    
    return classes;
  };

  return (
    <div className={getSquareClasses()} onClick={onClick}>
      {piece && (
        <div className={`
          select-none transform transition-all duration-200 hover:scale-110
          ${piece.color === 'white' ? 'text-rose-700 drop-shadow-[0_2px_4px_rgba(244,63,94,0.3)]' : 'text-purple-800 drop-shadow-[0_2px_4px_rgba(147,51,234,0.3)]'}
          ${gameMode === 'ar' ? 'animate-pulse' : ''}
        `}>
          {getPieceSymbol(piece)}
        </div>
      )}
      
      {isPossibleMove && !piece && (
        <div className="w-4 h-4 bg-purple-300/70 rounded-full animate-pulse border-2 border-purple-400"></div>
      )}
      
      {gameMode === 'ar' && (
        <div className="absolute inset-0 bg-gradient-to-t from-pink-300/10 to-transparent"></div>
      )}
    </div>
  );
};

export default ChessSquare;