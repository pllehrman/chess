'use client';

import { ReadyState } from "react-use-websocket";

export function Chat({ username, messageHistory, currentMessage, setCurrentMessage, handleSendMessage, readyState}) {

  const connectionStatus = {
    [ReadyState.CONNECTING]:'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  return (
    <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h1>Hello, {username}</h1>
      <div>Status: {connectionStatus}</div>
      <div>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Enter your message"
        />
        <button onClick={handleSendMessage} disabled={readyState !== ReadyState.OPEN}>
          Send
        </button>
      </div>
      <div>
        <h2>Messages:</h2>
        {messageHistory.map((message, index) => (
          <div key={index}>
            <strong>{message.username}:</strong> {message.message}
          </div>
        ))}
      </div>
    </div>
  );
} 