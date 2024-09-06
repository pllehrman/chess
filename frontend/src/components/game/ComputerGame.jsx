// This component was memorable since the game state is not being set properly. game should be referenced given its current self.
// setGame((currentGame) => {
//   const newGame = new Chess(currentGame.fen()); // Clone the current game state
//   newGame.move({ from, to, promotion: "q" });
//   return newGame;
// });
// Furthermore, the game.fen wasn't up to date causing all sorts of errors!
// Recall, the React asyncronous state update lifecycle.

"use client";

import { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

export function ComputerGame({ difficulty, orientation }) {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [worker, setWorker] = useState(null);

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
          console.log(game.fen); // this wasn't up to date
          game.move({ from, to, promotion: "q" });
          setFen(game.fen());
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

  const handleMove = (sourceSquare, targetSquare) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Always promote to a queen for simplicity
    });

    if (move === null) return false;

    setFen(game.fen());

    if (worker) {
      // Define a search depth based on the difficulty (0 = easy, 20 = hard)
      const depth = Math.floor((difficulty / 20) * 10) + 1; // Scale depth from 1 to 10 based on difficulty

      // Let Stockfish calculate its move with the specified depth
      console.log(game.fen());
      worker.postMessage(`position fen ${game.fen()}`);
      worker.postMessage(`go depth ${depth}`); // Specify depth to limit the computation
    }

    return true;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900 pt-8">
      {/* Chessboard with Stockfish opponent */}
      <div className="w-3/5 max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <Chessboard
          id="ComputerVsStockfish"
          position={fen}
          onPieceDrop={handleMove} // Handles user moves
          boardOrientation={orientation} // Dynamic orientation based on props
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customDarkSquareStyle={{ backgroundColor: "#779952" }}
          customLightSquareStyle={{ backgroundColor: "#edeed1" }}
        />
      </div>
    </div>
  );
}
