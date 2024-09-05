export function onDropHandler(
  safeGameMutate, // Pass safeGameMutate instead of setGame
  checkGameOver,
  sendMove,
  setMoveHistory,
  orientation,
  whiteTime,
  blackTime,
  twoPeoplePresent,
  worker, // Stockfish worker
  difficulty // Difficulty level for Stockfish
) {
  return (sourceSquare, targetSquare) => {
    // Use safeGameMutate to safely update the game state
    safeGameMutate((updatedGame) => {
      const piece = updatedGame.get(sourceSquare);

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
      sendMove(move, game.fen(), whiteTime, blackTime);

      // Add the move to the move history
      setMoveHistory((prev) => [...prev, move]);

      // Check if the game is over
      checkGameOver();

      // If worker (Stockfish) is available, let Stockfish calculate its move
      if (worker) {
        const depth = Math.floor((difficulty / 20) * 10) + 1; // Scale depth from difficulty

        // Let Stockfish calculate its move
        worker.postMessage(`position fen ${game.fen()}`);
        worker.postMessage(`go depth ${depth}`);
      }

      return true; // Legal move
    });
  };
}
