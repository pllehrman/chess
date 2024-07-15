'use client';

import { fetchGameState } from '@/utils/fetchGameState';
import { useState, useEffect, useRef, useMemo } from 'react';

export function useOpponentPresent(gameId, orientation, opponentJoined) {
  // Use useMemo to calculate the initial state
  const gameData = fetchGameState(gameId)

  const initialOpponentPresent = useMemo(() => {
    console.log(gameData)
    return (gameData && (orientation === 'white' ? gameData.playerBlack : gameData.playerWhite)) != null;
  }, [gameData, orientation]);
  
  const [opponentPresent, setOpponentPresent] = useState(initialOpponentPresent);
  // Ref to track initial render
  const isInitialRender = useRef(true);

  // console.log('Initial Render:', isInitialRender.current);

  // Update opponent presence based on WebSocket messages
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      if (opponentJoined) {
        setOpponentPresent(true);
      } else if (opponentJoined === false) {
        setOpponentPresent(false);
      }
    }
  }, [opponentJoined]);

  return opponentPresent;
}
