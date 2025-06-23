import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Home, RotateCcw, Settings, Camera, Zap, Clock } from 'lucide-react';
import { GameMode } from '../types/chess';

interface GameUIProps {
  gameMode: GameMode;
  onResetGame: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ gameMode, onResetGame }) => {
  const [gameTime, setGameTime] = useState(0);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getGameModeIcon = () => {
    switch (gameMode) {
      case 'realtime':
        return <Zap className="w-5 h-5" />;
      case 'ar':
        return <Camera className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getGameModeColor = () => {
    switch (gameMode) {
      case 'realtime':
        return 'from-purple-500 to-pink-500';
      case 'ar':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Mode Header */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getGameModeColor()}`}>
            {getGameModeIcon()}
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {gameMode === 'realtime' ? 'Real-Time Mode' : gameMode === 'ar' ? 'AR Experience' : 'Classic Mode'}
            </h3>
            <p className="text-sm text-gray-400">
              {gameMode === 'realtime' ? 'Fast-paced simultaneous gameplay' : 
               gameMode === 'ar' ? '3D augmented reality chess' : 
               'Traditional turn-based chess'}
            </p>
          </div>
        </div>
      </Card>

      {/* Game Stats */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-4">
        <h3 className="text-white font-semibold mb-4">Game Statistics</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Game Time</span>
            <span className="text-cyan-400 font-mono">{formatTime(gameTime)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Moves Made</span>
            <span className="text-purple-400 font-bold">{moveCount}</span>
          </div>
          
          {gameMode === 'realtime' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Game Intensity</span>
                <span className="text-pink-400 font-bold">High</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pace</span>
                  <span className="text-green-400">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* AR Features (when in AR mode) */}
      {gameMode === 'ar' && (
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border-green-500/30 p-4">
          <h3 className="text-green-400 font-semibold mb-3 flex items-center">
            <Camera className="w-4 h-4 mr-2" />
            AR Features
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">3D Board Projection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Camera Integration Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">Mobile Device Required</span>
            </div>
          </div>
          
          <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90">
            <Camera className="w-4 h-4 mr-2" />
            Activate AR Camera
          </Button>
        </Card>
      )}

      {/* Real-time Features */}
      {gameMode === 'realtime' && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-purple-500/30 p-4">
          <h3 className="text-purple-400 font-semibold mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Real-Time Mode
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Move Timer</span>
              <span className="text-purple-400 font-bold">30s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Simultaneous Play</span>
              <span className="text-green-400 font-bold">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Quick Decisions</span>
              <span className="text-pink-400 font-bold">Enabled</span>
            </div>
          </div>
        </Card>
      )}

      {/* Captured Pieces */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-4">
        <h3 className="text-white font-semibold mb-3">Captured Pieces</h3>
        
        <div className="space-y-3">
          <div>
            <span className="text-gray-400 text-sm">White Captured:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {/* Placeholder captured pieces */}
              <span className="text-lg">♟</span>
              <span className="text-lg">♞</span>
            </div>
          </div>
          
          <div>
            <span className="text-gray-400 text-sm">Black Captured:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {/* Placeholder captured pieces */}
              <span className="text-lg">♙</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Game Controls */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-4">
        <h3 className="text-white font-semibold mb-4">Game Controls</h3>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Game
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600/50"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <Button 
            onClick={onResetGame}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameUI;
