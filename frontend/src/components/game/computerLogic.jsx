"use client";

import { Chess } from "chess.js";
import { useEffect, useState, useCallback } from "react";

export function computerLogic(game, setGame, orientation, difficulty) {
  const [worker, setWorker] = useState(null);
  const [isFirstMove, setIsFirstMove] = useState(true);

  useEffect(() => {
    // Check if we are in the browser environment
    if (typeof window !== "undefined") {
      // Dynamically load the Stockfish Web Worker from the public folder
      const stockfishWorker = new Worker("/stockfish/stockfish-16.1-lite.js");
      setWorker(stockfishWorker);

      stockfishWorker.onmessage = (e) => {
        const message = e.data;
        console.log("Stockfish says:", message);

        if (message.startsWith("bestmove")) {
          const bestMove = message.split(" ")[1];
          const from = bestMove.substring(0, 2);
          const to = bestMove.substring(2, 4);

          setTimeout(() => {
            setGame((currentGame) => {
              const newGame = new Chess(currentGame.fen()); // Clone the current game state
              newGame.move({ from, to, promotion: "q" });
              return newGame;
            });
          }, 1000);
        }
      };

      // Send the "uci" command to initialize the engine
      stockfishWorker.postMessage("uci");

      // Set Stockfish's skill level based on difficulty (0 - 20)
      const skillLevel = Math.max(0, Math.min(20, difficulty)); // Clamp between 0 and 20
      stockfishWorker.postMessage(
        `setoption name Skill Level value ${skillLevel}`
      );

      return () => {
        stockfishWorker.terminate(); // Clean up the worker when the component unmounts
      };
    }
  }, []);

  // When the game updates, Stockfish makes a move.
  useEffect(() => {
    if (worker && game && game.turn() != orientation[0]) {
      const depth = Math.floor((10 / 20) * 10) + 1; // Scale depth from 1 to 10 based on difficulty
      worker.postMessage(`position fen ${game.fen()}`);
      worker.postMessage(`go depth ${depth}`);
    }
  }, [game]);

  // Random move should be made when stockfish is first to go
  useEffect(() => {
    console.log(difficulty);
    if (isFirstMove && game.turn() != orientation[0]) {
      if (worker) {
        const possibleMoves = game.moves(); // Get all possible moves for the current turn

        if (possibleMoves.length > 0) {
          // Pick a random move for Stockfish
          const randomMove =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

          // Apply the random move
          setGame((currentGame) => {
            const newGame = new Chess(currentGame.fen());
            newGame.move(randomMove);
            return newGame;
          });
        }
      }
    }
  }, [worker]);

  const handleMove = (sourceSquare, targetSquare) => {
    setGame((currentGame) => {
      const newGame = new Chess(currentGame.fen()); // Clone the current game state
      const move = newGame.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        console.log("invalid move");
        return currentGame;
      }

      return newGame; // Return the updated game state
    });
  };

  return { game, handleMove };
}
