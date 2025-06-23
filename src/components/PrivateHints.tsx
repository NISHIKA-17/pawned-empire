import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Crown, Shield, Target, Sword } from 'lucide-react';
import { PieceColor, GameMode } from '../types/chess';

interface PrivateHintsProps {
  currentPlayer: PieceColor;
  gameMode: GameMode;
}

const PrivateHints: React.FC<PrivateHintsProps> = ({ currentPlayer, gameMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const whiteHints = [
    "👑 Establish royal dominance - control the center squares (e4, d4) to command the battlefield",
    "🏰 Secure your empire - castle early to protect your king behind fortress walls"
  ];

  const blackHints = [
    "⚔️ Challenge the throne - counter white's central control with strategic pawn advances",
    "🛡️ Defend your realm - develop pieces swiftly to create an impenetrable defense"
  ];

  const strategicAdvice = {
    white: [
      "Imperial Strategy: Your empire expands through central control and piece coordination",
      "Tactical Dominance: Seek weak squares in enemy territory to establish outposts"
    ],
    black: [
      "Rebellion Tactics: Undermine white's imperial ambitions through counter-attacks", 
      "Strategic Defense: Transform defensive positions into launching pads for conquest"
    ]
  };

  const currentHints = currentPlayer === 'white' ? whiteHints : blackHints;
  const currentAdvice = strategicAdvice[currentPlayer];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHintIndex((prev) => (prev + 1) % currentHints.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentHints.length]);

  return (
    <div className="space-y-4">
      {/* Privacy Toggle */}
      <Card className="bg-gradient-to-br from-rose-900/70 to-purple-900/70 backdrop-blur-sm border-rose-400/30 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-rose-200 flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-400" />
            Imperial War Council
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="bg-black/30 border-rose-400/40 text-rose-200 hover:bg-rose-900/30 hover:border-rose-300"
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>
        
        <p className="text-sm text-rose-300 mb-2 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Classified intelligence - only visible to your empire
        </p>
        
        {isVisible && (
          <div className="space-y-3">
            <div className={`p-3 rounded-lg border-2 backdrop-blur-sm ${
              currentPlayer === 'white' 
                ? 'bg-rose-800/50 border-rose-400/40 text-rose-100' 
                : 'bg-purple-800/50 border-purple-400/40 text-purple-100'
            }`}>
              <div className="flex items-center mb-2">
                <Target className="w-4 h-4 mr-2" />
                <span className="font-semibold">Current Battle Strategy:</span>
              </div>
              <p className="text-sm">{currentHints[currentHintIndex]}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Strategic Advice */}
      {isVisible && (
        <Card className={`backdrop-blur-sm p-4 shadow-lg ${
          currentPlayer === 'white' 
            ? 'bg-gradient-to-br from-rose-800/60 to-pink-900/60 border-rose-400/30' 
            : 'bg-gradient-to-br from-purple-800/60 to-indigo-900/60 border-purple-400/30'
        }`}>
          <h4 className="font-semibold mb-3 text-rose-200 flex items-center">
            <Sword className="w-4 h-4 mr-2" />
            {currentPlayer === 'white' ? 'White Empire Doctrine' : 'Black Rebellion Code'}:
          </h4>
          <div className="space-y-2">
            {currentAdvice.map((advice, index) => (
              <div key={index} className={`p-3 rounded border backdrop-blur-sm text-sm ${
                currentPlayer === 'white' 
                  ? 'bg-rose-900/40 border-rose-500/30 text-rose-100' 
                  : 'bg-purple-900/40 border-purple-500/30 text-purple-100'
              }`}>
                {advice}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Game Mode Specific Tips */}
      {isVisible && gameMode === 'realtime' && (
        <Card className="bg-gradient-to-br from-amber-900/60 to-yellow-900/60 backdrop-blur-sm border-amber-400/30 p-4 shadow-lg">
          <h4 className="font-semibold text-amber-200 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-2" />
            Blitz Warfare Tactics:
          </h4>
          <ul className="text-sm text-amber-100 space-y-1">
            <li>• Strike with calculated precision under pressure</li>
            <li>• Maintain strategic composure in rapid exchanges</li>
            <li>• Execute decisive moves without hesitation</li>
          </ul>
        </Card>
      )}

      {gameMode === 'ar' && isVisible && (
        <Card className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 backdrop-blur-sm border-cyan-400/30 p-4 shadow-lg">
          <h4 className="font-semibold text-cyan-200 mb-2 flex items-center">
            <Crown className="w-4 h-4 mr-2" />
            Augmented Reality Command:
          </h4>
          <ul className="text-sm text-cyan-100 space-y-1">
            <li>• Visualize battlefield dynamics in three dimensions</li>
            <li>• Leverage spatial awareness for tactical advantage</li>
            <li>• Command your forces through immersive interaction</li>
          </ul>
        </Card>
      )}
    </div>
  );
};

export default PrivateHints;
