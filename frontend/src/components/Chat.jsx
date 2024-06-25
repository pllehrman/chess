'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReadyState } from "react-use-websocket";
import { useChat } from '../hooks/useChat'

export function Chat() {
  const WS_URL = process.env.NEXT_PUBLIC_WS_CHAT_URL;
  const username = "Alex";

  const {
    messageHistory, 
    currentMessage,
    setCurrentMessage,
    handleSendMessage,
    readyState } = useChat(WS_URL, username);

  const connectionStatus = {
    [ReadyState.CONNECTING]:'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  return (
    <div>
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