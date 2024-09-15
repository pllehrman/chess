import React, { useMemo } from "react";
import { Chess } from "chess.js"; // Assuming chess.js is used for FEN parsing

const pieceValues = {
  p: 1, // Pawn
  n: 3, // Knight
  b: 3, // Bishop
  r: 5, // Rook
  q: 9, // Queen
};

const initialPieceCount = {
  w: { p: 8, n: 2, b: 2, r: 2, q: 1 },
  b: { p: 8, n: 2, b: 2, r: 2, q: 1 },
};

const calculateCapturedPieces = (fen) => {
  const game = new Chess(fen);
  const board = game.board();

  const remainingPieces = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 },
  };

  // Count pieces on the board
  for (let row of board) {
    for (let square of row) {
      if (square) {
        const pieceType = square.type; // "p", "n", "b", "r", "q"
        const color = square.color; // "w" or "b"
        remainingPieces[color][pieceType] += 1;
      }
    }
  }

  // Calculate captured pieces
  const capturedPieces = {
    w: {},
    b: {},
  };
  let whitePoints = 0;
  let blackPoints = 0;

  for (let piece in initialPieceCount.w) {
    const whiteCaptured = initialPieceCount.w[piece] - remainingPieces.w[piece];
    const blackCaptured = initialPieceCount.b[piece] - remainingPieces.b[piece];

    if (whiteCaptured > 0) {
      capturedPieces.b[piece] = whiteCaptured;
      blackPoints += whiteCaptured * pieceValues[piece];
    }
    if (blackCaptured > 0) {
      capturedPieces.w[piece] = blackCaptured;
      whitePoints += blackCaptured * pieceValues[piece];
    }
  }

  return {
    capturedPieces,
    points: {
      w: whitePoints,
      b: blackPoints,
    },
  };
};

export const CapturedPiecesDisplay = ({ fen }) => {
  const { capturedPieces, points } = useMemo(
    () => calculateCapturedPieces(fen),
    [fen]
  );

  const renderCapturedPiece = (color, piece, count) => {
    const pieceImage = `/chess_pieces/${color}${piece.toUpperCase()}.png`; // Assuming the pieces are in an "images" folder
    return (
      <div key={`${color}${piece}`} className="flex items-center space-x-1">
        <img src={pieceImage} alt={`${color}${piece}`} className="w-7 h-7" />
        <span className="text-gray-800 dark:text-gray-200">x{count}</span>
      </div>
    );
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Captured Pieces
      </h2>

      <div className="mb-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
          Black Captures:
        </h3>
        {Object.keys(capturedPieces.b).length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No captures yet.</p>
        ) : (
          <div className="flex space-x-4">
            {Object.entries(capturedPieces.b).map(([piece, count]) =>
              renderCapturedPiece("w", piece, count)
            )}
          </div>
        )}
        <p className="text-gray-900 dark:text-gray-100">
          Total Points: {points.b}
        </p>
      </div>

      <div>
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
          White Captures:
        </h3>
        {Object.keys(capturedPieces.w).length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No captures yet.</p>
        ) : (
          <div className="flex space-x-4">
            {Object.entries(capturedPieces.w).map(([piece, count]) =>
              renderCapturedPiece("b", piece, count)
            )}
          </div>
        )}
        <p className="text-gray-900 dark:text-gray-100">
          Total Points: {points.w}
        </p>
      </div>
    </>
  );
};
