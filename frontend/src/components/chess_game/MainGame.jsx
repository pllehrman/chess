'use client';

import { useMemo, useEffect } from 'react';
import Board from './Board';
import Controls from './Controls';
import ResultNotice from './ResultNotice';
import { ChessGameLogic } from '../../hooks/ChessGameLogic';
import { ChessWebSocket } from '../../hooks/ChessWebSocket';
import { Chess } from 'chess.js';

export default function MainGame({ gameId }) {
  const {
    game,
    setGame,
    gameOver,
    result,
    winner,
    safeGameMutate,
    checkGameOver,
    setGameOver,
    setResult,
    setWinner,
  } = ChessGameLogic();

  const { ws, setGameRef } = ChessWebSocket(setGame, checkGameOver);

  useEffect(() => {
    setGameRef(game);
  }, [game, setGameRef]);

  async function onDrop(sourceSquare, targetSquare) {
    console.log(`Attempting move from ${sourceSquare} to ${targetSquare}`); // Debug log
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for simplicity
    });

    if (move === null) {
      console.error(`Invalid move: ${JSON.stringify({ from: sourceSquare, to: targetSquare })}`);
      return false; // Illegal move
    }

    // Update the game state with the new position
    const updatedGame = new Chess(game.fen());
    setGame(updatedGame);

    if (ws) {
      console.log(`Sending move to WebSocket: ${JSON.stringify({ from: sourceSquare, to: targetSquare, promotion: 'q' })}`); // Debug log
      ws.send(JSON.stringify({ type: 'move', move: { from: sourceSquare, to: targetSquare, promotion: 'q' } }));
    } else {
      console.error('WebSocket connection not established'); // Debug log
    }

    checkGameOver();

    return true; // Legal move
  }

  const pieces = [
    'wP', 'wN', 'wB', 'wR', 'wQ', 'wK',
    'bP', 'bN', 'bB', 'bR', 'bQ', 'bK',
  ];

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

  return (
    <div className="flex flex-col items-center">
      <Board game={game} onDrop={onDrop} customPieces={customPieces} />
      <Controls
        resetGame={() => {
          safeGameMutate((game) => {
            game.reset();
          });
          setGameOver(false);
          setResult(null);
          setWinner(null);
        }}
        undoMove={() => {
          safeGameMutate((game) => {
            game.undo();
          });
        }}
      />
      <ResultNotice result={result} winner={winner} />
    </div>
  );
}
