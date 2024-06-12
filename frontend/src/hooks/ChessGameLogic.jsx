// hooks/useChessGame.js
import { useState, useMemo } from 'react';
import { Chess } from 'chess.js';

export function ChessGameLogic() {
  const [game, setGame] = useState(new Chess());
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);
  const [winner, setWinner] = useState(null);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  }

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
