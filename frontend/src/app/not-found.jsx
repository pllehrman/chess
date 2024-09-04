import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="h-screen overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/chess-board.png')", // Replace with your image path
        backgroundSize: "45%", // Set the image size
        backgroundPosition: "center -10px", // Adjust the position of the background
        backgroundRepeat: "no-repeat", // Prevent the image from repeating
      }}
    >
      <div className="max-w-xl w-full mx-auto text-center p-8 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-lg shadow-md animate-fadeIn">
        <h1 className="text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          404
        </h1>
        <p className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Page Not Found
        </p>
        <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
