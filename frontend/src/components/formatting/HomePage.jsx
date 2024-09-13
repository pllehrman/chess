"use client";

export function HomePage() {
  return (
    <div
      className="h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/chess-board.png')", // Your chessboard image
        backgroundSize: "contain", // Ensures the image is fully visible
        backgroundPosition: "center", // Keeps the image centered
        backgroundRepeat: "no-repeat", // Prevents repetition
        backgroundAttachment: "fixed", // Keeps it fixed even when scrolling
      }}
    >
      <div className="text-center bg-white bg-opacity-60 dark:bg-gray-800 dark:bg-opacity-60 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          ChessGambit
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-300">
          The fastest way to play multiplayer chess. No login required.
        </p>
      </div>
    </div>
  );
}
