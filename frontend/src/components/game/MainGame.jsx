import { fetchGameAvailability } from "./fetchGameAvailability";
import { GameUnavailable } from "./GameUnavailable";
import { Loading } from "../formatting/Loading";
import { MainGameClient } from "./MainGameClient";

export async function MainGame({
  gameId,
  orientation,
  sessionId,
  sessionUsername,
}) {
  let isAvailable = false;
  let game = null;
  let error = null;

  try {
    const response = await fetchGameAvailability(
      gameId,
      orientation,
      sessionId
    );
    isAvailable = response.isAvailable;
    game = response.game;
  } catch (err) {
    error = err;
  }

  if (error) {
    return <GameUnavailable />;
  } else if (!isAvailable) {
    return <GameUnavailable />;
  } else if (!game || game.fen === null) {
    return <Loading />;
  }

  return (
    <MainGameClient
      gameData={game}
      orientation={orientation}
      sessionId={sessionId}
      sessionUsername={sessionUsername}
    />
  );
}
