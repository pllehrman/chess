"use server";

import { GameUnavailable } from "./GameUnavailable";
import { Loading } from "../formatting/Loading";
import { MainGameClient } from "./MainGameClient";
import { joinGame } from "./utilities/joinGame";

export async function MainGame({
  gameId,
  orientation,
  sessionId,
  sessionUsername,
}) {
  let isAvailable = false;
  let game = null;
  let error = null;
  let needsCookie = false;
  let newSessionId = sessionId;
  let newSessionUsername = sessionUsername;

  try {
    const response = await joinGame(gameId, orientation, sessionId);
    isAvailable = response.isAvailable;
    game = response.game;

    if (!sessionId && isAvailable) {
      newSessionId = response.sessionId;
      newSessionUsername = response.sessionUsername;
      needsCookie = true;
    }
  } catch (err) {
    console.error(`error in joining game: ${err.message}`);
    error = err;
  }

  if (error || !isAvailable) {
    return <GameUnavailable />;
  } else if (!game || game.fen === null) {
    return <Loading />;
  }

  return (
    <MainGameClient
      gameData={game}
      orientation={orientation}
      sessionId={sessionId}
      sessionUsername={newSessionUsername}
      needsCookie={needsCookie}
    />
  );
}
