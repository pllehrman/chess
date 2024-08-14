import { useState } from 'react';

export function useChessTimers(gameData) {
    // Convert minutes to seconds for internal calculations
    const [whiteTime, setWhiteTime] = useState(gameData.playerWhiteTimeRemaining * 60); 
    const [blackTime, setBlackTime] = useState(gameData.playerBlackTimeRemaining * 60);
    const [currentTurn, setCurrentTurn] = useState(getCurrentTurnFromFEN(gameData.fen))

    return {whiteTime, setWhiteTime, blackTime, setBlackTime, currentTurn, setCurrentTurn}
}


const getCurrentTurnFromFEN = (fen) => {
    const parts = fen.split(' ');
    if (parts.length > 1) {
        return parts[1] === 'w' ? 'white' : 'black';
    }
    return 'white'; 
  }