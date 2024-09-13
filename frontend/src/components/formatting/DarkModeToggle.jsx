import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

export default function DarkModeToggle({ darkMode, toggleDarkMode }) {
  return (
    <div className="relative">
      <button
        onClick={toggleDarkMode}
        className="relative z-10 p-1 text-2xl dark:text-gray-800 rounded-lg transition-colors duration-300"
      >
        <FontAwesomeIcon
          icon={darkMode ? faToggleOn : faToggleOff}
          size="2x"
          className="text-white"
        />
      </button>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg blur-md opacity-30 animate-pulse"></div>
    </div>
  );
}
