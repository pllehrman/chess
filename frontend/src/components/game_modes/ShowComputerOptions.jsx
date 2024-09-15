"use client";

export function ShowComputerOptions({
  showComputerOptions,
  handleStartGame,
  difficulty,
  colorChoice,
  setColorChoice,
  setDifficulty,
}) {
  return (
    showComputerOptions && (
      <div className="w-full space-y-3">
        <div>
          <label className="block text-center text-sm sm:text-base font-medium text-gray-900 dark:text-gray-300">
            Choose Difficulty (ELO)
          </label>
          <div className="">
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span>0 (Easy)</span>
              <span>{difficulty} Difficulty</span>
              <span>20 (Hard)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-center block text-sm sm:text-base font-medium text-gray-900 dark:text-gray-300">
            Choose Your Color
          </label>
          <div className="mt-1 justify-center flex space-x-4">
            {" "}
            {/* Reduced spacing between elements */}
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
          className="w-full bg-blue-600 text-white rounded-lg py-2 sm:py-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
        >
          Start Game
        </button>
      </div>
    )
  );
}
