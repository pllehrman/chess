import { useEffect, useRef } from 'react';
import WebSocket from 'isomorphic-ws';

export function useWebSocket(url, onMessage, onOpen, onClose, onError, retryInterval = 5000) {
  const ws = useRef(null);
  const shouldReconnect = useRef(true);

  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket(url);

      ws.current.onopen = (event) => {
        console.log('Connected to WebSocket server.');
        if (onOpen) onOpen(event);
      };

      ws.current.onmessage = (event) => {
        if (onMessage) onMessage(event);
      };

      ws.current.onclose = (event) => {
        console.log('Disconnected from WebSocket server');
        if (onClose) onClose(event);
        if (shouldReconnect.current) {
          setTimeout(() => connect(), retryInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
        ws.current.close();
      };
    };

    connect();

    return () => {
      shouldReconnect.current = false;
      if (ws.current) ws.current.close();
    };
  }, [url, onMessage, onOpen, onClose, onError, retryInterval]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.error('WebSocket connection is not open.');
    }
  };

  return sendMessage;
}
