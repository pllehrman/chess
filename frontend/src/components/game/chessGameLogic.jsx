import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";

export function ChessGameLogic(
  gameData,
  currentTurn,
  orientation,
  moveHistory
) {
  const [game, setGame] = useState(new Chess());
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [winner, setWinner] = useState(null);

  // Integrate CHESS TIMERS HERE and just send back the game state

  useEffect(() => {
    if (gameData) {
      setGame(new Chess(gameData.fen));
    }
  }, [gameData]);

  // useCallback ensures safeGameMutate maintains the same reference across re-renders
  const safeGameMutate = useCallback((modify) => {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  }, []);

  // This function handles the case when move history changes or a move is made AGAINST the player.
  useEffect(() => {
    if (moveHistory.length > 0 && !(currentTurn === orientation)) {
      const lastMove = moveHistory[moveHistory.length - 1];
      console.log("Applying last move from move history:", lastMove);
      console.log(lastMove);
      safeGameMutate((g) => {
        const result = g.move(lastMove);
        if (result === null) {
          console.error("Invalid move detected:", lastMove);
        }
      });
    }
  }, [moveHistory, safeGameMutate]);

  function checkGameOver() {
    let gameResult = null;
    let gameWinner = null;
    if (game.isCheckmate()) {
      setGameOver(true);
      gameResult = "checkmate";
      gameWinner = game.turn() === "w" ? "black" : "white";
    } else if (game.isDraw()) {
      setGameOver(true);
      gameResult = "draw";
    } else if (game.isStalemate()) {
      setGameOver(true);
      gameResult = "stalemate";
    } else if (game.isThreefoldRepetition()) {
      setGameOver(true);
      gameResult = "threefold repetition";
    } else if (game.isInsufficientMaterial()) {
      setGameOver(true);
      gameResult = "insufficient material";
    }
    setResult(gameResult);
    setWinner(gameWinner);
    return gameResult;
  }

  return {
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
  };
}
