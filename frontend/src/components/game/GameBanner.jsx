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
      <div className="animate-flash max-w-lg mx-auto text-center bg-gray-100 dark:bg-gray-800 p-4 mb-2 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          {message}
        </h2>

        {/* Play Again Button */}
        <button
          // onClick={onPlayAgain}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
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
