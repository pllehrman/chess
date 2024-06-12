// components/ChessboardComponent.jsx
import { Chessboard } from 'react-chessboard';
import React from 'react';

export default function Board({ game, onDrop, customPieces }) {
  return (
    <Chessboard
      id="StyledBoard"
      boardOrientation="black"
      position={game.fen()}
      onPieceDrop={onDrop}
      customBoardStyle={{
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
      }}
      customDarkSquareStyle={{ backgroundColor: '#779952' }}
      customLightSquareStyle={{ backgroundColor: '#edeed1' }}
      customPieces={customPieces}
    />
  );
}
