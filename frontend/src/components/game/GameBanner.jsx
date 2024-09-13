"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faComments } from "@fortawesome/free-solid-svg-icons";

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
}) {
  return (
    <div className="relative w-full flex justify-center items-center p-8">
      <button
        className="absolute left-5 top-1 bg-gray-300 dark:bg-gray-700 p-2 rounded-md z-10 sm:p-3 
             hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        onClick={() => setShowMoveHistory(!showMoveHistory)}
      >
        <FontAwesomeIcon
          icon={faHistory}
          className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg md:text-xl lg:text-2xl"
        />
      </button>

      {/* Chat Toggle Button */}
      <button
        className="absolute right-5 top-1 bg-gray-300 dark:bg-gray-700 p-2 rounded-md z-10 sm:p-3 
             hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        onClick={() => setShowChat(!showChat)}
      >
        <FontAwesomeIcon
          icon={faComments}
          className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg md:text-xl lg:text-2xl"
        />
      </button>

      {/* Displaying various messages based on game state */}
      {winner ? null : invalidMove ? (
        <div className="animate-flash text-sm sm:text-lg md:text-xl font-bold text-red-500 dark:text-red-300 mb-2">
          {inCheck ? "Invalid Move: You're in Check!" : "Invalid Move!"}
        </div>
      ) : !twoPeoplePresent ? (
        <div className="animate-flash text-sm sm:text-lg md:text-xl font-bold text-red-500 dark:text-red-300 mb-2">
          Waiting for opponent to connect...
        </div>
      ) : outgoingDrawOffer ? (
        <div className="animate-flash text-sm sm:text-lg md:text-xl font-bold text-yellow-500 dark:text-yellow-300 mb-2">
          You have a draw offer pending.
        </div>
      ) : null}
    </div>
  );
}
