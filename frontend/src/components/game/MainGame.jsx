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
  let gameData = null;
  let error = null;

  console.log("Session ID:", sessionId);

  try {
    response = await fetchGameAvailability(gameId, orientation, sessionId);
    isAvailable = response.isAvailable;
    gameData = response.gameData;
  } catch (err) {
    error = err;
  }

  if (error) {
    return <GameUnavailable />;
  } else if (!isAvailable) {
    return <GameUnavailable />;
  } else if (!gameData || gameData.fen === null) {
    return <Loading />;
  }

  return (
    <MainGameClient
      gameData={gameData}
      orientation={orientation}
      sessionId={sessionId}
      sessionUsername={sessionUsername}
    />
  );
}
