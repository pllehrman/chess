import { useRef } from "react";

export function onDropHandler(
  orientation,
  twoPeoplePresent,
  gameType,
  safeGameMutate
) {
  return (sourceSquare, targetSquare) => {
    if (gameType !== "pvc" && !twoPeoplePresent) {
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

    safeGameMutate((currentGame) => {
      const move = currentGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        console.error("Invalid move");
        return false;
      }

      return move;
    });

    return true; // Legal move
  };
}
