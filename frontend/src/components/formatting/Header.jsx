"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChessKnight, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function Header({ sessionUsername }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Apply the stored theme on initial load
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <header className="bg-gray-800 text-white flex items-center justify-between dark:bg-gray-900 shadow-lg py-2 sticky top-0 z-50">
      <div className="flex items-center space-x-4 pl-4 sm:pl-6">
        <Link href="/" className="flex items-center space-x-2">
          <FontAwesomeIcon
            icon={faChessKnight}
            className="text-2xl sm:text-3xl text-white dark:text-gray-200"
          />
          <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide">
            chessGambit
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4 pr-4 sm:pr-6">
        {sessionUsername && (
          <div className="text-sm sm:text-lg px-2 sm:px-4 py-1 sm:py-2 text-gray-200">
            Welcome, {sessionUsername}
          </div>
        )}
        <div className="hidden sm:flex items-center space-x-4">
          <Link
            href="/history"
            className="text-sm sm:text-lg px-2 sm:px-4 py-1 sm:py-2 rounded-md bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
          >
            Game History
          </Link>
          <Link
            href="/compete"
            className="text-sm sm:text-lg px-2 sm:px-4 py-1 sm:py-2 rounded-md bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
          >
            Play Chess
          </Link>
          <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-white dark:text-gray-200"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
          {menuOpen && (
            <div className="absolute right-4 top-12 bg-gray-800 dark:bg-gray-900 text-white rounded-lg shadow-lg p-4 space-y-2">
              <Link
                href="/history"
                onClick={() => setMenuOpen(false)} // Close the menu on click
                className="block text-sm px-4 py-2 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Game History
              </Link>
              <Link
                href="/compete"
                onClick={() => setMenuOpen(false)} // Close the menu on click
                className="block text-sm px-4 py-2 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Play Chess
              </Link>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setMenuOpen(false); // Close menu after toggling dark mode
                }}
                className="block text-sm px-4 py-2 bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
              >
                Dark Mode Toggle
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
