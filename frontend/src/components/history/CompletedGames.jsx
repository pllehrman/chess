export function CompletedGames({ completedGames }) {
  return (
    <div className="w-1/2 h-5/6 flex flex-col h-full min-h-0 border-2 border-green-500 rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Completed Games
      </h2>
      {completedGames.length > 0 ? (
        <div className="flex-grow overflow-y-auto space-y-4">
          {completedGames.map((game, index) => {
            const opponent = game.opponent ? game.opponent : "Unknown";

            // Set class for game result
            const resultClass =
              game.result === "WIN"
                ? "text-green-500"
                : game.result === "TIE"
                ? "text-yellow-500"
                : "text-red-500";

            return (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md border-2 border-gray-400 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Result:{" "}
                    <span className={`font-bold ${resultClass}`}>
                      {game.result}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Opponent: {opponent}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Date: {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No completed games.</p>
      )}
    </div>
  );
}
