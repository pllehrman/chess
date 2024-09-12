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
  // Use useRef to persist game state between renders
  const gameRef = useRef(new Chess(gameData.fen));
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

  // Modify safeGameMutate to use the gameRef
  const safeGameMutate = (modify) => {
    try {
      const gameCopy = new Chess(gameRef.current.fen());
      const move = modify(gameCopy);
      gameRef.current = gameCopy; // Update game state directly via useRef
      console.log("Moving from safe game mutate");
      sendMove(move, gameCopy.fen(), whiteTime, blackTime);
      setMoveHistory((prev) => [...prev, move]);
      setIsFirstMove(false);

      try {
        validMoveSound.current.play();
      } catch (error) {
        console.error("error playing valid move sound:", error);
      }
    } catch (error) {
      console.error("error in mutating game.");
      handleInvalidMove();
    }
  };

  const handleInvalidMove = () => {
    setInvalidMove(true);

    try {
      invalidMoveSound.current.play();
    } catch (error) {
      console.error("error playing invalid move sound:", error);
    }

    setTimeout(() => {
      setInvalidMove(false);
    }, 2000);
  };

  // Listen to changes in moveHistory to update the game state
  useEffect(() => {
    if (moveHistory.length > 0) {
      const lastMove = moveHistory[moveHistory.length - 1];

      if (
        gameRef.current.turn() !== orientation[0] &&
        gameRef.current.fen() !== lastMove.after
      ) {
        console.log("Moving from useEffect");
        gameRef.current.move(lastMove);
        setIsFirstMove(false);
      }
    }
  }, [moveHistory, orientation]);

  useEffect(() => {
    let gameResult = null;
    let gameWinner = null;
    if (gameRef.current.isCheckmate()) {
      gameResult = "Checkmate";
      gameWinner = gameRef.current.turn() === "w" ? "black" : "white";
    } else if (gameRef.current.isDraw()) {
      gameWinner = "draw";
    } else if (gameRef.current.isStalemate()) {
      gameResult = "Stalemate";
    } else if (gameRef.current.isThreefoldRepetition()) {
      gameResult = "Threefold Repetition";
    } else if (gameRef.current.isInsufficientMaterial()) {
      gameResult = "Insufficient Material";
    }
    setResult(gameResult);
    setWinner(gameWinner);
  }, []);

  useEffect(() => {
    if (!winner) {
      if (whiteTime === 0) {
        setResult("Insufficient Time");
        setWinner("black");
      } else if (blackTime === 0) {
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
    game: gameRef.current, // Return the current game state
    safeGameMutate,
    invalidMove,
  };
}
