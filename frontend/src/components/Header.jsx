'use client';

import Link from 'next/link';
import DarkModeToggle from './DarkModeToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessKnight } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white py-4 dark:bg-gray-900 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faChessKnight} className="text-3xl text-white dark:text-gray-200" />
          <div className="text-3xl font-bold tracking-wide">chessGambit</div>
        </div>
        <ul className="flex space-x-8">
          <li>
            <Link href="/" className="text-xl hover:text-gray-400 transition-colors duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/compete" className="text-xl hover:text-gray-400 transition-colors duration-300">
              Compete
            </Link>
          </li>
          <li>
            <Link href="/history" className="text-xl hover:text-gray-400 transition-colors duration-300">
              History
            </Link>
          </li>
          <li>
            <Link href="/register" className="text-xl hover:text-gray-400 transition-colors duration-300">
              Sign Up
            </Link>
          </li>
        </ul>
        <DarkModeToggle />
      </nav>
    </header>
  );
}
