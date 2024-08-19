import React from 'react';

export function Loading() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex space-x-2">
        <div className="bg-gray-700 w-3 h-3 rounded-full animate-bounce"></div>
        <div className="bg-gray-700 w-3 h-3 rounded-full animate-bounce delay-150"></div>
        <div className="bg-gray-700 w-3 h-3 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
