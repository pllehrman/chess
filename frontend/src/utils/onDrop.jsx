// utils/chessUtils.js

import { Chess } from 'chess.js'; // Ensure you have the chess.js library installed

export default async function onDrop(game, sourceSquare, targetSquare, setGame, ws, checkGameOver) {
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
