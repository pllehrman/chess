import ErrorBoundary from "@/components/ErrorBoundary";
import { retrieveSession } from "@/components/formatting/retrieveSession";
import { MainGame } from "@/components/game/MainGame";

export default function Page({ params }) {
  const { gameId, orientation } = params;
  const { sessionId, sessionUsername } = retrieveSession();

  return (
    <div>
      <MainGame
        gameId={gameId}
        orientation={orientation}
        sessionId={sessionId}
        sessionUsername={sessionUsername}
      />
    </div>
  );
}
