export function MoveHistory({ moveHistory }) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Move History</h2>
        <div className="mt-4 flex-1 overflow-y-auto">
          {moveHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No moves yet.</p>
          ) : (
            <ul className="space-y-2">
              {moveHistory.map((move, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {move.color === 'w' ? 'White' : 'Black'}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {move.from} to {move.to}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }