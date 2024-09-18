import { retrieveSession } from "@/components/formatting/retrieveSession";
import { MainGameClient } from "@/components/game/MainGameClient";
import { getGame } from "@/components/game/utilities/getGame";
import { getSession } from "@/components/game/utilities/getSession";

export default async function Page({ params }) {
  const { gameId, orientation } = params;
  let { sessionId, sessionUsername } = retrieveSession();
  const gameData = await getGame(gameId);
  let needsCookie = false;

  if (!sessionId) {
    needsCookie = true;
    const newSession = await getSession();
    sessionId = newSession.id;
    sessionUsername = newSession.username;
  }

  return (
    <div>
      <MainGameClient
        gameData={gameData}
        orientation={orientation}
        sessionId={sessionId}
        sessionUsername={sessionUsername}
        needsCookie={needsCookie}
      />
    </div>
  );
}
