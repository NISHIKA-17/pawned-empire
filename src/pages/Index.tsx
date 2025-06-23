import React, { useState } from 'react';
import ChessBoard from '../components/ChessBoard';
import GameModeSelector from '../components/GameModeSelector';
import GameUI from '../components/GameUI';
import { GameMode, GameState } from '../types/chess';

const Index = () => {
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [gameState, setGameState] = useState<GameState>('menu');

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState('playing');
  };

  const resetGame = () => {
    setGameState('menu');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-red-900">
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F8BBD9' fill-opacity='0.08'%3E%3Cpath d='M40 0L60 20L40 40L20 20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {gameState === 'menu' ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-12 animate-fade-in">
              {/* Logo and Title */}
              <div className="flex flex-col items-center mb-8">
                <img 
                  src="/logo.png" alt="Pawned Empire Logo" className="h-20 w-auto" /> 
                  
                <h1 className="text-7xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 bg-clip-text text-transparent mb-4 tracking-wider">
                  PAWNED EMPIRE
                </h1>
                <p className="text-2xl text-rose-200 font-medium tracking-wide mb-8 italic">
                  Every empire begins with a move.
                </p>
              </div>
              
              <p className="text-lg text-rose-100 max-w-3xl mx-auto leading-relaxed opacity-90">
                Build your chess empire through strategic dominance. Experience the art of war on the board 
                with private coaching that only you can see.
              </p>
            </div>
            
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-rose-400/30 shadow-2xl mb-8">
              <h2 className="text-2xl font-semibold text-rose-300 mb-6 text-center">Choose Your Battle Mode</h2>
              <GameModeSelector onSelectMode={startGame} />
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <div className="bg-gradient-to-br from-rose-900/50 to-purple-900/50 backdrop-blur-sm rounded-xl p-6 border border-rose-400/20 shadow-lg">
                <h3 className="text-xl font-semibold text-rose-300 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Strategic Intelligence System
                </h3>
                <p className="text-rose-100">Advanced AI coaching provides personalized strategies visible only to you - your opponent remains unaware of your tactical advantages.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/50 to-rose-900/50 backdrop-blur-sm rounded-xl p-6 border border-purple-400/20 shadow-lg">
                <h3 className="text-xl font-semibold text-purple-300 mb-3 flex items-center">
                  <span className="mr-2">👑</span>
                  Complete Rule Implementation
                </h3>
                <p className="text-purple-100">Full chess regulations including castling, en passant, promotion, and check detection - experience chess as it was meant to be played.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center min-h-screen">
            <div className="flex-1 max-w-2xl">
              <ChessBoard gameMode={gameMode} />
            </div>
            <div className="w-full lg:w-80">
              <GameUI gameMode={gameMode} onResetGame={resetGame} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
