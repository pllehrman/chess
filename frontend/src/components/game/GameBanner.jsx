"use client";

export function GameBanner({
  twoPeoplePresent,
  invalidMove,
  inCheck,
  winner,
  orientation,
  outgoingDrawOffer,
}) {
  if (winner) return null;

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

  if (outgoingDrawOffer) {
    return (
      <div className="animate-flash text-lg font-bold text-yellow-500 dark:text-yellow-300 mb-2">
        You have a draw offer pending.
      </div>
    );
  }

  return null;
}
