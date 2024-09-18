import { retrieveSession } from "@/components/formatting/retrieveSession";
import GameModeSelection from "@/components/game_modes/GameModeSelection";

export default function Page() {
  const { sessionId, sessionUsername } = retrieveSession();

  return (
    <>
      <GameModeSelection
        sessionId={sessionId}
        sessionUsername={sessionUsername}
      />
    </>
  );
}
