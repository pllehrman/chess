export function GameUnavailable() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="flex flex-col sm:flex-row items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-700 max-w-2xl w-full sm:w-3/4 lg:w-1/2 space-y-4 sm:space-y-0 sm:space-x-4">
        <img
          src="/unavailable.webp"
          alt="Unavailable"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full"
        />
        <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-700 dark:text-gray-300 text-center sm:text-left">
          We're sorry. This game isn't available right now. The game is either
          full or has finished. All games are wiped from the servers after two
          days. Please check your game invitation and try again.
        </p>
      </div>
    </div>
  );
}
