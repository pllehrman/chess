import React from "react";
import { CapturedPiecesDisplay } from "./CapturedPieces";

// Helper function to render the piece image
const renderPieceIcon = (color, piece) => {
  const pieceImage = `/chess_pieces/${color}${piece.toUpperCase()}.png`; // Assuming the pieces are in the /chess_pieces folder
  return (
    <img
      src={pieceImage}
      alt={`${color}${piece}`}
      className="w-10 h-10 inline-block mr-2"
    />
  );
};

export const MoveHistory = React.memo(function MoveHistory({
  moveHistory,
  fen,
}) {
  return (
    <div className="max-h-[70vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <CapturedPiecesDisplay fen={fen} />
      <hr className="my-4 border-gray-300 dark:border-gray-600" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Move History
      </h2>
      <div className="mt-4 flex-1 overflow-y-auto">
        {moveHistory.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No moves yet.</p>
        ) : (
          <ul className="space-y-2">
            {moveHistory
              .slice()
              .reverse() // Reverse the move history to show the latest move at the top
              .map((move, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    {renderPieceIcon(move.color, move.piece)}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {move.from} to {move.to}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
});
