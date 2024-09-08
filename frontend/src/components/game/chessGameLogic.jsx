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
  orientation,
  setIsFirstMove,
  sendGameOver
) {
  const [game, setGame] = useState(new Chess(gameData.fen));
  const [result, setResult] = useState(null);
  const [winner, setWinner] = useState(null);
  const [invalidMove, setInvalidMove] = useState(false);
  const [invalidMoveSound, setInvalidMoveSound] = useState(null);
  const [validMoveSound, setValidMoveSound] = useState(null);
  const [winSound, setWinSound] = useState(null);
  const [lossSound, setLossSound] = useState(null);
  const [drawSound, setDrawSound] = useState(null);
  const gameOver = gameData.winner ? true : false;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const audioInvalid = new Audio("/sounds/invalid-move.mp3");
      audioInvalid.preload = "auto"; // Preload the audio
      audioInvalid.onerror = () => {
        console.error("Error loading the invalid move sound.");
      };

      setInvalidMoveSound(audioInvalid); // Set the audio to state

      const audioValid = new Audio("/sounds/valid-move.wav");
      audioValid.preload = "auto";
      audioValid.onerror = () => {
        console.error("Error loading the valid move sound.");
      };

      setValidMoveSound(audioValid);

      const audioWin = new Audio("/sounds/win.wav");
      audioWin.preload = "auto";
      audioWin.onerror = () => {
        console.error("Error loading the valid move sound.");
      };

      setWinSound(audioWin);

      const audioLoss = new Audio("/sounds/loss.mp3");
      audioLoss.preload = "auto";
      audioLoss.onerror = () => {
        console.error("Error loading the valid move sound.");
      };

      setLossSound(audioLoss);

      const audioDraw = new Audio("/sounds/draw.mp3");
      audioDraw.preload = "auto";
      audioDraw.onerror = () => {
        console.error("Error loading the valid move sound.");
      };

      setDrawSound(audioDraw);
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

        // validMoveSound.play();

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
    // invalidMoveSound.play();

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

  useEffect(() => {
    // If there are two people present and no winner yet
    if (!winner) {
      if (whiteTime === 0) {
        // If White runs out of time
        setResult("lost on time");
        setWinner("black");
      } else if (blackTime === 0) {
        // If Black runs out of time
        setResult("lost on time");
        setWinner("white");
      }
    }
  }, [whiteTime, blackTime]);

  useEffect(() => {
    console.log("Winner", winner && result && !gameOver);
    if (winner && result && !gameOver) {
      console.log("IF evalutates to true!");
      sendGameOver(winner, whiteTime, blackTime);
    }
  }, [winner, result]);

  // Sound effect play
  useEffect(() => {
    if (winner) {
      if (
        (winner === "white" && orientation === "white") ||
        (winner === "black" && orientation === "black")
      ) {
        winSound.play();
      } else if (winner === "draw") {
        console.log("attempting to play!");
        drawSound.play();
      } else {
        lossSound.play();
      }
    }
  }, [winner]);

  return {
    game,
    result,
    winner,
    safeGameMutate,
    invalidMove,
  };
}
