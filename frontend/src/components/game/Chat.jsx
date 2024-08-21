"use client";

import { ReadyState } from "react-use-websocket";

export function Chat({
  username,
  messageHistory,
  currentMessage,
  setCurrentMessage,
  sendChat,
  readyState,
}) {
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-semibold">{username}</h1>
      <div className="text-gray-700 dark:text-gray-300">
        Status: {connectionStatus}
      </div>
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Enter your message"
          className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={sendChat}
          disabled={readyState !== ReadyState.OPEN}
          className={`px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300 ${
            readyState !== ReadyState.OPEN
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          Send
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-bold">Messages:</h2>
        <div className="mt-4 space-y-2">
          {messageHistory.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
          ) : (
            messageHistory.map((message, index) => (
              <div key={index} className="text-gray-800 dark:text-gray-200">
                <strong>{message.username}:</strong> {message.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
