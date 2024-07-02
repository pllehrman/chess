import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';

export function ChessGameLogic(gameData, moveHistory, currentMove, setCurrentMove, handleSendMove) {
  const [game, setGame] = useState(new Chess());
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (gameData) {
      setGame(new Chess(gameData.fen));
      console.log("game position has been set.")
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
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];
      safeGameMutate((g) => {
        g.move(lastMove.move);
      });
    }
  }, [moveHistory, safeGameMutate]);

  // This function handles the case when the current player makes a move and it needs to be sent to the ws.
  useEffect(() => {
    if (currentMove) {
      safeGameMutate((g) => {
        g.move(currentMove);
      });
      handleSendMove(currentMove);
      setCurrentMove(null);
    }
  }, [currentMove, safeGameMutate, handleSendMove, setCurrentMove]);

  function checkGameOver() {
    let gameResult = null;
    let gameWinner = null;
    if (game.isCheckmate()) {
      setGameOver(true);
      gameResult = 'checkmate';
      gameWinner = game.turn() === 'w' ? 'black' : 'white';
    } else if (game.isDraw()) {
      setGameOver(true);
      gameResult = 'draw';
    } else if (game.isStalemate()) {
      setGameOver(true);
      gameResult = 'stalemate';
    } else if (game.isThreefoldRepetition()) {
      setGameOver(true);
      gameResult = 'threefold repetition';
    } else if (game.isInsufficientMaterial()) {
      setGameOver(true);
      gameResult = 'insufficient material';
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
