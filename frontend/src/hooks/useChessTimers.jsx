import { useState, useEffect } from 'react';

export function useChessTimers(currentMove, gameData) {
    const [whiteTime, setWhiteTime] = useState(600) //Add 1 second to whatever the decided time is to account for errorsz
    const [blackTime, setBlackTime] = useState(600)
    const [currentTurn, setCurrentTurn] = useState('white');

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