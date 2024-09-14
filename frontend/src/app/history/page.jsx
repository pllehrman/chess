import { History } from "@/components/history/History";
import { retrieveSession } from "@/components/formatting/retrieveSession";
import { getGameHistory } from "@/components/history/getGameHistory";

export default async function Page() {
  const { sessionId, sessionUsername } = retrieveSession();
  console.log(
    "History: sessionId",
    sessionId,
    "sessionUsername",
    sessionUsername
  );
  const { inProgressGames, completedGames } = await getGameHistory(sessionId);
  return (
    <>
      <History
        sessionId={sessionId}
        inProgressGames={inProgressGames}
        completedGames={completedGames}
      />
    </>
  );
}
