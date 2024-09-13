"use client";
import { useState, useEffect } from "react";
import { Board } from "./Board";
import { chessGameLogic } from "./utilities/chessGameLogic";
import { useWebSocket } from "./websocket/useWebSocket";
import { Chat } from "./Chat";
import { MoveHistory } from "../history/MoveHistory";
import { GameBanner } from "./GameBanner";
import { requestCookie } from "../formatting/requestCookie";
import { computerLogic } from "./utilities/computerLogic";
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
  const [showMoveHistory, setShowMoveHistory] = useState(false);
  const [showChat, setShowChat] = useState(false);

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

  const closeModalOnOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      setShowMoveHistory(false);
      setShowChat(false);
    }
  };

  if (error) return <GameUnavailable />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 dark:bg-gray-900 pt-2">
      <GameBanner
        twoPeoplePresent={twoPeoplePresent}
        invalidMove={invalidMove}
        inCheck={game.inCheck()}
        result={result}
        winner={winner}
        outgoingDrawOffer={outgoingDrawOffer}
        setShowMoveHistory={setShowMoveHistory}
        setShowChat={setShowChat}
        showMoveHistory={showMoveHistory}
        showChat={showChat}
      />

      <div className="relative flex w-full max-w-full justify-center items-start px-2 h-full">
        <div className="flex flex-grow justify-center items-start w-full max-w-6xl">
          {/* MoveHistory Component */}
          {showMoveHistory && (
            <div className="w-1/4 mr-4">
              <MoveHistory moveHistory={moveHistory} fen={game.fen()} />
            </div>
          )}

          {/* Board Component */}
          <div
            className={`${
              showMoveHistory || showChat ? "w-2/4" : "w-full"
            } flex justify-center`}
          >
            <Board
              gameData={gameData}
              game={game}
              winner={winner}
              result={result}
              orientation={orientation}
              sessionUsername={sessionUsername}
              setResult={setResult}
              setWinner={setWinner}
              whiteTime={whiteTime}
              blackTime={blackTime}
              sendGameOver={sendGameOver}
              sendDrawOffer={sendDrawOffer}
              twoPeoplePresent={twoPeoplePresent}
              safeGameMutate={safeGameMutate}
            />
          </div>

          {/* Chat Component */}
          {showChat && (
            <div className="w-1/4 ml-4">
              <Chat
                messageHistory={messageHistory}
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                sendChat={sendChat}
                readyState={readyState}
                twoPeoplePresent={twoPeoplePresent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
