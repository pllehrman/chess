import { retrieveSession } from "@/components/formatting/retrieveSession";
import GameModeSelection from "@/components/game_modes/GameModeSelection";

export default function Page() {
  const { sessionId, sessionUsername } = retrieveSession();
  console.log(
    "Compete: sessionId",
    sessionId,
    "sessionUsername",
    sessionUsername
  );

  return (
    <>
      <GameModeSelection
        sessionId={sessionId}
        sessionUsername={sessionUsername}
      />
    </>
  );
}
