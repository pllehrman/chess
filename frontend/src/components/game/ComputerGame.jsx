"use client";

import { useEffect, useState, useRef } from "react";
import { Board } from "./Board";
import { chessGameLogic } from "./chessGameLogic";
import { Chess } from "chess.js";

export function ComputerGame({ difficulty, orientation }) {
  const [worker, setWorker] = useState(null);
  const [isFirstMove, setIsFirstMove] = useState(true); // Track the first move
  const isFirstRender = useRef(true);

  const {
    game,
    result,
    winner,
    safeGameMutate,
    checkGameOver,
    setGameOver,
    setResult,
    setWinner,
  } = chessGameLogic(gameData, orientation);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stockfishWorker = new Worker("/stockfish/stockfish-16.1-lite.js");
      setWorker(stockfishWorker);

      stockfishWorker.onmessage = (e) => {
        const message = e.data;
        console.log("Stockfish says:", message);

        if (message.startsWith("bestmove")) {
          const bestMove = message.split(" ")[1];
          const from = bestMove.substring(0, 2);
          const to = bestMove.substring(2, 4);
          game.move({ from, to, promotion: "q" });
          setFen(game.fen());
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
  }, [game, difficulty]);

  useEffect(() => {
    if (isFirstRender.current && isFirstMove && orientation === "black") {
      makeRandomMoveAsWhite();
      setIsFirstMove((prevState) => false);
      isFirstRender.current = false; // Set ref to false after the first render
    }
  }, []); // Empty dependency array to ensure it only runs once

  const makeRandomMoveAsWhite = () => {
    const moves = game.moves({ verbose: true });
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      console.log("Random move:", randomMove);
      game.move(randomMove);
      setFen(game.fen());
    }
  };

  const handleMove = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return false;

    setFen(game.fen());

    if (worker) {
      const depth = Math.floor((difficulty / 20) * 10) + 1;
      worker.postMessage(`position fen ${game.fen()}`);
      worker.postMessage(`go depth ${depth}`);
    }

    return true;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900 pt-8">
      <div className="w-3/5 max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <Board
          orientation={orientation}
          position={game.fen()}
          onDrop={handleMove}
        />
      </div>
    </div>
  );
}
