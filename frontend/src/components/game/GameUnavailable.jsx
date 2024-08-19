export function GameUnavailable() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-700 max-w-2xl w-1/2">
        <img src="/unavailable.webp" alt="Unavailable" className="w-32 h-32 mr-4 rounded-full" />
        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">
          We're sorry. This game isn't available right now. The game is either full or has finished. Please check your 
          game invitation and try again.
        </p>
      </div>
    </div>
  );
}
