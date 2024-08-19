"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessKnight } from "@fortawesome/free-solid-svg-icons";

export default function Header({ session }) {
  const username = session?.username; // Extract username if session is present

  return (
    <header className="bg-gray-800 text-white flex items-center justify-between dark:bg-gray-900 shadow-lg py-2 sticky top-0 z-50">
      <div className="flex items-center space-x-4 pl-6">
        <Link href="/" className="flex items-center space-x-2">
          <FontAwesomeIcon
            icon={faChessKnight}
            className="text-3xl text-white dark:text-gray-200"
          />
          <div className="text-3xl font-bold tracking-wide">chessGambit</div>
        </Link>
      </div>
      <div className="flex items-center space-x-4 pr-6">
        {username && (
          <div className="text-lg px-4 py-2 text-gray-200">
            Welcome, {username}
          </div>
        )}
        <Link
          href="/history"
          className="text-lg px-4 py-2 rounded-md bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
        >
          Game History
        </Link>
        <Link
          href="/compete"
          className="text-lg px-4 py-2 rounded-md bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
        >
          Play Chess
        </Link>
        <DarkModeToggle />
      </div>
    </header>
  );
}
