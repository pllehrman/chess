import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faHandshake,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { gameControls } from "./utilities/gameControls";

export const MoveTurn = ({
  currentTurn,
  winner,
  result,
  orientation,
  gameData,
  incomingDrawOffer,
  sessionUsername,
  setResult,
  setWinner,
  whiteTime,
  blackTime,
  sendDrawOffer,
  sendGameOver,
  setOutgoingDrawOffer,
  setIncomingDrawOffer,
  twoPeoplepresent,
}) => {
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);

  const { refreshGame, resignGame, offerDraw, acceptDraw, declineDraw } =
    gameControls(
      gameData.type,
      orientation,
      gameData.initialTime,
      gameData.timeIncrement,
      sessionUsername,
      gameData.difficulty,
      setWinner,
      setResult,
      whiteTime,
      blackTime,
      sendDrawOffer,
      sendGameOver,
      setOutgoingDrawOffer,
      setIncomingDrawOffer
    );

  const closeModal = () => {
    setShowNewGameModal(false);
    setShowDrawModal(false);
    setShowResignModal(false);
  };

  let message;
  if (winner) {
    if (winner === "draw") {
      message = `Draw by ${result}`;
    } else if (winner === orientation) {
      message = `You Won by ${result}!`;
    } else {
      message = `You Lost by ${result}!`;
    }
  }

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 rounded-lg p-2">
      {/* Handshake and Flag icons on the left */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex p-4 space-x-4">
        {!winner && (
          <button onClick={() => setShowDrawModal(true)}>
            {gameData.type === "pvp" && twoPeoplepresent && (
              <FontAwesomeIcon
                icon={faHandshake}
                className="text-gray-600 dark:text-gray-300 hover:text-green-500 text-base sm:text-lg md:text-xl"
              />
            )}
          </button>
        )}
        {!winner && (
          <button onClick={() => setShowResignModal(true)}>
            <FontAwesomeIcon
              icon={faFlag}
              className="text-gray-600 dark:text-gray-300 hover:text-red-500 text-base sm:text-lg md:text-xl"
            />
          </button>
        )}
      </div>

      {/* Turn display or game result */}
      <div className="text-center py-2">
        <h2
          className={`text-lg sm:text-xl md:text-2xl font-bold ${
            currentTurn === "w"
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-400 dark:text-gray-500"
          }`}
        >
          {winner
            ? message
            : currentTurn === "w"
            ? "White to Move"
            : "Black to Move"}
        </h2>
      </div>

      {/* Refresh icon on the right */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4">
        <button onClick={() => setShowNewGameModal(true)}>
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 text-base sm:text-lg md:text-xl"
          />
        </button>
      </div>

      {/* Modals */}
      {showNewGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 h-48 p-6 rounded-lg shadow-lg flex flex-col justify-between text-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Do you want to start a new game?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  closeModal();
                  refreshGame();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded w-24"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showDrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 h-48 p-6 rounded-lg shadow-lg flex flex-col justify-between text-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Do you want to offer a draw?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  closeModal();
                  offerDraw();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded w-24"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showResignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 h-48 p-6 rounded-lg shadow-lg flex flex-col justify-between text-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Do you want to resign?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  closeModal();
                  resignGame();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded w-24"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {incomingDrawOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 w-80 sm:w-96 h-48 p-6 rounded-lg shadow-lg flex flex-col justify-between text-center">
            <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
              You have been offered a draw!
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => {
                  acceptDraw();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded w-24"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  declineDraw();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded w-24"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
