'use client';

import React, { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { startNewGame } from '@/utils/newChessGame';
import { UserContext } from '../components/Providers';

export default function GameModeSelection() {
  const router = useRouter();
  const [showFriendOptions, setShowFriendOptions] = useState(false);
  const [timeControl, setTimeControl] = useState(10); // Default 10 minutes per side
  const [colorChoice, setColorChoice] = useState('random'); // Default to random
  const { session } = useContext(UserContext); 

  const coinFlip = () => {
    return Math.random() < 0.5;
  }

  const handlePlayAgainstComputer = () => {
    // Function to determine if user should start as white or black
    const shouldUserStartAsWhite = (colorChoice === 'white') || (colorChoice === 'random' && coinFlip());
    
    if (shouldUserStartAsWhite) {
      startNewGame(0, session, 0, null);
    } else {
      startNewGame(0, 0, session, null);
    }
  
    router.push('/compete/solo');
  };

  const handlePlayAgainstFriend = () => {
    // Show friend options
    setShowFriendOptions(true);
  };

  const handleStartGameAgainstFriend = () => {
     // Function to determine if user should start as white or black
    const shouldUserStartAsWhite = (colorChoice === 'white') || (colorChoice === 'random' && coinFlip());
    
    if (shouldUserStartAsWhite) {
      console.log("starting as white")
      console.log(timeControl)
      startNewGame(1, session, null, timeControl); //null field gets filled in after a user joins
    } else {
      startNewGame(1, null, session, timeControl);
    }
  
    router.push('/compete/solo');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Choose Your Game Mode</h2>
        <div className="space-y-4">
          <button
            onClick={handlePlayAgainstComputer}
            className="w-full bg-indigo-600 text-white rounded-md py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Play Against Computer
          </button>
          <button
            onClick={handlePlayAgainstFriend}
            className="w-full bg-green-600 text-white rounded-md py-2 font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Play Against Friend
          </button>
        </div>
        {showFriendOptions && (
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="timeControl" className="block text-sm font-medium text-gray-700">Time Control (minutes per side):</label>
              <input
                type="number"
                id="timeControl"
                value={timeControl}
                onChange={(e) => setTimeControl(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg p-2"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose Your Color:</label>
              <div className="mt-2 space-x-4">
                <label>
                  <input
                    type="radio"
                    name="colorChoice"
                    value="white"
                    checked={colorChoice === 'white'}
                    onChange={() => setColorChoice('white')}
                    className="mr-2"
                  />
                  White
                </label>
                <label>
                  <input
                    type="radio"
                    name="colorChoice"
                    value="black"
                    checked={colorChoice === 'black'}
                    onChange={() => setColorChoice('black')}
                    className="mr-2"
                  />
                  Black
                </label>
                <label>
                  <input
                    type="radio"
                    name="colorChoice"
                    value="random"
                    checked={colorChoice === 'random'}
                    onChange={() => setColorChoice('random')}
                    className="mr-2"
                  />
                  Random
                </label>
              </div>
            </div>
            <button
              onClick={handleStartGameAgainstFriend}
              className="w-full bg-blue-600 text-white rounded-md py-2 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
