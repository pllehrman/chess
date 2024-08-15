'use client';

import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white flex items-center justify-between dark:bg-gray-900 shadow-lg py-4">
      <div className="flex-1 flex justify-start pl-16">
        <Link href="/" className="flex items-center space-x-2 ml-4">
          <FontAwesomeIcon icon={faChessKnight} className="text-3xl text-white dark:text-gray-200" />
          <div className="text-3xl font-bold tracking-wide">chessGambit</div>
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <Link 
          href="/compete" 
          className="text-xl px-6 py-3 rounded-md bg-white text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-colors duration-300"
        >
          Play Chess
        </Link>
      </div>
      <div className="flex-1 flex justify-end pr-16">
        <DarkModeToggle className="mr-4" />
      </div>
    </header>
  );
}

