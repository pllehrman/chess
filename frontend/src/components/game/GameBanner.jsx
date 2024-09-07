"use client";

export function GameBanner({
  twoPeoplePresent,
  invalidMove,
  inCheck,
  result,
  winner,
  orientation,
}) {
  // If the game result is available, show the result message
  if (result) {
    let message;
    console.log(winner, orientation);
    if (winner === "draw") {
      message = `Draw by ${result}`;
    } else if (winner === orientation) {
      message = "You Won: Great Work!";
    } else {
      message = "You Lost: There's Always Next Time!";
    }

    return (
      <div className="animate-flash max-w-md mx-auto text-center bg-gray-100 dark:bg-gray-800 p-2 mb-2 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          {message}
        </h2>

        {/* Play Again Button */}
        <button
          // onClick={onPlayAgain}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-1 px-4 rounded-full transition-colors duration-300"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (invalidMove) {
    return (
      <div className="animate-flash text-lg font-bold text-red-500 dark:text-red-300 mb-2">
        {inCheck ? "Invalid Move: You're in Check!" : "Invalid Move!"}
      </div>
    );
  }

  if (!twoPeoplePresent) {
    return (
      <div className="animate-flash text-lg font-bold text-red-500 dark:text-red-300 mb-2">
        Waiting for opponent to connect...
      </div>
    );
  }

  return null;
}
