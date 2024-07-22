import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDarkMode}
        className="relative z-10 p-1 rounded-lg transition-colors duration-300 focus:outline-none bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-2xl"
      >
        <FontAwesomeIcon icon={darkMode ? faToggleOn : faToggleOff} size="2x" />
      </button>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg blur-md opacity-30 animate-pulse"></div>
    </div>
  );
}
