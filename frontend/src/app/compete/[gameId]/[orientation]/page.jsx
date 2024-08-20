import ErrorBoundary from "@/components/ErrorBoundary";
import { retrieveCookie } from "@/components/formatting/retrieveCookie";
import { MainGame } from "@/components/game/MainGame";

export default function Page({ params }) {
  const { gameId, orientation } = params;
  const { sessionId, sessionUsername } = retrieveCookie();

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
