'use client';

import { useState } from 'react';
import { useWebSocket } from '../utils/useWebSocket';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleOnMessage = (event) => {
    const newMessage = event.data;
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const sendMessage = useWebSocket(
    'ws://localhost:3001/chat',
    handleOnMessage,
    () => console.log('Connected to chat WebSocket server.'),
    () => console.log('Disconnected from chat WebSocket server.'),
    (error) => console.error('WebSocket error:', error)
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">{msg}</div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="chat-input-field"
        />
        <button onClick={handleSendMessage} className="chat-send-button">Send</button>
      </div>
    </div>
  );
}
