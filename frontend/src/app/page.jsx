'use client';

import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">ChessGambit</h1>
        <p className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">The fastest way to play multiplayer chess. No login required.</p>
        <p className="text-lg text-gray-600 dark:text-gray-400">Welcome to our platform where you can enjoy chess with friends or strangers in real-time.</p>
      </div>
    </main>
  );
}
