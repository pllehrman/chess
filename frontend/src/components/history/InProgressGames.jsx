import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faForward } from "@fortawesome/free-solid-svg-icons";

export function InProgressGames({ inProgressGames }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensures the component is mounted before rendering dates
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto h-auto flex flex-col border-2 border-blue-300 dark:border-gray-600 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800"
      style={{ maxHeight: "calc(100vh - 40vh)" }} // Adjust according to your footer height
    >
      {inProgressGames.length > 0 ? (
        <div className="flex-grow overflow-y-auto max-h-[65vh] px-6 py-4 space-y-6">
          {inProgressGames.map((game, index) => (
            <div
              key={index}
              className="p-5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex justify-between items-center"
              style={{ overflow: "hidden" }} // Prevents hover overflow
            >
              <div className="flex flex-col space-y-1">
                <p className="text-md sm:text-lg md:text-xl font-semibold text-blue-500">
                  vs: {game.opponent ? game.opponent : "No Opponent"}
                  {game.type === "pvc" ? ` (${game.difficulty})` : ""}
                </p>
                {game.type === "pvp" && (
                  <p className="text-xs sm:text-sm md:text-base">
                    White Time: {formatTime(game.playerWhiteTimeRemaining)} |{" "}
                    Black Time: {formatTime(game.playerBlackTimeRemaining)}
                  </p>
                )}
                {mounted && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 italic">
                    Date: {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="text-center w-1/3">
                {mounted && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-300">
                    Date: {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>

              <a
                href={`/compete/${game.id}/${game.orientation}`}
                target="_self"
              >
                <FontAwesomeIcon
                  icon={faForward}
                  className="text-xl sm:text-2xl md:text-3xl text-gray-500 hover:text-blue-500 transition-colors duration-300"
                />
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 text-center">
          No games in progress.
        </p>
      )}
    </div>
  );
}
