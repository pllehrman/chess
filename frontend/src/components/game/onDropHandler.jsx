import { useRef } from "react";

export function onDropHandler(
  orientation,
  game,
  twoPeoplePresent,
  safeGameMutate
) {
  return (sourceSquare, targetSquare) => {
    // if (!twoPeoplePresent) {
    //   return false;
    // }

    const piece = game.get(sourceSquare);

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

      return move;
    });

    return true; // Legal move
  };
}
