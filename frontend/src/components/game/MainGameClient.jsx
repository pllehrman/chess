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
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for screen size to determine layout (modal or adjacent)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768); // Example breakpoint for mobile (768px)
    };

    checkScreenSize(); // Initial check

    window.addEventListener("resize", checkScreenSize); // Add event listener for window resize
    return () => window.removeEventListener("resize", checkScreenSize); // Clean up listener on unmount
  }, []);

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
      <div className="w-full">
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
          gameType={gameData.type}
          orientation={orientation}
        />
      </div>

      <div className="mt-5 relative flex w-full max-w-full justify-center items-start px-2 h-full">
        {/* MoveHistory Component - Adjacent on Desktop, Modal on Mobile */}
        {showMoveHistory && !isMobileView && (
          <div className="absolute left-0 top-0 w-1/4 pl-2">
            <MoveHistory moveHistory={moveHistory} fen={game.fen()} />
          </div>
        )}

        {/* Modal for Mobile View */}
        {showMoveHistory && isMobileView && (
          <div
            id="modal-background"
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-2 z-20"
            onClick={closeModalOnOutsideClick}
          >
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
              <MoveHistory moveHistory={moveHistory} fen={game.fen()} />
              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
                onClick={() => setShowMoveHistory(false)}
              >
                Close Move History
              </button>
            </div>
          </div>
        )}

        {/* Board Component */}
        <div className="relative flex justify-center w-full max-w-4xl">
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
            setWhiteTime={setWhiteTime}
            setBlackTime={setBlackTime}
            sendGameOver={sendGameOver}
            sendDrawOffer={sendDrawOffer}
            setOutgoingDrawOffer={setOutgoingDrawOffer}
            twoPeoplePresent={twoPeoplePresent}
            safeGameMutate={safeGameMutate}
          />
        </div>

        {/* Chat Component - Adjacent on Desktop, Modal on Mobile */}
        {showChat && !isMobileView && (
          <div className="absolute right-0 top-0 w-1/4 pr-2">
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

        {/* Modal for Mobile View */}
        {showChat && isMobileView && (
          <div
            id="modal-background"
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-2 z-20"
            onClick={closeModalOnOutsideClick}
          >
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md">
              <Chat
                messageHistory={messageHistory}
                currentMessage={currentMessage}
                setCurrentMessage={setCurrentMessage}
                sendChat={sendChat}
                readyState={readyState}
                twoPeoplePresent={twoPeoplePresent}
              />
              <button
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
                onClick={() => setShowChat(false)}
              >
                Close Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
