'use client';

import { useEffect, useState, useRef } from 'react';
import { fetchGameState } from '../utils/fetchGameState';

export function useFetchGameState(gameId) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(null);
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
}
    