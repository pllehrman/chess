import { retrieveSession } from "../formatting/retrieveSession";
import { getGameHistory } from "./getGameHistory";
import { CompletedGames } from "./CompletedGames";
import { InProgressGames } from "./InProgressGames";

export async function History({}) {
  // Retrieve the current session ID and username
  const { sessionId, sessionUsername } = retrieveSession();
  const { inProgressGames, completedGames } = await getGameHistory(sessionId);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col h-[100vh]">
        {" "}
        {/* Adjust height to leave space for footer */}
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Chess Game History
        </h1>
        {/* Two Columns for In Progress and Completed Games */}
        <div className="flex justify-between space-x-6 flex-grow min-h-0 mb-10">
          {" "}
          {/* mb-10 adds space between content and footer */}
          <InProgressGames inProgressGames={inProgressGames} />
          <CompletedGames completedGames={completedGames} />
        </div>
      </div>
    </div>
  );
}
