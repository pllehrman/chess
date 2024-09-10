"use client";
import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";

export function chessGameLogic(
  gameData,
  whiteTime,
  blackTime,
  sendMove,
  setMoveHistory,
  moveHistory,
  orientation,
  setIsFirstMove,
  sendGameOver,
  result,
  winner,
  setResult,
  setWinner
) {
  const [game, setGame] = useState(new Chess(gameData.fen));
  const [invalidMove, setInvalidMove] = useState(false);

  // Sounds
  const invalidMoveSound = useRef(null);
  const validMoveSound = useRef(null);
  const winSound = useRef(null);
  const lossSound = useRef(null);
  const drawSound = useRef(null);

  const gameOver = gameData.winner ? true : false;

  useEffect(() => {
    if (typeof window !== "undefined") {
      invalidMoveSound.current = new Audio("/sounds/invalid-move.mp3");
      validMoveSound.current = new Audio("/sounds/valid-move.wav");
      winSound.current = new Audio("/sounds/win.wav");
      lossSound.current = new Audio("/sounds/loss.mp3");
      drawSound.current = new Audio("/sounds/draw.mp3");
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
        setIsFirstMove(false);
        // NEed to ensure this doesn't throw an error
        try {
          validMoveSound.current.play();
        } catch (error) {
          console.error("error playing valid move sound:", error);
        }

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

    try {
      invalidMoveSound.current.play();
    } catch (error) {
      console.error("error playing valid move sound:", error);
    }

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
          setIsFirstMove(false);

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
      // console.log("Inside Checkmate");
      gameResult = "Checkmate";
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

  useEffect(() => {
    // If there are two people present and no winner yet
    if (!winner) {
      if (whiteTime === 0) {
        // If White runs out of time
        setResult("Insufficient Time");
        setWinner("black");
      } else if (blackTime === 0) {
        // If Black runs out of time
        setResult("Insufficient Time");
        setWinner("white");
      }
    }
  }, [whiteTime, blackTime]);

  useEffect(() => {
    if (winner && result && !gameOver) {
      sendGameOver(winner, result, whiteTime, blackTime);
    }
  }, [winner, result]);

  useEffect(() => {
    if (gameOver) {
      setWinner(gameData.winner);
      setResult(gameData.result);
    }
  }, []);

  // Sound effect play
  useEffect(() => {
    if (winner) {
      if (
        (winner === "white" && orientation === "white") ||
        (winner === "black" && orientation === "black")
      ) {
        winSound.current.play();
      } else if (winner === "draw") {
        drawSound.current.play();
      } else {
        lossSound.current.play();
      }
    }
  }, [winner]);

  return {
    game,
    safeGameMutate,
    invalidMove,
  };
}
