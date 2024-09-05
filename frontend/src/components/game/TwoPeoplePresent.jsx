"use client";

export function TwoPeoplePresent({ twoPeoplePresent }) {
  if (!twoPeoplePresent) {
    return (
      <div className="animate-flash text-2xl font-bold text-red-500 dark:text-red-300 mb-4">
        Waiting for opponent to connect...
      </div>
    );
  }
}
