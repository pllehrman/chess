import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faHandshake,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";

export const MoveTurn = ({
  currentTurn,
  winner,
  result,
  orientation,
  onNewGame,
  onOfferDraw,
  onResign,
}) => {
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [showResignModal, setShowResignModal] = useState(false);

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
      message = "You Won: Good Work!";
    } else {
      message = "You Lost: Nice Try!";
    }
  }

  return (
    <div className="relative w-full bg-white dark:bg-gray-800 rounded-lg pb-2">
      {/* Handshake and Flag icons on the left */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex space-x-4">
        <button onClick={() => setShowDrawModal(true)}>
          <FontAwesomeIcon
            icon={faHandshake}
            className="text-gray-600 dark:text-gray-300 hover:text-green-500 text-2xl"
          />
        </button>
        <button onClick={() => setShowResignModal(true)}>
          <FontAwesomeIcon
            icon={faFlag}
            className="text-gray-600 dark:text-gray-300 hover:text-red-500 text-2xl"
          />
        </button>
      </div>

      {/* Turn display or game result */}
      <div className="text-center py-2">
        <h2
          className={`text-2xl font-bold ${
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
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
        <button onClick={() => setShowNewGameModal(true)}>
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 text-2xl"
          />
        </button>
      </div>

      {/* Modals */}
      {/* Modals */}
      {showNewGameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 h-48 p-6 rounded-lg shadow-lg flex flex-col justify-between text-center">
            <p className="text-xl font-semibold">
              Do you want to start a new game?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={onNewGame}
                className="bg-blue-500 text-white px-4 py-2 rounded w-24"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showDrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 h-48 p-6 rounded-lg shadow-lg flex flex-col justify-between text-center">
            <p className="text-xl font-semibold">
              Do you want to offer a draw?
            </p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={onOfferDraw}
                className="bg-green-500 text-white px-4 py-2 rounded w-24"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showResignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 h-48 p-6 rounded-lg shadow-lg flex flex-col justify-between text-center">
            <p className="text-xl font-semibold">Do you want to resign?</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={onResign}
                className="bg-red-500 text-white px-4 py-2 rounded w-24"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded w-24"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
