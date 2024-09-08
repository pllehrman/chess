import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";

export function CompletedGames({ completedGames }) {
  console.log(completedGames);
  return (
    <div className="w-1/2 h-3/4 flex flex-col border-2 border-green-500 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Completed Games
      </h2>
      {completedGames.length > 0 ? (
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6">
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
                className="p-5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex justify-between items-center"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-semibold">
                    Result:{" "}
                    <span className={`font-bold ${resultClass}`}>
                      {game.result}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Opponent: {opponent}
                  </p>
                </div>

                <div className="text-center w-1/3">
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Date: {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Link href={`/compete/${game.id}/${game.orientation}`} passHref>
                  <FontAwesomeIcon
                    icon={faForward}
                    className="text-gray-500 hover:text-green-500 transition-colors duration-300 text-3xl"
                  />
                </Link>
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
