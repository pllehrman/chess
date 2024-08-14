import { useEffect } from 'react';

export function updateChessTimers(setWhiteTime, setBlackTime, increment, currentTurn, twoPeoplePresent) {
    useEffect(() => {
        if (!twoPeoplePresent) return;

        // Start the timer
        const timer = setInterval(() => {
            if (currentTurn === 'white') {
                setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
            } else if (currentTurn === 'black') {
                setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
            }
        }, 1000);

        return () => {
            // Apply increment when the turn changes
            if (currentTurn === 'white') {
                setWhiteTime((prev) => (prev > 0 ? prev + increment : 0));
            } else if (currentTurn === 'black') {
                setBlackTime((prev) => (prev > 0 ? prev + increment : 0));
            }

            // Clear the timer when the effect is cleaned up (i.e., turn changes)
            clearInterval(timer);
        };
    }, [currentTurn, twoPeoplePresent]);  // Only these dependencies are needed
}
