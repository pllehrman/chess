// components/chess_game/MainGameClient.jsx
"use client";
import { useState, useEffect } from "react";
import { Board } from "./Board";
import { Timers } from "./Timers";
import { chessGameLogic } from "./utilities/chessGameLogic";
// import { useControlsLogic } from "./utilities/refreshGame";
import { onDropHandler } from "./utilities/onDropHandler";
import { useWebSocket } from "./websocket/useWebSocket";
import { Chat } from "./Chat";
import { MoveHistory } from "../history/MoveHistory";
import { GameBanner } from "./GameBanner";
import { requestCookie } from "../formatting/requestCookie";
import { computerLogic } from "./utilities/computerLogic";
import { MoveTurn } from "./MoveTurn";
import { GameUnavailable } from "./GameUnavailable";

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
  const [result, setResult] = useState(null);
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState(null);
  const [incomingDrawOffer, setIncomingDrawOffer] = useState(null);
  const [outgoingDrawOffer, setOutgoingDrawOffer] = useState(null);

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
    sendDrawOffer,
  } = useWebSocket(
    sessionId,
    sessionUsername,
    gameData,
    orientation,
    whiteTime,
    blackTime,
    setWhiteTime,
    setBlackTime,
    setTwoPeoplePresent,
    setError,
    setResult,
    setWinner,
    setIncomingDrawOffer,
    setOutgoingDrawOffer
  );

  const { game, safeGameMutate, invalidMove } = chessGameLogic(
    gameData,
    whiteTime,
    blackTime,
    sendMove,
    setMoveHistory,
    moveHistory,
    orientation,
    setIsFirstMove,
    sendGameOver,
    result,
    winner,
    setResult,
    setWinner
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
  console.log(error);
  if (error) return <GameUnavailable />;

  console.log("winner", winner, "result", result);
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900 pt-8">
      <GameBanner
        twoPeoplePresent={twoPeoplePresent}
        invalidMove={invalidMove}
        inCheck={game.inCheck()}
        result={result}
        winner={winner}
        orientation={orientation}
        outgoingDrawOffer={outgoingDrawOffer}
      />

      <div className="flex w-full max-w-full justify-between items-start px-5 h-full">
        {/* MoveHistory Component */}
        <div
          className="w-1/4 pl-2 pr-4 h-full flex flex-col"
          style={{
            width: "min(50vh, 30vw)", // Ensure the outer div is a square, constrained by the viewport
            height: "calc(min(65vh, 40vw) + 100px)", // Height is equal to width to maintain a square
          }}
        >
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
        <div
          className="w-1/4 pl-4 pr-2 h-full flex flex-col"
          style={{
            width: "min(50vh, 30vw)", // Ensure the outer div is a square, constrained by the viewport
            height: "calc(min(65vh, 40vw) + 100px)", // Height is equal to width to maintain a square
          }}
        >
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
