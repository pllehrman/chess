'use client';

import { useEffect, useState, useRef } from 'react';


async function fetchGameState(gameId) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`);
    if (!response.ok) {
        throw new Error(`HTTP error!, status: ${response.status}`);
    }
    const data = await response.json();
    return data;
};  

export function useFetchGameState(gameId) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (gameId)
                try {
                    const data = await fetchGameState(gameId);
                    setGameData(data);
                } catch (error) {
                    setError(error);
                } finally {
                    setLoading(false);
                }
    };

    if (!hasFetched.current) {
      fetchData();
      hasFetched.current = true;
    }
  }, [gameId]);

  return {gameData, loading, error};
};
