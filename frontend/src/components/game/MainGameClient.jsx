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
import { MoveTurn } from "./MoveTurn";

export function MainGameClient({
  gameData,
  orientation,
  sessionId,
  sessionUsername,
  needsCookie,
}) {
  const [whiteTime, setWhiteTime] = useState(gameData.playerWhiteTimeRemaining);
  const [blackTime, setBlackTime] = useState(gameData.playerBlackTimeRemaining);
  const [twoPeoplePresent, setTwoPeoplePresent] = useState(
    gameData.type === "pvc" ? true : false
  );
  const [isFirstMove, setIsFirstMove] = useState(
    gameData.fen === "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  // BRIGN isGameOVer up to this level and spread it to useWEbsocket. Just have to iron out some of the kinks between history and should be ready to deploy tmrw/monday

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
    sendGameOver,
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
    orientation,
    setIsFirstMove,
    sendGameOver
  );

  computerLogic(
    game,
    orientation,
    gameData.difficulty,
    safeGameMutate,
    gameData.type,
    isFirstMove,
    setIsFirstMove
  );

  // console.log("Board Renders!");
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
        <div
          className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-md pt-4 pr-8 pb-8 pl-8"
          style={{
            width: "min(65vh, 40vw)", // Ensure the outer div is a square, constrained by the viewport
            height: "calc(min(65vh, 40vw) + 100px)", // Height is equal to width to maintain a square
          }}
        >
          <MoveTurn
            currentTurn={game.turn()}
            winner={winner}
            result={result}
            orientation={orientation}
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

          {/* Chessboard should also resize according to the outer square */}
          <div className="flex-1 w-full h-full">
            <Board
              orientation={orientation}
              position={game.fen()}
              onDrop={onDropHandler(
                orientation,
                game,
                twoPeoplePresent,
                safeGameMutate,
                winner
              )}
              boardStyle={{
                width: "100%", // Fill the outer square
                height: "100%", // Keep the chessboard square
              }}
            />
          </div>
        </div>

        {/* Chat Component */}
        <div className="w-1/4 pr-2 h-full flex flex-col">
          {" "}
          {gameData.type != "pvc" && (
            <Chat
              messageHistory={messageHistory}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              sendChat={sendChat}
              readyState={readyState}
              twoPeoplePresent={twoPeoplePresent}
            />
          )}
        </div>
      </div>
    </div>
  );
}
