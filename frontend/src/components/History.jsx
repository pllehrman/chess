import { getAllGamesByUserId } from "@/utils/getAllGamesByUserId";

export async function History() {
    const userId = 0;
    const games = await getAllGamesByUserId(userId);
    const totalGames = games.length;
  
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
            Chess Game History
          </h1>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Total Games Played: {totalGames}
            </h2>
            <div className="space-y-4">
              {games.map((game, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm">
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Result: <span className={`font-bold ${game.result === 'WIN' ? 'text-green-500' : game.result === 'LOSS' ? 'text-red-500' : 'text-yellow-500'}`}>{game.result}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Opponent: {game.opponent}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Date: {game.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }