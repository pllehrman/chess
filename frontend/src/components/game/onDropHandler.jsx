import { useRef } from "react";

export function onDropHandler(
  setGame, // Pass safeGameMutate instead of setGame
  checkGameOver,
  sendMove,
  setMoveHistory,
  orientation,
  whiteTime,
  blackTime,
  twoPeoplePresent,
  stockfishWorker, // Stockfish worker
  difficulty
) {
  return (sourceSquare, targetSquare) => {
    if (!difficulty && !twoPeoplePresent) {
      return false;
    }

    const piece = updatedGame.get(sourceSquare);

    if (!piece || piece.color !== orientation[0]) {
      console.error(
        `Invalid move: ${orientation} cannot move ${
          piece ? piece.color : "empty square"
        }`
      );
      return false; // Illegal move
    }

    const move = updatedGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to a queen for simplicity
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
    sendMove(move, updatedGame.fen(), whiteTime, blackTime);

    // Add the move to the move history
    setMoveHistory((prev) => [...prev, move]);

    // Check if the game is over
    checkGameOver();

    return true; // Legal move
  };
}
