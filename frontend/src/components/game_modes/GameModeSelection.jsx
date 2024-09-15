"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { newChessGame } from "./newChessGame";
import { ShowComputerOptions } from "./ShowComputerOptions";
import { ShowFriendOptions } from "./ShowFriendOptions";
import {
  setServerSideCookie,
  updateCookieUsername,
} from "../game/utilities/setServerSideCookie";
export default function GameModeSelection({ sessionId, sessionUsername }) {
  const [showFriendOptions, setShowFriendOptions] = useState(false);
  const [showComputerOptions, setShowComputerOptions] = useState(false);
  const [timeControl, setTimeControl] = useState(10);
  const [increment, setIncrement] = useState(0);
  const [colorChoice, setColorChoice] = useState("random");
  const [difficulty, setDifficulty] = useState("10");
  const [username, setUsername] = useState(sessionUsername);

  const coinFlip = () => Math.random() < 0.5;

  function handlePlayAgainstComputer() {
    setShowComputerOptions(true);
    setShowFriendOptions(false);
  }

  function handlePlayAgainstFriend() {
    setShowFriendOptions(true);
    setShowComputerOptions(false);
  }

  async function handleStartGame() {
    let orientation =
      colorChoice === "random" ? (coinFlip() ? "white" : "black") : colorChoice;
    const type = showFriendOptions ? "pvp" : "pvc";

    if (showComputerOptions) {
      setTimeControl(null);
      setIncrement(null);
    }

    try {
      const { game, session } = await newChessGame(
        type,
        timeControl,
        increment,
        sessionId,
        username,
        difficulty
      );

      // console.log("Client side session", session);
      if (!sessionId) {
        await setServerSideCookie(session.id, session.username);
      } else if (username != sessionUsername) {
        await updateCookieUsername(session.username);
      }

      if (!game) {
        throw new Error("error in starting a new chess game");
      }

      window.location.href = `/compete/${game.id}/${orientation}`;
    } catch (error) {
      console.error(`error in starting a new chess game: ${error.message}`);
    }
  }
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 ">
      <div className="flex flex-col w-full max-h-[85vh] max-w-[100 vw] md:max-h-[80vh] md:max-w-[45vw] pt-1 pr-2 pl-2 pb-2 md:p-8 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
        <div className="flex flex-grow flex-col items-center space-y-4 p-3 md:p-6 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="w-full space-y-2">
            <label
              htmlFor="username"
              className="block text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 text-center"
            >
              Enter Your Name
            </label>
            <input
              type="text"
              id="username"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={username || "Enter a Username"}
              className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            />
          </div>

          {/* Game Mode Selection */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
            Choose Game Mode
          </h2>
          <div className="flex w-full space-x-2 sm:space-x-4 md:space-x-6">
            <button
              onClick={handlePlayAgainstComputer}
              className="w-1/2 bg-indigo-900 text-white rounded-lg p-2 sm:p-4 md:p-6 text-sm sm:text-base md:text-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex flex-col items-center shadow-md transform transition hover:scale-105"
            >
              <span className="mb-1">Play Against Computer</span>
              <img
                src="/computer.png"
                alt="Computer"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16"
              />
            </button>
            <button
              onClick={handlePlayAgainstFriend}
              className="w-1/2 bg-green-900 text-white rounded-lg p-2 sm:p-4 md:p-6 text-sm sm:text-base md:text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex flex-col items-center shadow-md transform transition hover:scale-105"
            >
              <span className="mb-2">Play Against Friend</span>
              <img
                src="/friends.png"
                alt="Friends"
                className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16"
              />
            </button>
          </div>

          {/* Game Options */}
          <ShowComputerOptions
            showComputerOptions={showComputerOptions}
            handleStartGame={handleStartGame}
            difficulty={difficulty}
            colorChoice={colorChoice}
            setColorChoice={setColorChoice}
            setDifficulty={setDifficulty}
          />
          <ShowFriendOptions
            showFriendOptions={showFriendOptions}
            timeControl={timeControl}
            setTimeControl={setTimeControl}
            increment={increment}
            setIncrement={setIncrement}
            colorChoice={colorChoice}
            setColorChoice={setColorChoice}
            handleStartGame={handleStartGame}
          />
        </div>
      </div>
    </div>
  );
}
