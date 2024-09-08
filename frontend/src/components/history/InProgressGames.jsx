import Link from "next/link"; // Import the Link component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";

export function InProgressGames({ inProgressGames }) {
  return (
    <div className="w-1/2 h-3/4 flex flex-col border-2 border-blue-300 dark:border-gray-600 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        In Progress Games
      </h2>
      {inProgressGames.length > 0 ? (
        <div className="flex-grow overflow-y-auto px-4 py-4 space-y-6">
          {inProgressGames.map((game) => {
            // Format time in minutes:seconds
            const formatTime = (timeInSeconds) => {
              const minutes = Math.floor(timeInSeconds / 60);
              const seconds = timeInSeconds % 60;
              return `${minutes}:${seconds.toString().padStart(2, "0")}`;
            };

            return (
              <div
                key={game.id}
                className="p-5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex justify-between items-center"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-lg font-semibold">
                    <span className="text-blue-500">Opponent: </span>
                    {game.opponent ? game.opponent : "No Opponent Yet"}
                  </p>
                  {game.type === "pvp" && (
                    <p className="text-sm">
                      White Time: {formatTime(game.playerWhiteTimeRemaining)} |{" "}
                      Black Time: {formatTime(game.playerBlackTimeRemaining)}
                    </p>
                  )}
                </div>

                <Link href={`/compete/${game.id}/${game.orientation}`} passHref>
                  <FontAwesomeIcon
                    icon={faForward}
                    className="text-gray-500 hover:text-blue-500 transition-colors duration-300 text-3xl"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No games in progress.
        </p>
      )}
    </div>
  );
}
