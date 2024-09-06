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
import { MoveHistory } from "../history/MoveHistory";
import { GameBanner } from "./GameBanner";
import { requestCookie } from "../formatting/requestCookie";
import { computerLogic } from "./computerLogic";

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
    gameData.type === "pvc" ? true : gameData.numPlayers === 1
  );

  if (needsCookie) {
    requestCookie(sessionId);
  }

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
    gameData,
    orientation,
    whiteTime,
    blackTime,
    setWhiteTime,
    setBlackTime,
    setTwoPeoplePresent
  );

  const { game, result, winner, safeGameMutate, invalidMove } = chessGameLogic(
    gameData,
    whiteTime,
    blackTime,
    sendMove,
    setMoveHistory,
    moveHistory,
    orientation
  );

  computerLogic(
    game,
    orientation,
    gameData.difficulty,
    safeGameMutate,
    gameData.type
  );

  console.log("Board Renders!");
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900 pt-8">
      <GameBanner
        twoPeoplePresent={twoPeoplePresent}
        invalidMove={invalidMove}
        inCheck={game.inCheck()}
        result={result}
        winner={winner}
        orientation={orientation}
      />

      <div className="flex w-full max-w-full justify-between items-start px-5 h-full">
        {/* MoveHistory Component */}
        <div className="w-1/4 pl-2 h-full flex flex-col">
          <MoveHistory moveHistory={moveHistory} fen={game.fen()} />
        </div>

        {/* Main Game Component */}
        <div className="w-[90vh] flex flex-col items-center max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {" "}
          {/* Increased width */}
          <h2
            className={`text-2xl font-bold mb-4 ${
              game.turn() === "w"
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {game.turn() === "w" ? "White to Move" : "Black to Move"}
          </h2>
          {gameData.type != "pvc" && (
            <Timers
              whiteTime={whiteTime}
              blackTime={blackTime}
              setWhiteTime={setWhiteTime}
              setBlackTime={setBlackTime}
              increment={gameData.timeIncrement}
              currentTurn={game.turn()}
              twoPeoplePresent={twoPeoplePresent}
            />
          )}
          <Board
            orientation={orientation}
            position={game.fen()}
            onDrop={onDropHandler(
              orientation,
              game,
              twoPeoplePresent,
              safeGameMutate
            )}
          />
        </div>

        {/* Chat Component */}
        <div className="w-1/4 pr-2">
          {" "}
          {gameData.type != "pvc" && (
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
