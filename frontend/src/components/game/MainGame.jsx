import { GameUnavailable } from "./GameUnavailable";
import { Loading } from "../formatting/Loading";
import { MainGameClient } from "./MainGameClient";
import { joinGame } from "./joinGame";
import { retrieveSession } from "../formatting/retrieveSession";

export async function MainGame({ gameId, orientation }) {
  const { sessionId, sessionUsername } = await retrieveSession();

  let isAvailable = false;
  let game = null;
  let error = null;

  try {
    const response = await joinGame(gameId, orientation, sessionId);
    isAvailable = response.isAvailable;
    game = response.game;
  } catch (err) {
    console.error(`error in joining game: ${err.message}`);
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
