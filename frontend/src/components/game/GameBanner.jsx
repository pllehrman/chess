"use client";

export function GameBanner({
  twoPeoplePresent,
  invalidMove,
  inCheck,
  winner,
  orientation,
}) {
  if (winner) return;

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
