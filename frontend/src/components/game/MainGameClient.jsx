// components/chess_game/MainGameClient.jsx
"use client";
import { useState, useEffect } from "react";
import { Board } from "./Board";
import Controls from "./Controls";
import ResultNotice from "./ResultNotice";
import { Timers } from "./timers/Timers";
import { chessGameLogic } from "./chessGameLogic";
import { useControlsLogic } from "./useControlsLogic";
import { onDropHandler } from "./onDropHandler";
import { useWebSocket } from "./websocket/useWebSocket";
import { Chat } from "./Chat";
import { MoveHistory } from "./MoveHistory";
import { TwoPeoplePresent } from "./TwoPeoplePresent";
import { useChessPieces } from "./useChessPieces";
import { requestCookie } from "../formatting/requestCookie";

export function MainGameClient({
  gameData,
  orientation,
  sessionId,
  sessionUsername,
  needsCookie,
}) {
  const [whiteTime, setWhiteTime] = useState(gameData.playerBlackTimeRemaining);
  const [blackTime, setBlackTime] = useState(gameData.playerWhiteTimeRemaining);
  const [twoPeoplePresent, setTwoPeoplePresent] = useState(
    gameData.numPlayers === 1
  );
  const [currentTurn, setCurrentTurn] = useState(
    getCurrentTurnFromFEN(gameData.fen)
  );

  if (needsCookie) {
    console.log("NEEDS COOKIE!");
    requestCookie(sessionId);
  }

  const {
    game,
    result,
    winner,
    safeGameMutate,
    checkGameOver,
    setGameOver,
    setResult,
    setWinner,
  } = chessGameLogic(gameData, orientation, setCurrentTurn);

  const {
    messageHistory,
    currentMessage,
    setCurrentMessage,
    sendChat,
    moveHistory,
    sendMove,
    readyState,
    setMoveHistory,
  } = useWebSocket(
    sessionId,
    sessionUsername,
    gameData.id,
    orientation,
    safeGameMutate,
    whiteTime,
    blackTime,
    setWhiteTime,
    setBlackTime,
    setCurrentTurn,
    setTwoPeoplePresent
  );

  const stockfishWorker = computerLogic(
    game,
    safeGameMutate,
    setCurrentTurn,
    difficulty,
    orientation,
    sendMove,
    setMoveHistory
  );

  // console.log("move history:", moveHistory);
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900 pt-8">
      {!gameData.type === "pvc" && (
        <TwoPeoplePresent twoPeoplePresent={twoPeoplePresent} />
      )}

      <div className="flex w-full max-w-full justify-between items-start px-5 h-full">
        {/* MoveHistory Component */}
        <div className="w-1/3 pl-2 h-full flex flex-col">
          {" "}
          {/* Reduced width */}
          <MoveHistory moveHistory={[]} />
        </div>

        {/* Main Game Component */}
        <div className="w-3/5 max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {" "}
          {/* Increased width */}
          <div className="flex flex-col items-center">
            <h2
              className={`text-2xl font-bold mb-4 ${
                currentTurn === "white"
                  ? "text-gray-900 dark:text-gray-100"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {currentTurn === "white" ? "White to Move" : "Black to Move"}
            </h2>
            <Timers
              whiteTime={whiteTime}
              blackTime={blackTime}
              setWhiteTime={setWhiteTime}
              setBlackTime={setBlackTime}
              increment={gameData.timeIncrement}
              currentTurn={currentTurn}
              twoPeoplePresent={twoPeoplePresent}
            />
            <Board
              orientation={orientation}
              position={game.fen()}
              onDrop={onDropHandler(
                safeGameMutate, // Pass safeGameMutate instead of setGame
                checkGameOver,
                sendMove,
                setMoveHistory,
                orientation,
                whiteTime,
                blackTime,
                twoPeoplePresent,
                stockfishWorker,
                difficulty
              )}
            />
            <ResultNotice result={result} winner={winner} />
          </div>
        </div>

        {/* Chat Component */}
        <div className="w-1/3 pr-2">
          {" "}
          {!gameData.type == "pvc" && (
            <Chat
              username={sessionUsername}
              messageHistory={messageHistory}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              sendChat={sendChat}
              readyState={readyState}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const getCurrentTurnFromFEN = (fen) => {
  const parts = fen.split(" ");
  if (parts.length > 1) {
    return parts[1] === "w" ? "white" : "black";
  }
  return "white";
};
