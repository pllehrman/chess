import { useMemo } from 'react';

const pieces = [
    'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
    'bP', 'bN', 'bB', 'bR', 'bQ', 'bK',
  ];

export const useChessPieces = () => {
    const customPieces = useMemo(() => {
        const pieceComponents = {};

        pieces.forEach((piece) => {
        pieceComponents[piece] = ({ squareWidth }) => (
            <div
            className="bg-no-repeat bg-center"
            style={{
                width: squareWidth,
                height: squareWidth,
                backgroundImage: `url(/${piece}.png)`,
                backgroundSize: '100%',
            }}
            />
        );
        });

        return pieceComponents;
  }, []);

  return customPieces;
};