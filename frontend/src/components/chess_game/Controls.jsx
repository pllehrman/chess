import React from 'react';

export default function Controls({ resetGame, undoMove }) {
  return (
    <div className="flex space-x-2 mt-2">
      <button
        className="p-2 rounded bg-green-600 text-white"
        onClick={resetGame}
      >
        reset
      </button>
      <button
        className="p-2 rounded bg-green-600 text-white"
        onClick={undoMove}
      >
        undo
      </button>
    </div>
  );
}
