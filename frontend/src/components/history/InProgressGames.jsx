import Link from "next/link"; // Import the Link component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";

export function InProgressGames({ inProgressGames }) {
  return (
    <div className="w-1/2 h-5/6 flex flex-col h-full min-h-0 border-2 border-blue-500 rounded-lg shadow-lg p-4 hover:shadow-2xl transition-shadow duration-300">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        In Progress Games
      </h2>
      {inProgressGames.length > 0 ? (
        <div className="flex-grow overflow-y-auto space-y-4 px-4 py-4">
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
                className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 border-2 border-blue-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex justify-between items-center"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-xl font-semibold">
                    <span className="animate-flash text-yellow-300">
                      In Progress
                    </span>
                  </p>
                  <p className="text-sm text-gray-200">
                    Opponent:{" "}
                    {game.opponent ? game.opponent : "No Opponent Yet"}
                  </p>
                  <p className="text-sm text-gray-200">
                    White Time: {formatTime(game.playerWhiteTimeRemaining)} |
                    Black Time: {formatTime(game.playerBlackTimeRemaining)}
                  </p>
                </div>

                <Link href={`/compete/${game.id}/${game.orientation}`} passHref>
                  <FontAwesomeIcon
                    icon={faForward}
                    className="text-white text-2xl hover:text-yellow-300 transition-colors duration-300"
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
