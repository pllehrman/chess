import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";

export function chessGameLogic(
  gameData,
  whiteTime,
  blackTime,
  sendMove,
  setMoveHistory
) {
  const [game, setGame] = useState(new Chess(gameData.fen));
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [winner, setWinner] = useState(null);

  const safeGameMutate = (modify) => {
    setGame((currentGame) => {
      const gameCopy = new Chess(currentGame.fen());
      const move = modify(gameCopy);
      if (move) {
        sendMove(move, gameCopy.fen(), whiteTime, blackTime);
        setMoveHistory((prev) => [...prev, move]);
        checkGameOver();
      } else {
        console.error("Invalid move:", move);
      }

      return gameCopy;
    });
  };

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
    checkGameOver,
    setGameOver,
    setResult,
    setWinner,
    safeGameMutate,
  };
}
