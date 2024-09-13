"use client";
import { Chessboard } from "react-chessboard";
import { useChessPieces } from "./utilities/useChessPieces";
import { MoveTurn } from "../game/MoveTurn";
import { Timers } from "./Timers";
import { onDropHandler } from "./utilities/onDropHandler";
import React from "react";

export const Board = React.memo(function Board({
  gameData,
  game,
  winner,
  result,
  orientation,
  incomingDrawOffer,
  sessionUsername,
  setResult,
  setWinner,
  whiteTime,
  blackTime,
  sendGameOver,
  sendDrawOffer,
  setOutgoingDrawOffer,
  setIncomingDrawOffer,
  setWhiteTime,
  setBlackTime,
  twoPeoplePresent,
  isFirstMove,
  safeGameMutate,
}) {
  const chessPieces = useChessPieces();
  return (
    <div
      className="
    flex flex-col items-center 
    bg-white dark:bg-gray-800 rounded-lg shadow-md
    w-[min(95vh,95vw)] h-[min(130vh,130vw)]  // Mobile sizes
    sm: w-[55vh] // Desktop sizes
    max-h-[calc(80vh)] max-w-[calc(100vw-10px)] 
    sm:max-h-[73vh] sm:max-w-[calc(100vh-60px)]"
    >
      <MoveTurn
        gameData={gameData}
        currentTurn={game.turn()}
        winner={winner}
        result={result}
        orientation={orientation}
        incomingDrawOffer={incomingDrawOffer}
        sessionUsername={sessionUsername}
        setResult={setResult}
        setWinner={setWinner}
        whiteTime={whiteTime}
        blackTime={blackTime}
        sendGameOver={sendGameOver}
        sendDrawOffer={sendDrawOffer}
        setOutgoingDrawOffer={setOutgoingDrawOffer}
        setIncomingDrawOffer={setIncomingDrawOffer}
        twoPeoplepresent={twoPeoplePresent}
      />

      {gameData.type !== "pvc" && (
        <Timers
          whiteTime={whiteTime}
          blackTime={blackTime}
          setWhiteTime={setWhiteTime}
          setBlackTime={setBlackTime}
          increment={gameData.timeIncrement}
          currentTurn={game.turn()}
          twoPeoplePresent={twoPeoplePresent}
          isFirstMove={isFirstMove}
          winner={winner}
        />
      )}

      {/* Chessboard resizes with the outer container */}
      <div className="w-full h-full p-3">
        <Chessboard
          id="ResponsiveBoard"
          boardOrientation={orientation} // "white" or "black"
          position={game.fen()}
          onPieceDrop={onDropHandler(
            orientation,
            game,
            twoPeoplePresent,
            safeGameMutate,
            winner
          )}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customDarkSquareStyle={{ backgroundColor: "#779952" }}
          customLightSquareStyle={{ backgroundColor: "#edeed1" }}
          customPieces={chessPieces}
        />
      </div>
    </div>
  );
});
