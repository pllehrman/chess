'use client';

import { useState, useEffect } from 'react';

export function useOpponentPresent(gameData, orientation, opponentJoined) {
  // Set initial opponentPresent state based on gameData
  const initialOpponentPresent = (gameData && (orientation === 'white' ? gameData.playerBlack : gameData.playerWhite)) != null;
  const [opponentPresent, setOpponentPresent] = useState(initialOpponentPresent);

  // Update opponent presence based on WebSocket messages
  useEffect(() => {
    if (opponentJoined) {
      setOpponentPresent(true);
    } else if (opponentJoined === false) {
      setOpponentPresent(false);
    }
  }, [opponentJoined]);

  return opponentPresent;
}
