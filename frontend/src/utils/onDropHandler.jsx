import { Chess } from 'chess.js';

export function onDropHandler(game, setGame, checkGameOver, handleSendMove, orientation, whiteTime, blackTime) {
  return (sourceSquare, targetSquare) => {
    const piece = game.get(sourceSquare);

    if (!piece || piece.color !== orientation[0]) {
      console.error(`Invalid move: ${orientation} cannot move ${piece ? piece.color : 'empty square'}`);
      return false; // Illegal move
    }

    // console.log(`Attempting move from ${sourceSquare} to ${targetSquare}`); // Debug log

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
    setGame(new Chess(game.fen()));

    // Send the move over the web socket
    handleSendMove(move, game.fen(), whiteTime, blackTime);

    // Check for game over conditions
    checkGameOver();

    return true; // Legal move
  };
}
