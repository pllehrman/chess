import { fetchGameState } from '@/utils/fetchGameState';
import { fetchGameAvailability } from '@/utils/fetchGameAvailability';

import { GameUnavailable } from './GameUnavailable';
import { Loading } from '../Loading';
import { MainGameClient } from './MainGameClient';


export async function MainGame({ gameId, orientation }) {
  let isGameAvailable;
  let gameData;
  let error;

  try {
    isGameAvailable = await fetchGameAvailability(gameId, orientation);
    if (isGameAvailable) {
      gameData = await fetchGameState(gameId);
    }
  } catch (err) {
    error = err;
  }
  
  if (error) {
    return <GameUnavailable />;
  } else if (!isGameAvailable) {
    return <GameUnavailable />;
  } else if (gameData.fen === null) {
    return <Loading />;
  }

  return <MainGameClient gameData={gameData} orientation={orientation} />;
}
