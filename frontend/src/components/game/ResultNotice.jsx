"use client";

export function GameBanner({
  twoPeoplePresent,
  invalidMove,
  inCheck,
  result,
  winner,
}) {
  // If the game result is available, show the result message
  if (result) {
    let message;

    if (winner === "draw") {
      message = `Draw by ${result}`;
    } else if (winner === "white") {
      message = "You won!";
    } else if (winner === "black") {
      message = "You lost!";
    } else {
      message = `The game ended by ${result}`;
    }

    return (
      <div className="animate-flash text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 p-4 rounded-lg shadow-lg">
        <h2>{message}</h2>

        {/* Play Again Button */}
        <button
          onClick={onPlayAgain}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (invalidMove) {
    return (
      <div className="animate-flash text-2xl font-bold text-red-500 dark:text-red-300 mb-4">
        {inCheck ? "Invalid Move: You're in Check!" : "Invalid Move!"}
      </div>
    );
  }

  if (!twoPeoplePresent) {
    return (
      <div className="animate-flash text-2xl font-bold text-red-500 dark:text-red-300 mb-4">
        Waiting for opponent to connect...
      </div>
    );
  }

  return null;
}
