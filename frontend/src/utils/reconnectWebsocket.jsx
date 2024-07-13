import useWebSocket, { ReadyState } from "react-use-websocket";
import { useRef } from 'react';

export const reconnectWebSocket = (WS_URL, username, gameId, orientation, maxRetries = 3) => {
  const retryCount = useRef(0);

  const { sendMessage, readyState, lastMessage, getWebSocket } = useWebSocket(WS_URL, {
    queryParams: { username, gameId, orientation },
    shouldReconnect: (closeEvent) => retryCount.current < maxRetries,
    onClose: () => {
      if (readyState === ReadyState.CLOSED && retryCount < maxRetries) {
        // console.log(`Attempting to reconnect... (${retryCount.current + 1}/${maxRetries})`);
        retryCount.current += 1;
      }
    }
  });

  const handleReconnection = () => {
    if (readyState === ReadyState.CLOSED && retryCount.current < maxRetries) {
      // console.log(`Attempting to reconnect... (${retryCount.current + 1}/${maxRetries})`);
      retryCount.current += 1;
      getWebSocket(); // Reconnect manually if needed
    }
  };

  return {
    sendMessage,
    readyState,
    lastMessage,
    handleReconnection
  };
};
