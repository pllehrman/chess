"use client";

import { useEffect, useState, useRef } from "react";

export function computerLogic({
  game,
  difficulty,
  orientation,
  safeGameMutate,
  sendMove,
  setMoveHistory,
}) {
  const [stockfishWorker, setStockFishWorker] = useState(null);
  const [isFirstMove, setIsFirstMove] = useState(true); // Track the first move
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!difficulty) return;

    if (typeof window !== "undefined") {
      const stockfishWorker = new Worker("/stockfish/stockfish-16.1-lite.js");
      setStockFishWorker(stockfishWorker);

      stockfishWorker.onmessage = (e) => {
        const message = e.data;
        console.log("Stockfish says:", message);

        if (message.startsWith("bestmove")) {
          const bestMove = message.split(" ")[1];
          const from = bestMove.substring(0, 2);
          const to = bestMove.substring(2, 4);

          // Safely update the game state using safeGameMutate
          safeGameMutate((updatedGame) => {
            updatedGame.move({ from, to, promotion: "q" });
          });
        }
      };

      stockfishWorker.postMessage("uci");
      const skillLevel = Math.max(0, Math.min(20, difficulty)); // Clamp between 0 and 20
      stockfishWorker.postMessage(
        `setoption name Skill Level value ${skillLevel}`
      );

      return () => {
        stockfishWorker.terminate();
      };
    }
  }, [game]);

  useEffect(() => {
    if (!difficulty) return;

    if (isFirstRender.current && isFirstMove && orientation === "black") {
      makeRandomMoveAsWhite();
      setIsFirstMove((prevState) => false);
      isFirstRender.current = false; // Set ref to false after the first render
    }
  }, []); // Add safeGameMutate as a dependency

  const makeRandomMoveAsWhite = () => {
    const moves = game.moves({ verbose: true });
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      console.log("Random move:", randomMove);

      safeGameMutate((updatedGame) => {
        const move = updatedGame.move(randomMove);

        if (move) {
          sendMove(move, updatedGame.fen(), null, null);
          setMoveHistory((prev) => [...prev, move]);
        }
      });
    }
  };

  return stockfishWorker;
}
