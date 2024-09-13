import { History } from "@/components/history/History";
import { retrieveSession } from "@/components/formatting/retrieveSession";
import { getGameHistory } from "@/components/history/getGameHistory";

export default async function Page() {
  const { sessionId, sessionUsername } = retrieveSession();
  const { inProgressGames, completedGames } = await getGameHistory(sessionId);
  return (
    <div>
      <History
        sessionId={sessionId}
        inProgressGames={inProgressGames}
        completedGames={completedGames}
      />
    </div>
  );
}
