"use server";

import { GameUnavailable } from "./GameUnavailable";
import { Loading } from "../formatting/Loading";
import { MainGameClient } from "./MainGameClient";
import { joinGame } from "./utilities/joinGame";
import { retrieveSession } from "../formatting/retrieveSession";

export async function MainGame({ gameId, orientation }) {
  let { sessionId, sessionUsername } = retrieveSession();

  let isAvailable = false;
  let game = null;
  let error = null;
  let needsCookie = false;

  try {
    const response = await joinGame(gameId, orientation, sessionId);
    isAvailable = response.isAvailable;
    game = response.game;

    if (!sessionId && isAvailable) {
      sessionId = response.sessionId;
      sessionUsername = response.sessionUsername;
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
      sessionUsername={sessionUsername}
      needsCookie={needsCookie}
    />
  );
}
