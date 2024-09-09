import { useMemo } from "react";

const pieces = [
  "wP",
  "wN",
  "wB",
  "wR",
  "wQ",
  "wK",
  "bP",
  "bN",
  "bB",
  "bR",
  "bQ",
  "bK",
];

export const useChessPieces = () => {
  const chessPieces = useMemo(() => {
    const piecesObj = {};

    pieces.forEach((piece) => {
      piecesObj[piece] = ({ squareWidth }) => (
        <div
          className="bg-no-repeat bg-center"
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/chess_pieces/${piece}.png)`,
            backgroundSize: "100%",
          }}
        />
      );
    });

    return piecesObj;
  }, [pieces]); // Dependencies

  return chessPieces;
};
