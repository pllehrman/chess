import { useState, useEffect } from 'react';

const getCurrentTurnFromFEN = (fen) => {
    const parts = fen.split(' ');
    if (parts.length > 1) {
        return parts[1] === 'w' ? 'white' : 'black';
    }
    return 'white'; 
}

export function useChessTimers(currentMove, gameData, twoPeoplePresent) {
    const [whiteTime, setWhiteTime] = useState(gameData.playerWhiteTimeRemaining) //Add 1 second to whatever the decided time is to account for errorsz
    const [blackTime, setBlackTime] = useState(gameData.playerBlackTimeRemaining)
    const [currentTurn, setCurrentTurn] = useState(getCurrentTurnFromFEN(gameData.fen));

    useEffect(() => {
        if (gameData) {
          setWhiteTime(gameData.playerWhiteTimeRemaining);
          setBlackTime(gameData.playerBlackTimeRemaining);
        //   console.log("game timers have been set.")
        }
      }, [gameData]);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
        if (currentTurn === 'white') {
            setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
        } else {
            setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
        }
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTurn]);

    // Update turn and reset the timer when a move is made
    useEffect(() => {
        if (currentMove) {
        setCurrentTurn((prev) => (prev === 'white' ? 'black' : 'white'));
        }
    }, [currentMove]);

    return { whiteTime, blackTime, currentTurn };
}