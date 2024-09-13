"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faComments,
  faShareFromSquare,
} from "@fortawesome/free-solid-svg-icons";

export function GameBanner({
  twoPeoplePresent,
  invalidMove,
  inCheck,
  winner,
  outgoingDrawOffer,
  setShowMoveHistory,
  setShowChat,
  showMoveHistory,
  showChat,
  gameType,
  orientation,
}) {
  const shareUrl = () => {
    let currentUrl = window.location.href;

    if (orientation === "black") {
      currentUrl = currentUrl.replace("black", "white");
    } else {
      currentUrl = currentUrl.replace("white", "black");
    }

    navigator.clipboard.writeText(currentUrl).then(() => {
      alert(
        "URL copied to clipboard! Share it with a friend to start playing."
      );
    });
  };

  return (
    <div
      className="relative w-full h-12 flex justify-center items-center transition-opacity duration-300"
      style={{ minHeight: "3rem" }} // Reserves space for the banner
    >
      {/* MoveHistory Toggle Button */}
      <button
        className="absolute left-5 top-1 bg-gray-300 dark:bg-gray-700 p-1 sm:p-2 rounded-md z-10 
             hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        onClick={() => setShowMoveHistory(!showMoveHistory)}
      >
        <FontAwesomeIcon
          icon={faHistory}
          className="text-gray-800 dark:text-gray-200 text-xs sm:text-lg md:text-xl lg:text-2xl"
        />
      </button>

      {/* Chat Toggle Button */}
      {gameType === "pvp" && (
        <button
          className="absolute right-5 top-1 bg-gray-300 dark:bg-gray-700 p-1 sm:p-2 rounded-md z-10 
               hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
          onClick={() => setShowChat(!showChat)}
        >
          <FontAwesomeIcon
            icon={faComments}
            className="text-gray-800 dark:text-gray-200 text-xs sm:text-lg md:text-xl lg:text-2xl"
          />
        </button>
      )}

      {/* Displaying various messages based on game state */}
      {winner ? null : invalidMove ? (
        <div className="animate-flash text-xs sm:text-lg md:text-xl font-bold text-red-500 dark:text-red-300">
          {inCheck ? "Invalid Move: You're in Check!" : "Invalid Move!"}
        </div>
      ) : !twoPeoplePresent ? (
        <div className="flex flex-col items-center text-center animate-flash text-xs sm:text-lg md:text-xl font-bold text-red-500 dark:text-red-300">
          Waiting for opponent to connect...
          <button
            onClick={shareUrl}
            className="mt-2 flex items-center px-2 sm:px-3 rounded bg-gray-300 dark:bg-gray-700 text-xs sm:text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            <FontAwesomeIcon
              icon={faShareFromSquare}
              className="mr-1 sm:mr-2"
            />
            Invite Your Friend
          </button>
        </div>
      ) : outgoingDrawOffer ? (
        <div className="animate-flash text-xs sm:text-lg md:text-xl font-bold text-yellow-500 dark:text-yellow-300">
          You have a draw offer pending.
        </div>
      ) : null}
    </div>
  );
}
