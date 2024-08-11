import { useState, useEffect } from 'react';

const getCurrentTurnFromFEN = (fen) => {
    const parts = fen.split(' ');
    if (parts.length > 1) {
        return parts[1] === 'w' ? 'white' : 'black';
    }
    return 'white'; 
}

export function useChessTimers(currentMove, gameData, twoPeoplePresent) {
    // Convert minutes to seconds for internal calculations
    const [whiteTime, setWhiteTime] = useState(gameData.playerWhiteTimeRemaining * 60); 
    const [blackTime, setBlackTime] = useState(gameData.playerBlackTimeRemaining * 60);
    const [currentTurn, setCurrentTurn] = useState(getCurrentTurnFromFEN(gameData.fen));

    useEffect(() => {
        if (gameData) {
          setWhiteTime(gameData.playerWhiteTimeRemaining * 60);
          setBlackTime(gameData.playerBlackTimeRemaining * 60);
        }
    }, [gameData]);

    // Timer effect
    useEffect(() => {
        if (!twoPeoplePresent) return;

        const timer = setInterval(() => {
            if (currentTurn === 'white') {
                setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
            } else if (currentTurn === 'black') {
                setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [currentTurn, twoPeoplePresent]);

    // Update turn when a move is made
    useEffect(() => {
        if (currentMove) {
            setCurrentTurn((prev) => (prev === 'white' ? 'black' : 'white'));
        }
    }, [currentMove]);

    // Convert seconds back to minutes and seconds for display purposes
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return { 
        whiteTime: formatTime(whiteTime), 
        blackTime: formatTime(blackTime), 
        currentTurn: currentTurn,
    };
}
