"use client";

import { Chess } from "chess.js";
import { useEffect, useState, useRef, useCallback } from "react";

export function computerLogic(
  game,
  orientation,
  difficulty,
  safeGameMutate,
  type,
  isFirstMove,
  setIsFirstMove
) {
  const [worker, setWorker] = useState(null);
  const firstRender = useRef(true);

  useEffect(() => {
    // Detect mobile browsers
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    let stockfishScript;
    if (isMobile) {
      stockfishScript = "/stockfish/stockfish-16.1-lite-single.js";
    } else {
      stockfishScript = "/stockfish/stockfish-16.1-lite.js";
    }
    if (typeof window !== "undefined" && type !== "pvp") {
      // Dynamically load the Stockfish Web Worker from the public folder
      const stockfishWorker = new Worker(stockfishScript);
      setWorker(stockfishWorker);

      stockfishWorker.onmessage = (e) => {
        const message = e.data;
        // console.log("Stockfish says:", message);

        if (message.startsWith("bestmove")) {
          const bestMove = message.split(" ")[1];
          const from = bestMove.substring(0, 2);
          const to = bestMove.substring(2, 4);

          setTimeout(() => {
            safeGameMutate((currentGame) => {
              const move = currentGame.move({ from, to, promotion: "q" });

              return move;
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

      stockfishWorker.postMessage("setoption name Threads value 1");
      stockfishWorker.postMessage("setoption name Hash value 16");

      return () => {
        stockfishWorker.terminate(); // Clean up the worker when the component unmounts
      };
    }
  }, []);

  // When the game updates, Stockfish makes a move.
  useEffect(() => {
    if (worker && game && game.turn() !== orientation[0] && type !== "pvp") {
      const depth = Math.floor((10 / 20) * 10) + 1; // Scale depth from 1 to 10 based on difficulty
      worker.postMessage(`position fen ${game.fen()}`);
      worker.postMessage(`go depth ${depth}`);
    }
  }, [game]);

  // Random move should be made when stockfish is first to go
  useEffect(() => {
    if (
      isFirstMove &&
      firstRender.current &&
      game.turn() != orientation[0] &&
      type !== "pvp"
    ) {
      if (worker) {
        const possibleMoves = game.moves(); // Get all possible moves for the current turn

        if (possibleMoves.length > 0) {
          // Pick a random move for Stockfish
          const randomMove =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

          // Apply the random move
          safeGameMutate((currentGame) => {
            const move = currentGame.move(randomMove);

            return move;
          });
        }
        firstRender.current = false;
        setIsFirstMove(false);
      }
    }
  }, [worker]);
}
