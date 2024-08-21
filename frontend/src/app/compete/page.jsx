import { retrieveSession } from "@/components/formatting/retrieveSession";
import GameModeSelection from "@/components/game_modes/GameModeSelection";

export default function Page() {
  const { sessionId, sessionUsername } = retrieveSesssion();

  return (
    <div>
      <GameModeSelection
        sessionId={sessionId}
        sessionUsername={sessionUsername}
      />
    </div>
  );
}
