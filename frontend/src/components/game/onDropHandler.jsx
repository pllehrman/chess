import { Chess } from "chess.js";
import { TwoPeoplePresent } from "./TwoPeoplePresent";

export function onDropHandler(
  safeGameMutate, // Pass safeGameMutate instead of setGame
  checkGameOver,
  sendMove,
  setMoveHistory,
  orientation,
  whiteTime,
  blackTime,
  twoPeoplePresent
) {
  return (sourceSquare, targetSquare) => {
    // Use safeGameMutate to safely update the game state
    safeGameMutate((game) => {
      const piece = game.get(sourceSquare);

      if (!twoPeoplePresent) {
        return false;
      }

      if (!piece || piece.color !== orientation[0]) {
        console.error(
          `Invalid move: ${orientation} cannot move ${
            piece ? piece.color : "empty square"
          }`
        );
        return false; // Illegal move
      }

      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for simplicity
      });

      if (move === null) {
        console.error(
          `Invalid move: ${JSON.stringify({
            from: sourceSquare,
            to: targetSquare,
          })}`
        );
        return false; // Illegal move
      }

      // Send the move over the WebSocket
      sendMove(move, game.fen(), whiteTime, blackTime);

      // Add the move to the move history
      setMoveHistory((prev) => [...prev, move]);

      // Check if the game is over
      checkGameOver();

      return true; // Legal move
    });
  };
}
