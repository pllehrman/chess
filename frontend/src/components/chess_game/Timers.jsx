'use client'

export function Timers({whiteTime, blackTime}) {

    return (
        <div className="flex justify-between w-full mb-4">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">White</p>
              <p className="text-gray-900 dark:text-gray-100">{Math.floor(whiteTime / 60)}:{('0' + (whiteTime % 60)).slice(-2)}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Black</p>
              <p className="text-gray-900 dark:text-gray-100"> {Math.floor(blackTime / 60)}:{('0' + (blackTime % 60)).slice(-2)}</p>
            </div>
          </div>
    )
}