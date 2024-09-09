"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { newChessGame } from "./newChessGame";

export default function GameModeSelection({ sessionId, sessionUsername }) {
  const router = useRouter();
  const [showFriendOptions, setShowFriendOptions] = useState(false);
  const [showComputerOptions, setShowComputerOptions] = useState(false);
  const [timeControl, setTimeControl] = useState(10);
  const [increment, setIncrement] = useState(0);
  const [colorChoice, setColorChoice] = useState("random");
  const [difficulty, setDifficulty] = useState(10); // New state for difficulty
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
      const game = await newChessGame(
        type,
        orientation,
        timeControl,
        increment,
        username,
        difficulty // Pass the difficulty to the newChessGame function
      );

      if (!game) {
        throw new Error("error in starting a new chess game");
      }

      window.location.href = `/compete/${game.id}/${orientation}`;
    } catch (error) {
      console.error(`error in starting a new chess game: ${error.message}`);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 pb-16">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 space-y-10">
        {/* User Name Input */}
        <div className="space-y-2">
          <label
            htmlFor="username"
            className="block text-lg font-semibold text-gray-900 dark:text-gray-100 text-center"
          >
            Enter Your Name
          </label>
          <input
            type="text"
            id="username"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={username || "Enter a Username"}
            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          />
        </div>

        {/* Game Mode Selection */}
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Choose Game Mode
        </h2>
        <div className="flex space-x-6">
          <button
            onClick={handlePlayAgainstComputer}
            className="w-1/2 bg-indigo-900 text-white rounded-lg py-4 text-xl font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex flex-col items-center shadow-md transform transition hover:scale-105"
          >
            <span className="mb-2">Play Against Computer</span>
            <img src="/computer.png" alt="Computer" className="h-20 w-20" />
          </button>
          <button
            onClick={handlePlayAgainstFriend}
            className="w-1/2 bg-green-900 text-white rounded-lg py-4 text-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex flex-col items-center shadow-md transform transition hover:scale-105"
          >
            <span className="mb-2">Play Against Friend</span>
            <img src="/friends.png" alt="Friends" className="h-20 w-20" />
          </button>
        </div>

        {/* Options for Playing Against Computer */}
        {showComputerOptions && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Choose Your Color
              </label>
              <div className="mt-2 flex space-x-4">
                <label className="text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="colorChoice"
                    value="white"
                    checked={colorChoice === "white"}
                    onChange={() => setColorChoice("white")}
                    className="mr-2"
                  />
                  White
                </label>
                <label className="text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="colorChoice"
                    value="black"
                    checked={colorChoice === "black"}
                    onChange={() => setColorChoice("black")}
                    className="mr-2"
                  />
                  Black
                </label>
                <label className="text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="colorChoice"
                    value="random"
                    checked={colorChoice === "random"}
                    onChange={() => setColorChoice("random")}
                    className="mr-2"
                  />
                  Random
                </label>
              </div>
            </div>

            {/* Difficulty Selection */}
            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Choose Difficulty (ELO)
              </label>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>0 (Easy)</span>
                  <span>{difficulty} Difficulty</span>
                  <span>20(Hard)</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartGame}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Options for Playing Against Friend */}
        {showFriendOptions && (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="timeControl"
                className="block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Time Control (minutes per side)
              </label>
              <input
                type="number"
                id="timeControl"
                value={timeControl}
                onChange={(e) => setTimeControl(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label
                htmlFor="increment"
                className="block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Increment (seconds per move)
              </label>
              <input
                type="number"
                id="increment"
                value={increment}
                onChange={(e) => setIncrement(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                min="0"
                max="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Choose Your Color
              </label>
              <div className="mt-2 flex space-x-4">
                <label className="text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="colorChoice"
                    value="white"
                    checked={colorChoice === "white"}
                    onChange={() => setColorChoice("white")}
                    className="mr-2"
                  />
                  White
                </label>
                <label className="text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="colorChoice"
                    value="black"
                    checked={colorChoice === "black"}
                    onChange={() => setColorChoice("black")}
                    className="mr-2"
                  />
                  Black
                </label>
                <label className="text-gray-900 dark:text-gray-300">
                  <input
                    type="radio"
                    name="colorChoice"
                    value="random"
                    checked={colorChoice === "random"}
                    onChange={() => setColorChoice("random")}
                    className="mr-2"
                  />
                  Random
                </label>
              </div>
            </div>
            <button
              onClick={handleStartGame}
              className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
