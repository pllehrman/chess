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
    gameData.numPlayers === 1
  );

  if (needsCookie) {
    console.log("NEEDS COOKIE!");
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
    gameData.id,
    orientation,
    whiteTime,
    blackTime,
    setTwoPeoplePresent
  );

  const {
    game,
    setGame,
    result,
    winner,
    checkGameOver,
    setGameOver,
    setResult,
    setWinner,
    safeGameMutate,
  } = chessGameLogic(gameData, whiteTime, blackTime, sendMove, setMoveHistory);

  const { handleMove } = computerLogic(
    game,
    setGame,
    orientation,
    gameData.difficulty,
    safeGameMutate
  );

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
          <MoveHistory moveHistory={moveHistory} />
        </div>

        {/* Main Game Component */}
        <div className="w-3/5 max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          {" "}
          {/* Increased width */}
          <div className="flex flex-col items-center">
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
              onDrop={
                handleMove

                // onDropHandler(
                // safeGameMutate, // Pass safeGameMutate instead of setGame
                // checkGameOver,
                // sendMove,
                // setMoveHistory,
                // orientation,
                // whiteTime,
                // blackTime,
                // twoPeoplePresent,
                // stockfishWorker,
                // gameData.difficulty
              }
            />
            {/* <ResultNotice result={result} winner={winner} /> */}
          </div>
        </div>

        {/* Chat Component */}
        <div className="w-1/3 pr-2">
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
