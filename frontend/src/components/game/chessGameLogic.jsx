"use client";
import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";

export function chessGameLogic(
  gameData,
  whiteTime,
  blackTime,
  sendMove,
  setMoveHistory,
  moveHistory,
  orientation
) {
  const [game, setGame] = useState(new Chess(gameData.fen));
  const [result, setResult] = useState(null);
  const [winner, setWinner] = useState(null);
  const [invalidMove, setInvalidMove] = useState(false);
  const [invalidMoveSound, setInvalidMoveSound] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/sounds/invalid-move.mp3");
      audio.preload = "auto"; // Preload the audio
      audio.onerror = () => {
        console.error("Error loading the invalid move sound.");
      };
      setInvalidMoveSound(audio); // Set the audio to state
    }
  }, []);

  // add move validation here
  const safeGameMutate = (modify) => {
    setGame((currentGame) => {
      try {
        const gameCopy = new Chess(currentGame.fen());
        const move = modify(gameCopy);

        sendMove(move, gameCopy.fen(), whiteTime, blackTime);
        setMoveHistory((prev) => [...prev, move]);

        return gameCopy;
      } catch (error) {
        console.error("error in mutating game.");
        handleInvalidMove();
        return currentGame;
      }
    });
  };

  const handleInvalidMove = () => {
    setInvalidMove(true);
    invalidMoveSound.play();

    setTimeout(() => {
      setInvalidMove(false);
    }, 2000);
  };

  useEffect(() => {
    // Only update if there's a move in the moveHistory
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];

      // Compare current game FEN with the FEN after the last move
      if (game.turn() !== orientation[0] && game.fen() !== lastMove.after) {
        setGame((currentGame) => {
          // Clone the current game state using the FEN notation
          const gameCopy = new Chess(currentGame.fen());

          // Apply the move to the cloned game state
          gameCopy.move(lastMove);

          // Return the updated game state
          return gameCopy;
        });
      }
    }
  }, [moveHistory, game, orientation]);

  useEffect(() => {
    let gameResult = null;
    let gameWinner = null;
    if (game.isCheckmate()) {
      console.log("Inside Checkmate");
      gameResult = "checkmate";
      gameWinner = game.turn() === "w" ? "black" : "white";
    } else if (game.isDraw()) {
      gameWinner = "draw";
    } else if (game.isStalemate()) {
      gameResult = "Stalemate";
    } else if (game.isThreefoldRepetition()) {
      gameResult = "Threefold Repetition";
    } else if (game.isInsufficientMaterial()) {
      gameResult = "Insufficient Material";
    }
    setResult(gameResult);
    setWinner(gameWinner);
  }, [game]);

  return {
    game,
    result,
    winner,
    safeGameMutate,
    invalidMove,
  };
}
