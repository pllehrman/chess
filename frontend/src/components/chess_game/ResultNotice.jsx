import React from 'react';

export default function ResultNotice({ result, winner }) {
  if (!result) return null;

  let message;
  if (result === 'draw') {
    message = "The game was a draw!";
  } else if (winner === 'white') {
    message = "You won!";
  } else if (winner === 'black') {
    message = "You lost!";
  } else {
    message = `The game ended by ${result}`;
  }

  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200 p-4 rounded-lg shadow-lg z-50 text-center">
      <h2 className="text-2xl font-bold">{message}</h2>
    </div>
  );
}
