import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";

export function CompletedGames({ completedGames }) {
  return (
    <div
      className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto h-auto flex flex-col border-2 border-green-500 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800"
      style={{ maxHeight: "calc(100vh - 40vh)" }} // Adjust the 100px according to your footer height
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
        Completed Games
      </h2>
      {completedGames.length > 0 ? (
        <div className="flex-grow overflow-y-auto max-h-[65vh] px-6 py-4 space-y-6">
          {completedGames.map((game, index) => {
            const opponent = game.opponent ? game.opponent : "Unknown";

            // Determine class for WIN, LOSS, or DRAW
            let outcomeLabel;
            let outcomeClass;

            if (game.outcome === "WIN") {
              outcomeLabel = `WIN`;
              outcomeClass = "text-green-500";
            } else if (game.outcome === "LOSS") {
              outcomeLabel = `LOSS`;
              outcomeClass = "text-red-500";
            } else {
              outcomeLabel = `DRAW`;
              outcomeClass = "text-yellow-500";
            }

            return (
              <div
                key={index}
                className="p-5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex justify-between items-center"
                style={{ overflow: "hidden" }} // Prevents hover overflow
              >
                <div className="flex flex-col space-y-1">
                  <p
                    className={`text-md sm:text-lg md:text-xl font-semibold ${outcomeClass}`}
                  >
                    {outcomeLabel}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 italic">
                    {`Result: ${game.result || "unknown method"}`}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {game.type === "pvc" &&
                      `vs: ${opponent} (${game.difficulty})`}
                    {game.type === "pvp" && `Opponent: ${opponent}`}
                  </p>
                </div>

                <div className="text-center w-1/3">
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-300">
                    Date: {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <a
                  href={`/compete/${game.id}/${game.orientation}`}
                  target="_self"
                >
                  <FontAwesomeIcon
                    icon={faForward}
                    className="text-xl sm:text-2xl md:text-3xl text-gray-500 hover:text-green-500 transition-colors duration-300"
                  />
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 text-center">
          No completed games.
        </p>
      )}
    </div>
  );
}
