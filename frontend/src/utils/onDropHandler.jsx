import { Chess } from 'chess.js';

export function onDropHandler(game, setGame, checkGameOver) {
  return (sourceSquare, targetSquare) => {
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

    // Check for game over conditions
    checkGameOver();

    return true; // Legal move
  };
}
