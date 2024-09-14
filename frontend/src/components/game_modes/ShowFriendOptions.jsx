export function ShowFriendOptions({
  showFriendOptions,
  timeControl,
  setTimeControl,
  increment,
  setIncrement,
  colorChoice,
  setColorChoice,
  handleStartGame,
}) {
  return (
    showFriendOptions && (
      <div className="space-y-4">
        {" "}
        {/* Reduced vertical spacing */}
        {/* Time Control and Increment side by side */}
        <div className="flex space-x-4 items-end">
          {" "}
          {/* Align items to the bottom */}
          <div className="flex-1">
            <label
              htmlFor="timeControl"
              className="block text-sm sm:text-base font-medium text-gray-900 dark:text-gray-300"
            >
              Time Control (mins)
            </label>
            <input
              type="number"
              id="timeControl"
              value={timeControl}
              onChange={(e) => setTimeControl(e.target.value)}
              className="mt-0 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              min="1"
              max="60"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="increment"
              className="block text-sm sm:text-base font-medium text-gray-900 dark:text-gray-300"
            >
              Increment (secs)
            </label>
            <input
              type="number"
              id="increment"
              value={increment}
              onChange={(e) => setIncrement(e.target.value)}
              className="mt-0 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base sm:text-lg p-1 sm:p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              min="0"
              max="10"
            />
          </div>
        </div>
        {/* Color Choice Section */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-900 dark:text-gray-300">
            Choose Your Color
          </label>
          <div className="mt-1 flex space-x-4">
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
