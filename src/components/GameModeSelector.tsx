import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Zap, Camera } from 'lucide-react';
import { GameMode } from '../types/chess';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode }) => {
  const gameModes = [
    {
      id: 'classic' as GameMode,
      title: 'Classic Chess',
      description: 'Traditional turn-based chess with unlimited time',
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      features: ['Turn-based gameplay', 'Unlimited thinking time', 'Classic rules']
    },
    {
      id: 'realtime' as GameMode,
      title: 'Real-Time Strategy',
      description: 'Fast-paced simultaneous moves with countdown timer',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      features: ['Simultaneous moves', '30-second move timer', 'High intensity']
    },
    {
      id: 'ar' as GameMode,
      title: 'AR Experience',
      description: 'Augmented reality chess with 3D visualization',
      icon: Camera,
      color: 'from-green-500 to-emerald-500',
      features: ['3D board projection', 'Camera integration', 'Immersive experience']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {gameModes.map((mode) => {
        const IconComponent = mode.icon;
        return (
          <Card key={mode.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
            <div className="p-6">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${mode.color} flex items-center justify-center mb-4 mx-auto`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {mode.title}
              </h3>
              
              <p className="text-gray-300 text-center mb-4 text-sm">
                {mode.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {mode.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-400 flex items-center">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => onSelectMode(mode.id)}
                className={`w-full bg-gradient-to-r ${mode.color} hover:opacity-90 transition-opacity text-white font-semibold`}
              >
                Play {mode.title}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default GameModeSelector;
