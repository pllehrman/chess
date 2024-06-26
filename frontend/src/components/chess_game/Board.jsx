// components/ChessboardComponent.jsx
import { Chessboard } from 'react-chessboard';
import React from 'react';

export default function Board({ orientation, position, onDrop, customPieces }) {
  return (
    <Chessboard
      id="StyledBoard"
      boardOrientation={orientation} // "white" or "black"
      position={position}
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
