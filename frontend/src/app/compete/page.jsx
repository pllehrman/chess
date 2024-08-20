import { retrieveCookie } from "@/components/formatting/retrieveCookie";
import GameModeSelection from "@/components/game_modes/GameModeSelection";

export default function Page() {
  const { sessionId, sessionUsername } = retrieveCookie();

  return (
    <div>
      <GameModeSelection
        sessionId={sessionId}
        sessionUsername={sessionUsername}
      />
    </div>
  );
}
