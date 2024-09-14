import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/chess-board.png')", // Replace with your image path
        backgroundSize: "contain", // Ensures the image is fully visible and responsive
        backgroundPosition: "center", // Keeps the image centered
        backgroundRepeat: "no-repeat", // Prevents repetition
        backgroundAttachment: "fixed", // Keeps the background fixed
      }}
    >
      <div className="max-w-xl w-full mx-auto text-center p-8 bg-white bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-60 rounded-lg shadow-md animate-fadeIn">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          404
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Page Not Found
        </p>
        <p className="text-base sm:text-lg lg:text-xl mb-6 text-gray-600 dark:text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <a
          href="/"
          className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
