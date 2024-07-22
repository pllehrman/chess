import { fetchGameAvailability } from '@/utils/fetchGameAvailability';

import { GameUnavailable } from './GameUnavailable';
import { Loading } from '../Loading';
import { MainGameClient } from './MainGameClient';


export async function MainGame({ gameId, orientation }) {
  let isGameAvailable = false;
  let gameData = null;
  let error = null;

  try {
    const result = await fetchGameAvailability(gameId, orientation);
    isGameAvailable = result.isAvailable;
    gameData = result.game;
  } catch (err) {
    error = err;
  }

  if (error) {
    return <GameUnavailable />;
  } else if (!isGameAvailable) {
    return <GameUnavailable />;
  } else if (!gameData || gameData.fen === null) {
    return <Loading />;
  }

  return <MainGameClient gameData={gameData} orientation={orientation} />;
}
