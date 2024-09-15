"use client";

import { useState } from "react";
import { CompletedGames } from "./CompletedGames";
import { InProgressGames } from "./InProgressGames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export function History({ inProgressGames, completedGames }) {
  const [filter, setFilter] = useState("in-progress"); // Default filter is in-progress games

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4 sm:mb-8">
        Chess Game History
      </h1>
      <div className="flex flex-col items-center justify-center dark:bg-gray-800 rounded-lg p-4 shadow-md">
        {/* Filter Section */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <button
            className="flex items-center space-x-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg"
            onClick={() =>
              setFilter(filter === "completed" ? "in-progress" : "completed")
            }
          >
            <FontAwesomeIcon icon={faFilter} className="text-xl" />
            <span>
              {filter === "completed"
                ? "Show In-Progress Games"
                : "Show Completed Games"}
            </span>
          </button>
        </div>

        {/* Conditional Rendering of Games based on Filter */}
        <div className="flex-grow overflow-y-auto w-full max-h-[calc(100vh-200px)]">
          {filter === "completed" ? (
            <CompletedGames completedGames={completedGames} />
          ) : (
            <InProgressGames inProgressGames={inProgressGames} />
          )}
        </div>
      </div>
    </div>
  );
}
